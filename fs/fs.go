package fs

import (
	"bytes"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"path/filepath"
	"regexp"
	"strings"
	"sync"
	"text/template"
	"time"

	"github.com/jvatic/goja-babel"
)

var (
	ProdCDN = map[string]string{
		"ReactJSURL":      "/static/react.production.min.js",
		"ReactDOMJSURL":   "/static/react-dom.production.min.js",
		"MaterialUIJSURL": "/static/material-ui.production.min.js",
	}
	Delims      = []string{"%{", "}%"}
	cbRemoveReg = regexp.MustCompile("-cb[0-9]+cb-")
)

func DefaultTransformMap(env interface{}) map[string]Transform {
	t := time.Now()
	return map[string]Transform{
		".html": HTMLTransform(t, env),
		".js":   JSTransform(t),
		".css":  func(b []byte) ([]byte, error) { return b, nil },
		".ico":  func(b []byte) ([]byte, error) { return b, nil },
	}
}

type Transform func([]byte) ([]byte, error)

func RemovePathCB(s string) (string, bool) {
	found := cbRemoveReg.MatchString(s)
	return cbRemoveReg.ReplaceAllString(s, ""), found
}

func newTemplate(cbTimestamp time.Time) *template.Template {
	return template.New("").Delims(Delims[0], Delims[1]).Funcs(template.FuncMap{
		"cb": func(s string) string {
			return fmt.Sprintf("%v-cb%vcb-", s, cbTimestamp.UnixNano())
		},
	})

}

func HTMLTransform(ts time.Time, env interface{}) Transform {
	return func(in []byte) ([]byte, error) {
		templ, err := newTemplate(ts).Parse(string(in))
		if err != nil {
			return nil, err
		}
		buf := &bytes.Buffer{}
		if err := templ.Execute(buf, env); err != nil {
			return nil, err
		}
		return buf.Bytes(), nil
	}
}

func JSTransform(ts time.Time) Transform {
	return func(in []byte) ([]byte, error) {
		templ, err := newTemplate(ts).Parse(string(in))
		if err != nil {
			return nil, err
		}
		buf := &bytes.Buffer{}
		if err := templ.Execute(buf, nil); err != nil {
			return nil, err
		}
		res, err := babel.Transform(buf, map[string]interface{}{
			"plugins": []string{
				"transform-react-jsx",
				"transform-es2015-block-scoping",
			},
		})
		if err != nil {
			return nil, err
		}
		out, err := ioutil.ReadAll(res)
		if err != nil {
			return nil, err
		}
		return out, nil
	}
}

type fileInfo struct {
	backend os.FileInfo
	file    *file
}

func (fi *fileInfo) Name() string       { return fi.backend.Name() }
func (fi *fileInfo) Mode() os.FileMode  { return fi.backend.Mode() }
func (fi *fileInfo) ModTime() time.Time { return fi.backend.ModTime() }
func (fi *fileInfo) IsDir() bool        { return fi.backend.IsDir() }
func (fi *fileInfo) Sys() interface{}   { return nil }

func (fi *fileInfo) Size() int64 {
	if err := fi.file.load(); err != nil {
		return 0
	}
	return fi.file.reader.Size()
}

type file struct {
	reader     *bytes.Reader
	readerLock sync.RWMutex
	fileSystem *FileSystem
	relPath    string
}

func (f *file) Read(b []byte) (int, error) {
	if err := f.load(); err != nil {
		return 0, err
	}
	return f.reader.Read(b)
}

func (f *file) Seek(offset int64, whence int) (int64, error) {
	if err := f.load(); err != nil {
		return 0, err
	}
	return f.reader.Seek(offset, whence)
}

func (f *file) Close() error { return nil }

func (f *file) load() error {
	path, err := f.fileSystem.cleanPath(f.relPath)
	if err != nil {
		f.fileSystem.log("Unable to create clean path for %#v: %v", f.relPath, err)
		return err
	}
	stat, err := os.Stat(path)
	if err != nil {
		f.fileSystem.log("Unable to stat %#v: %v", f.relPath, err)
		return err
	}
	if stat.IsDir() {
		return nil
	}

	f.readerLock.RLock()
	if f.reader != nil {
		f.readerLock.RUnlock()
		return nil
	}
	f.readerLock.RUnlock()

	transform, found := f.fileSystem.TransformByExt[filepath.Ext(stat.Name())]
	if !found {
		f.fileSystem.log("Unable to find transform for %#v: %v", f.relPath, err)
		return fmt.Errorf("Unknown file type %#v", f.relPath)
	}
	b, err := ioutil.ReadFile(path)
	if err != nil {
		f.fileSystem.log("Unable to read %#v: %v", f.relPath, err)
		return err
	}
	b, err = transform(b)
	if err != nil {
		f.fileSystem.log("Unable to transform %#v: %v", f.relPath, err)
		return err
	}
	f.readerLock.Lock()
	f.reader = bytes.NewReader(b)
	f.readerLock.Unlock()
	f.fileSystem.log("Loaded %#v", f.relPath)
	return nil
}

func (f *file) Stat() (os.FileInfo, error) {
	path, err := f.fileSystem.cleanPath(f.relPath)
	if err != nil {
		return nil, err
	}
	stat, err := os.Stat(path)
	if err != nil {
		return nil, err
	}
	return &fileInfo{
		backend: stat,
		file:    f,
	}, nil
}

func (f *file) Readdir(n int) ([]os.FileInfo, error) {
	path, err := f.fileSystem.cleanPath(f.relPath)
	if err != nil {
		return nil, err
	}
	backend, err := os.Open(path)
	if err != nil {
		return nil, err
	}
	defer backend.Close()
	children, err := backend.Readdir(n)
	if err != nil {
		return nil, err
	}
	approved := []os.FileInfo{}
	for _, child := range children {
		childRelPath := filepath.Join(f.relPath, child.Name())
		childPath, err := f.fileSystem.cleanPath(childRelPath)
		if err != nil {
			return nil, err
		}
		stat, err := os.Stat(childPath)
		if err != nil {
			return nil, err
		}
		if _, found := f.fileSystem.TransformByExt[filepath.Ext(childRelPath)]; found || stat.IsDir() {
			approved = append(approved, &fileInfo{
				backend: stat,
				file: &file{
					fileSystem: f.fileSystem,
					relPath:    childRelPath,
				},
			})
			if n > 0 && len(approved) >= n {
				return approved, nil
			}
		}
	}
	return approved, nil
}

type FileSystem struct {
	Root           string
	TransformByExt map[string]Transform
	LogFunc        func(string, ...interface{})
}

func (fs *FileSystem) cleanPath(relPath string) (string, error) {
	if cleaned := filepath.Clean(filepath.Join(fs.Root, relPath)); cleaned == fs.Root || strings.HasPrefix(cleaned, fs.Root+"/") {
		return cleaned, nil
	}
	return "", fmt.Errorf("Path %#v is not inside root %#v", relPath, fs.Root)
}

func (fs *FileSystem) log(pattern string, args ...interface{}) {
	if fs.LogFunc != nil {
		fs.LogFunc(pattern, args...)
	}
}

func (fs *FileSystem) Open(relPath string) (http.File, error) {
	path, err := fs.cleanPath(relPath)
	if err != nil {
		return nil, err
	}
	stat, err := os.Stat(path)
	if err != nil {
		return nil, err
	}
	if !stat.IsDir() {
		if _, found := fs.TransformByExt[filepath.Ext(relPath)]; !found {
			return nil, fmt.Errorf("Unknown file type %#v", relPath)
		}
	}
	f := &file{
		fileSystem: fs,
		relPath:    relPath,
	}
	return f, nil
}
