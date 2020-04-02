//go:generate go run fs/gen/gen.go
package main

import (
	"bytes"
	"fmt"
	"io"
	"log"
	"net/http"
	"path/filepath"

	"github.com/zond/dipact/fs"
	"google.golang.org/appengine"
)

type server struct {
	fileSystem http.FileSystem
	fileServer http.Handler
}

type bufferingResponseWriter struct {
	backend    http.ResponseWriter
	buffer     *bytes.Buffer
	statusCode *int
}

func (w *bufferingResponseWriter) Header() http.Header         { return w.backend.Header() }
func (w *bufferingResponseWriter) Write(b []byte) (int, error) { return w.buffer.Write(b) }
func (w *bufferingResponseWriter) WriteHeader(statusCode int)  { w.statusCode = &statusCode }

func (w *bufferingResponseWriter) flush() error {
	if w.statusCode != nil {
		w.backend.WriteHeader(*w.statusCode)
	}
	_, err := io.Copy(w.backend, w.buffer)
	return err
}

func (s *server) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	hadCB := false
	r.URL.Path, hadCB = fs.RemovePathCB(r.URL.Path)
	if filepath.Ext(filepath.Base(r.URL.Path)) != "" {
		bw := &bufferingResponseWriter{
			backend: w,
			buffer:  &bytes.Buffer{},
		}
		s.fileServer.ServeHTTP(bw, r)
		if hadCB && !appengine.IsDevAppServer() {
			bw.Header().Set("Cache-Control", fmt.Sprintf("max-age: %v", 60*60*24*365))
		}
		if err := bw.flush(); err != nil {
			log.Printf("Unable to flush buffered response writer: %v", err)
			return
		}
		return
	}
	resp, err := s.fileSystem.Open("/app.html")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	stat, err := resp.Stat()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	if r.Header.Get("If-None-Match") == fmt.Sprint(stat.ModTime().UnixNano()) {
		w.WriteHeader(http.StatusNotModified)
		return
	}
	w.Header().Set("Cache-Control", "no-cache")
	w.Header().Set("Last-Modified", stat.ModTime().UTC().Format(http.TimeFormat))
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	w.WriteHeader(http.StatusOK)
	if _, err := io.Copy(w, resp); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	return
}

func main() {
	fileSystem := assets
	if appengine.IsDevAppServer() {
		fileSystem = &fs.FileSystem{
			Root: "resources",
			TransformByExt: fs.DefaultTransformMap(map[string]string{
				"ReactJSURL":      "/static/js/react.development.js",
				"ReactDOMJSURL":   "/static/js/react-dom.development.js",
				"MaterialUIJSURL": "/static/js/material-ui.development.js",
				"JQueryJSURL":     "/static/js/jquery-3.4.1.js",
				"PanZoomJSURL":    "/static/js/panzoom.js",
			}),
			LogFunc: log.Printf,
		}
	}
	http.Handle("/", &server{
		fileServer: http.FileServer(fileSystem),
		fileSystem: fileSystem,
	})
	appengine.Main()
}
