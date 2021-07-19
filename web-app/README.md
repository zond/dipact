# Diplicity Web App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Getting started

By default, the app will point towards the real backend service when you bring it up locally. You can also run the application agains a mock service worker. See: [msw](#running-mock-service-worker)

To set up some config files correctly you should use [Make][make]. Once installed run either:

* `make unix` if you're using MacOS or Linux

* `make windows` if you're using Windows

### Docker

You can run the application locally using Docker. This helps when some developers are using Windows and others are using Unix.

#### Prerequisites

This set up uses [Docker][docker] and [Docker Compose][docker-compose] for local
development. Follow the docs to get Docker and Docker Compose installed.

#### Running application locally using Docker

To bring up the application, run `docker-compose up` from this directory. The first time you run this it will take a few minutes to come up but will come up more quickly after first build.

The application will be available on `http://localhost:3001`

### Running without Docker

#### Prerequisites

Ensure that you have yarn installed globally: `npm install -g yarn`.

#### Running application locally using yarn

* Run `yarn install` to install dependencies
* Run `yarn start` to bring up the application

## Running Mock Service Worker

You can run the application against a mock service worker by changing `REACT_APP_USE_MOCK_SERVICE_WORKER` to true in `.env`.

[docker]: https://docs.docker.com/
[docker-compose]: https://docs.docker.com/compose/
[make]: https://www.gnu.org/software/make/