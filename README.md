![Deploy](https://github.com/zond/dipact/workflows/Deploy/badge.svg)

# dipact

A work-in-progress web client to https://github.com/zond/diplicity.

Try latest version at https://dipact.appspot.com.

## Develop

It uses [React](https://reactjs.org/) and [Material-UI](https://material-ui.com/) to render pages. It also uses [Babel](https://babeljs.io/) to precompile all `.js` files. This means that all `.js` files are written in Babel, not plain JavaScript.

It also means that all `.js` files are transpiled from Babel to plain JavaScript. This happens via [github.com/zond/dipact/fs](https://godoc.org/github.com/zond/dipact/fs#FileSystem). When running locally, this happens on the fly and causes page renders to be relatively slow, but the deploy script pregenerates a new (http.FileSystem)[https://golang.org/pkg/net/http/#FileSystem] using [github.com/jvatic/goja-babel](https://github.com/jvatic/goja-babel) to make production serving fast.

## Run locally

1) Install [Google Cloud SDK](https://cloud.google.com/sdk/docs).
2) Run `dev_appserver.py app.yaml`.
3) Go to http://localhost:8080/.

## Deploy

https://github.com/zond/dipact/blob/master/.github/workflows/deploy.yml causes the latest version to be pushed to https://dipact.appspot.com/ on each new push.
