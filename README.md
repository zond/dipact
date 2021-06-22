[![Deploy](https://github.com/zond/dipact/workflows/Deploy/badge.svg)](https://github.com/zond/dipact/actions)

# dipact

## About

A web client for [diplicity](https://github.com/zond/diplicity).

The latest version is deployed at https://www.diplicity.com.

## Develop

### Community

We discuss the development via mail at [diplicity-dev](https://groups.google.com/forum/#!forum/diplicity-dev)
and via chat at the #development channel on our [Discord server](https://discord.gg/QETtwGR)

### Style guide

This is evolving, and not fully followed, but some guidelines:

* Use [Pretty](https://prettier.io/) to format the code. I use [vim-prettier](https://github.com/prettier/vim-prettier) which changes some settings, I think. Let's discuss how to solve that if someone wants to use Pretty with different settings - I'm totally open to changing this.
* Use CamelCase (or camelCase), not snake_case. I know JavaScript often uses snake_case, but it seems React uses CamelCase, so let's go with that.
* Use inline styles for small local changes, if possible. Save global CSS for themes or global changes.

### Technology

It uses [React](https://reactjs.org/) and [Material-UI](https://material-ui.com/) to render pages.
It also uses [Babel](https://babeljs.io/) to precompile all `.js` files.
This means that all `.js` files are written in [Babel](https://babeljs.io/), not plain JavaScript.

It also means that all `.js` files are transpiled from [Babel](https://babeljs.io/) to plain JavaScript.
This happens via [github.com/zond/dipact/fs](https://godoc.org/github.com/zond/dipact/fs#FileSystem).
When running locally, this happens on the fly and causes page renders to be relatively slow, but the
[deploy script](https://github.com/zond/dipact/blob/master/.github/workflows/deploy.yml) pregenerates
a new [http.FileSystem](https://golang.org/pkg/net/http/#FileSystem) using
[github.com/shurcooL/vfsgen](https://github.com/shurcooL/vfsgen) and
[github.com/jvatic/goja-babel](https://github.com/jvatic/goja-babel) to make production serving fast.

### Running locally

1. Install [Go](https://golang.org/doc/install).
2. Install [Google Cloud SDK](https://cloud.google.com/sdk/docs).
3. Run `dev_appserver.py app.yaml`.
4. Go to http://localhost:8080/.

### Run the tests

1. Run `yarn test` from the project root

### Deploying

The [deploy script](https://github.com/zond/dipact/blob/master/.github/workflows/deploy.yml) causes
the latest version to be pushed to https://dipact.appspot.com/ on each new push.

Pushing branches with sensible names to https://github.com/zond/dipact causes them to be pushed to
https://[branch-name]-dot-dipact.appspot.com/ on each new push.
