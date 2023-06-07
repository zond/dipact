# Diplicity Native

This package contains functionality that is shared between diplicty web and diplicity native apps.

## Setup

## Android emulator

You need an Android emulator to run the app locally.

Follow the **React Native CLI Quickstart** instructions [here](https://reactnative.dev/docs/environment-setup) to get an android emulator working on your device. Ignore the sections about actually creating an app. We've already done that!

### Running locally

Once you have an Android emulator working on your device, follow these steps to get the application running on the emulator.

- During development, we want changes to packages/common to be reflected
  immediately in the android emulator. To do this we need to follow a few steps:
  - Build the package: inside `packages/common` run `yarn build:native`
  - Link the package: inside `packages/common` run `yarn link`
  - Link the package to native-app: inside native app run `yarn link @diplicity/common`
  - Watch for changes in common: inside `packages/common` run `yarn build:watch:native`
- Change into the native app directory (`dipact/packages/native-app`) and run `yarn android`. This will launch the app in your emulator.

Once the app is running on your emulator you can check that the `@diplicity/common` package is set up correctly by navigating to `packages/common` and checking that updates to the package are reflected in ht emulator.

### Running the tests

To run the automated tests: `yarn test`
