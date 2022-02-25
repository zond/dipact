import "react-native-gesture-handler";
import React from "react";
import { ThemeProvider } from "react-native-elements";
import { Provider } from "react-redux";
import { store } from "./store";

import Router from "./screens/Router";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { theme } from "./theme";
import StorybookUI from "./storybook";
import Login from "./screens/Login";

const LOAD_STORYBOOK: boolean = false;

const App = () => {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Login />
          {/* <Router /> */}
        </ThemeProvider>
      </Provider>
    </SafeAreaProvider>
  );
};

export default LOAD_STORYBOOK ? StorybookUI : App;
