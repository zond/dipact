package main

import (
	"bytes"
	"encoding/binary"
	"fmt"
	"io"
	"io/ioutil"
	"mime"
	"net/http"
	"os"
	"path/filepath"
	"sync"
	"text/template"
	"time"

	"github.com/jvatic/goja-babel"
	"golang.org/x/net/context"
	"google.golang.org/appengine"
	"google.golang.org/appengine/log"
	"google.golang.org/appengine/memcache"
)

type resource struct {
	b       []byte
	modTime time.Time
}

func (r *resource) encode() []byte {
	b := make([]byte, len(r.b)+8)
	binary.LittleEndian.PutUint64(b, uint64(r.modTime.UnixNano()))
	copy(b[8:], r.b)
	return b
}

func (r *resource) decode(b []byte) error {
	if len(b) < 8 {
		return fmt.Errorf("Resource shorter than timestamp: %+v", b)
	}
	r.modTime = time.Unix(0, int64(binary.LittleEndian.Uint64(b)))
	r.b = b[8:]
	return nil
}

type server struct {
	resources     map[string]*resource
	resourcesLock sync.RWMutex
}

func (s *server) init() {
	s.resources = map[string]*resource{}
}

func (s *server) fetchResource(ctx context.Context, key string) (*resource, error) {
	s.resourcesLock.RLock()
	r, found := s.resources[key]
	s.resourcesLock.RUnlock()
	if found {
		return r, nil
	}
	r = &resource{}
	item, err := memcache.Get(ctx, key)
	if err == memcache.ErrCacheMiss {
		return r, nil
	} else if err != nil {
		return nil, err
	}
	if err := r.decode(item.Value); err != nil {
		return nil, err
	}
	return r, nil
}

func (s *server) saveResource(ctx context.Context, r *resource, key string) error {
	s.resourcesLock.Lock()
	s.resources[key] = r
	s.resourcesLock.Unlock()
	return memcache.Set(ctx, &memcache.Item{
		Key:   key,
		Value: r.encode(),
	})
}

func (s *server) parseHTML(ctx context.Context, f io.Reader) ([]byte, error) {
	buf := &bytes.Buffer{}
	if _, err := io.Copy(buf, f); err != nil {
		return nil, err
	}
	templ, err := template.New("").Parse(buf.String())
	if err != nil {
		return nil, err
	}
	buf.Reset()
	env := map[string]string{}
	if appengine.IsDevAppServer() {
		env["ReactJSURL"] = "https://unpkg.com/react@16/umd/react.development.js"
		env["ReactDOMJSURL"] = "https://unpkg.com/react-dom@16/umd/react-dom.development.js"
		env["MaterialUIJSURL"] = "https://unpkg.com/@material-ui/core@latest/umd/material-ui.development.js"
	} else {
		env["ReactJSURL"] = "https://unpkg.com/react@16/umd/react.production.min.js"
		env["ReactDOMJSURL"] = "https://unpkg.com/react-dom@16/umd/react-dom.production.min.js"
		env["MaterialUIJSURL"] = "https://unpkg.com/@material-ui/core@latest/umd/material-ui.production.min.js"
	}
	if err := templ.Execute(buf, env); err != nil {
		return nil, err
	}
	return buf.Bytes(), nil
}

func (s *server) parseJS(ctx context.Context, f io.Reader) ([]byte, error) {
	res, err := babel.Transform(f, map[string]interface{}{
		"plugins": []string{
			"transform-react-jsx",
			"transform-es2015-block-scoping",
		},
	})
	if err != nil {
		return nil, err
	}
	buf := &bytes.Buffer{}
	if _, err := io.Copy(buf, res); err != nil {
		return nil, err
	}
	return buf.Bytes(), nil
}

func (s *server) loadFile(ctx context.Context, f io.Reader) ([]byte, error) {
	b, err := ioutil.ReadAll(f)
	if err != nil {
		return nil, err
	}
	return b, nil
}

func (s *server) getResource(ctx context.Context, path string) (*resource, error) {
	t := time.Now()
	f, err := os.Open(path)
	if err != nil {
		return nil, err
	}
	defer f.Close()
	stat, err := f.Stat()
	if err != nil {
		return nil, err
	}
	r, err := s.fetchResource(ctx, path)
	if err != nil {
		return nil, err
	}
	if !stat.ModTime().After(r.modTime) {
		return r, nil
	}
	var b []byte
	switch filepath.Ext(path) {
	case ".html":
		b, err = s.parseHTML(ctx, f)
	case ".js":
		b, err = s.parseJS(ctx, f)
	case ".css":
		b, err = s.loadFile(ctx, f)
	default:
		err = fmt.Errorf("Unknown resource %#v", path)
	}
	if err != nil {
		return nil, err
	}
	r = &resource{b: b, modTime: stat.ModTime()}
	if err := s.saveResource(ctx, r, path); err != nil {
		return nil, err
	}
	log.Infof(ctx, "Parsed %#v in %v", path, time.Now().Sub(t))
	return r, nil
}

func (s *server) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)
	relPath := filepath.Join("resources", "index.html")
	if r.URL.Path != "/" {
		relPath = filepath.Join("resources", r.URL.Path[1:])
	}
	res, err := s.getResource(ctx, relPath)
	if err != nil {
		if os.IsNotExist(err) {
			http.Error(w, err.Error(), http.StatusNotFound)
		} else {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
		return
	}
	if _, err := io.Copy(w, bytes.NewBuffer(res.b)); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
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
