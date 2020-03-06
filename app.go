package main

import (
	"html/template"
	"mime"
	"net/http"
	"path/filepath"
	"sync"

	"github.com/bmatcuk/doublestar"
	"golang.org/x/net/context"
	"google.golang.org/appengine"
	"google.golang.org/appengine/log"
)

var (
	templateError      error
	parseTemplatesOnce sync.Once

	templates = map[string]*template.Template{}
)

func parseTemplates(ctx context.Context) {
	files, err := doublestar.Glob("**/*.{html,js,css}")
	if err != nil {
		templateError = err
		return
	}
	for _, file := range files {
		log.Infof(ctx, "Parsing %#v", file)
		templ, err := template.ParseFiles(file)
		if err != nil {
			templateError = err
			return
		}
		templates[file] = templ
	}
}

type NotFoundError string

func (e NotFoundError) Error() string {
	return string(e)
}

func renderTemplate(ctx context.Context, w http.ResponseWriter, r *http.Request, relPath string, withRetry bool) error {
	if templ, found := templates[relPath]; found {
		if appengine.IsDevAppServer() {
			var err error
			if templ, err = template.ParseFiles(relPath); err != nil {
				return err
			}
		}
		if err := templ.Execute(w, nil); err != nil {
			return err
		}
	} else if appengine.IsDevAppServer() && withRetry {
		parseTemplates(ctx)
		return renderTemplate(ctx, w, r, relPath, false)
	} else {
		return NotFoundError(relPath)
	}
	return nil
}

func handle(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)
	parseTemplatesOnce.Do(func() {
		parseTemplates(ctx)
	})
	if templateError != nil {
		http.Error(w, templateError.Error(), http.StatusInternalServerError)
		log.Errorf(ctx, "Unable to parse templates: %v", templateError)
		return
	}
	relPath := filepath.Join("templates", "index.html")
	if r.URL.Path != "/" {
		relPath = filepath.Join("templates", r.URL.Path[1:])
	}
	if err := renderTemplate(ctx, w, r, relPath, appengine.IsDevAppServer()); err != nil {
		if _, isNotFound := err.(NotFoundError); isNotFound {
			http.Error(w, err.Error(), http.StatusNotFound)
			return
		} else {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}
	w.Header().Set("Content-Type", mime.TypeByExtension(filepath.Ext(relPath)))
}

func main() {
	http.Handle("/", http.HandlerFunc(handle))
	appengine.Main()
}
