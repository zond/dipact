package main

import (
	"bytes"
	"fmt"
	"io"
	"io/ioutil"
	"mime"
	"net/http"
	"os"
	"path/filepath"
	"sync"
	"text/template"

	"github.com/bmatcuk/doublestar"
	"github.com/jvatic/goja-babel"
	"golang.org/x/net/context"
	"google.golang.org/appengine"
	"google.golang.org/appengine/log"
)

type server struct {
	templates               map[string][]byte
	parseTemplatesOnce      sync.Once
	parseTemplatesOnceError error
}

func (s *server) init() {
	s.templates = map[string][]byte{}
	babel.Init(1)
}

func (s *server) parseTemplate(ctx context.Context, path string, devMode bool) error {
	if path == "templates/index.html" {
		templ, err := template.ParseFiles(path)
		if err != nil {
			return err
		}
		buf := &bytes.Buffer{}
		env := map[string]string{}
		if devMode {
			env["ReactJSURL"] = "https://unpkg.com/react@16/umd/react.development.js"
			env["ReactDOMJSURL"] = "https://unpkg.com/react-dom@16/umd/react-dom.development.js"
			env["MaterialUIJSURL"] = "https://unpkg.com/@material-ui/core@latest/umd/material-ui.development.js"
		} else {
			env["ReactJSURL"] = "https://unpkg.com/react@16/umd/react.production.min.js"
			env["ReactDOMJSURL"] = "https://unpkg.com/react-dom@16/umd/react-dom.production.min.js"
			env["MaterialUIJSURL"] = "https://unpkg.com/@material-ui/core@latest/umd/material-ui.production.min.js"
		}
		if err := templ.Execute(buf, env); err != nil {
			return err
		}
		s.templates[path] = buf.Bytes()
	} else if filepath.Ext(path) == ".js" {
		f, err := os.Open(path)
		if err != nil {
			return err
		}
		defer f.Close()
		res, err := babel.Transform(f, map[string]interface{}{
			"plugins": []string{
				"transform-react-jsx",
				"transform-es2015-block-scoping",
			},
		})
		if err != nil {
			return err
		}
		buf := &bytes.Buffer{}
		if _, err := io.Copy(buf, res); err != nil {
			return err
		}
		s.templates[path] = buf.Bytes()
	} else if filepath.Ext(path) == ".css" {
		b, err := ioutil.ReadFile(path)
		if err != nil {
			return err
		}
		s.templates[path] = b
	}
	log.Infof(ctx, "Parsed %#v", path)
	return nil
}

func (s *server) parseTemplates(ctx context.Context, devMode bool) error {
	paths, err := doublestar.Glob("templates/**/*.{html,js,css}")
	if err != nil {
		return err
	}
	for _, path := range paths {
		if err := s.parseTemplate(ctx, path, devMode); err != nil {
			return err
		}
	}
	return nil
}

func (s *server) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)
	devMode := r.URL.Query().Get("dev-mode") == "yes" || appengine.IsDevAppServer()
	s.parseTemplatesOnce.Do(func() {
		s.parseTemplatesOnceError = s.parseTemplates(ctx, devMode)
	})
	if s.parseTemplatesOnceError != nil {
		http.Error(w, s.parseTemplatesOnceError.Error(), http.StatusInternalServerError)
		log.Errorf(ctx, "Unable to parse templates: %v", s.parseTemplatesOnceError)
		return
	}
	relPath := filepath.Join("templates", "index.html")
	if r.URL.Path != "/" {
		relPath = filepath.Join("templates", r.URL.Path[1:])
	}
	if devMode {
		if err := s.parseTemplate(ctx, relPath, devMode); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}
	if b, found := s.templates[relPath]; found {
		if _, err := io.Copy(w, bytes.NewBuffer(b)); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	} else {
		http.Error(w, fmt.Sprintf("%#v not found", relPath), http.StatusNotFound)
		return
	}
	w.Header().Set("Content-Type", mime.TypeByExtension(filepath.Ext(relPath)))
}

func main() {
	s := &server{}
	s.init()
	http.Handle("/", s)
	appengine.Main()
}
