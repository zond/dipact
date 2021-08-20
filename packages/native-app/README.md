# Diplicity Native

This package contains functionality that is shared between diplicty web and diplicity native apps.

## Setup

## Android emulator

You need an Android emulator to run the app locally.

Follow the **React Native CLI Quickstart** instructions [here](https://reactnative.dev/docs/environment-setup) to get an android emulator working on your device. Ignore the sections about actually creating an app. We've already done that!

### Running locally

Once you have an Android emulator working on your device, follow these steps to get the application running on the emulator.

* Ensure you have yarn install globally: `npm install -g yarn`.

* From the project root (`dipact/`) run `yarn install` and then run `yarn bootstrap`. This will make the `packages/common` folder available to the app during development. This step takes several minutes.

* Change into the native app directory (`dipact/packages/native-app`) and run `yarn android`. This will launch the app in your emulator.

Once the app is running on your emulator you can check that the `@diplicity/common` package is set up correctly by navigating to `packages/common` and checking that updates to the package are reflected in ht emulator.

### Running the tests

To run the automated tests: `yarn test`

### Running storybook

Storybook allows for components and pages to be developed and tested in isolation form the rest of the app. To get storybook to work on your emulator:

* Open `native-app/App.tsx` and change the `LOAD_STORYBOOK` variable to `true`.

* The storybook experience should now appear instead of the actual app.
