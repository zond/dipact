import "react-native-gesture-handler";
import React, { Suspense, useEffect, useState } from "react";
import { ThemeProvider } from "@rneui/themed";
import { Provider } from "react-redux";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { I18nextProvider } from "react-i18next";
import { Text } from "react-native";

import Router from "./screens/Router";
import { theme } from "./theme";
import i18n from "./i18n";
import FeedbackWrapper from "./components/FeedbackWrapper";
import {
  DiplicityApiProvider,
  TelemetryProvider,
  createTelemetryService,
} from "diplicity-common-internal";
import { createAuthService } from "./services/auth";
import { createStore } from "./store";

const telemetryService = createTelemetryService();
telemetryService.logInfo("Telemetry service created");

telemetryService.logInfo("Creating auth service");
const authService = createAuthService({ telemetryService });
telemetryService.logInfo("Auth service created");

const App = () => {
  const [createStoreResult, setCreateStoreResult] = useState<null | Awaited<
    ReturnType<typeof createStore>
  >>(null);

  useEffect(() => {
    if (!createStoreResult) {
      async function createStoreAsync() {
        telemetryService.logInfo("Creating store");
        const result = await createStore({
          authService,
          telemetryService,
        });
        telemetryService.logInfo("Store created");
        setCreateStoreResult(result);
      }
      createStoreAsync();
    }
  });

  if (!createStoreResult) {
    telemetryService.logInfo("Rendering App, waiting for store creation");
    return null;
  }

  const [store, { diplicityApi }] = createStoreResult;

  telemetryService.logInfo("Rendering App, store created");
  return (
    <SafeAreaProvider>
      <I18nextProvider i18n={i18n}>
        <Suspense fallback={<Text>"Loading..."</Text>}>
          <Provider store={store}>
            <TelemetryProvider telemetryService={telemetryService}>
              <DiplicityApiProvider diplicityApi={diplicityApi}>
                <ThemeProvider theme={theme}>
                  <FeedbackWrapper>
                    <Router />
                  </FeedbackWrapper>
                </ThemeProvider>
              </DiplicityApiProvider>
            </TelemetryProvider>
          </Provider>
        </Suspense>
      </I18nextProvider>
    </SafeAreaProvider>
  );
};

export default App;
