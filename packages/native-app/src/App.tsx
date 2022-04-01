import "react-native-gesture-handler";
import React from "react";
import { ThemeProvider } from "react-native-elements";
import { Provider, useDispatch } from "react-redux";
import { store } from "./store";

import Router from "./screens/Router";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { theme } from "./theme";
import StorybookUI from "./storybook";
import Login from "./screens/Login";
import { Linking } from "react-native";
import { authActions } from "@diplicity/common";
import AuthWrapper from "./components/AuthWrapper";

const LOAD_STORYBOOK: boolean = false;

const App = () => {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <AuthWrapper>
            <Router />
          </AuthWrapper>
        </ThemeProvider>
      </Provider>
    </SafeAreaProvider>
  );
};

export default LOAD_STORYBOOK ? StorybookUI : App;
