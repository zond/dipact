//go:generate go run fs/gen/gen.go
package main

import (
	"log"
	"net/http"

	"github.com/zond/dipact/fs"
	"google.golang.org/appengine"
)

type server struct {
	fileServer http.Handler
}

func (s *server) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path == "/" {
		r.URL.Path = "/app.html"
	}
	s.fileServer.ServeHTTP(w, r)
}

func main() {
	fileSystem := assets
	if appengine.IsDevAppServer() {
		env := map[string]string{
			"ReactJSURL":      "https://unpkg.com/react@16/umd/react.development.js",
			"ReactDOMJSURL":   "https://unpkg.com/react-dom@16/umd/react-dom.development.js",
			"MaterialUIJSURL": "https://unpkg.com/@material-ui/core@latest/umd/material-ui.development.js",
		}
		fileSystem = &fs.FileSystem{
			Root: "resources",
			TransformByExt: map[string]fs.Transform{
				".html": fs.HTMLTransform(env),
				".js":   fs.JSTransform(),
				".css":  func(b []byte) ([]byte, error) { return b, nil },
			},
			LogFunc: log.Printf,
		}
	}
	http.Handle("/", &server{
		fileServer: http.FileServer(fileSystem),
	})
	appengine.Main()
}
