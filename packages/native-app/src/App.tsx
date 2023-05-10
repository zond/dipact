import "react-native-gesture-handler";
import React, { Suspense } from "react";
import { ThemeProvider } from "@rneui/themed";
import { Provider } from "react-redux";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { I18nextProvider } from "react-i18next";
import { Text } from "react-native";

import { createStore } from "./store";
import Router from "./screens/Router";
import { theme } from "./theme";
import i18n from "./i18n";
import FeedbackWrapper from "./components/FeedbackWrapper";
import {
  TelemetryProvider,
  createTelemetryService,
} from "../common/services/telemetry";
import { createAuthService } from "./services/auth";
import { AuthApiProvider } from "../common";

const App = () => {
  const telemetryService = createTelemetryService();
  const authService = createAuthService({ telemetryService });
  const [store, { authApi }] = createStore({ authService, telemetryService });
  return (
    <SafeAreaProvider>
      <I18nextProvider i18n={i18n}>
        <Suspense fallback={<Text>"Loading..."</Text>}>
          <Provider store={store}>
            <TelemetryProvider telemetryService={telemetryService}>
              <AuthApiProvider authApi={authApi}>
                <ThemeProvider theme={theme}>
                  <FeedbackWrapper>
                    <Router />
                  </FeedbackWrapper>
                </ThemeProvider>
              </AuthApiProvider>
            </TelemetryProvider>
          </Provider>
        </Suspense>
      </I18nextProvider>
    </SafeAreaProvider>
  );
};

export default App;
