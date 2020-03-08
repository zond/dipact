package main

import (
	"log"

	"github.com/shurcooL/vfsgen"
	"github.com/zond/dipact/fs"
)

func main() {
	fileSystem := &fs.FileSystem{
		Root: "resources",
		TransformByExt: map[string]fs.Transform{
			".html": fs.HTMLTransform(fs.ProdCDN),
			".js":   fs.JSTransform(),
			".css":  func(b []byte) ([]byte, error) { return b, nil },
		},
	}
	err := vfsgen.Generate(fileSystem, vfsgen.Options{})
	if err != nil {
		log.Fatalln(err)
	}

}
