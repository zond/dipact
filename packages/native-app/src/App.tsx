import "react-native-gesture-handler";
import React, { Suspense } from "react";
import { ThemeProvider } from "@rneui/themed";
import { Provider } from "react-redux";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { I18nextProvider } from "react-i18next";
import { Text } from "react-native";

import { store } from "./store";
import Router from "./screens/Router";
import { theme } from "./theme";
import AuthWrapper from "./components/AuthWrapper";
import i18n from "./i18n";
import FeedbackWrapper from "./components/FeedbackWrapper";

const App = () => {
  return (
    <SafeAreaProvider>
      <I18nextProvider i18n={i18n}>
        <Suspense fallback={<Text>"Loading..."</Text>}>
          <Provider store={store}>
            <ThemeProvider theme={theme}>
              <FeedbackWrapper>
                <AuthWrapper>
                  <Router />
                </AuthWrapper>
              </FeedbackWrapper>
            </ThemeProvider>
          </Provider>
        </Suspense>
      </I18nextProvider>
    </SafeAreaProvider>
  );
};

export default App;
