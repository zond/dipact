package main

import (
	"log"

	"github.com/shurcooL/vfsgen"
	"github.com/zond/dipact/fs"
)

func main() {
	fileSystem := &fs.FileSystem{
		Root:           "resources",
		TransformByExt: fs.DefaultTransformMap(fs.ProdCDN),
	}
	err := vfsgen.Generate(fileSystem, vfsgen.Options{})
	if err != nil {
		log.Fatalln(err)
	}

}
