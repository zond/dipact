import { configureStore } from "@reduxjs/toolkit";
import {
  CreateStoreOptions,
  createAuthMiddleware,
  createAuthSlice,
  createDiplicityApi,
  createFeedbackSlice,
  createLoginThunk,
  createLogoutThunk,
  createReducer,
  createTelemetryMiddleware,
} from "@diplicity/common";
import { setupListeners } from "@reduxjs/toolkit/dist/query";

export const createStore = async ({
  authService,
  telemetryService,
}: CreateStoreOptions) => {
  const loginThunk = createLoginThunk({ authService });
  const logoutThunk = createLogoutThunk({ authService });
  const diplicityApi = createDiplicityApi({ authService, telemetryService });
  const authSlice = await createAuthSlice({
    diplicityApi,
    telemetryService,
    authService,
    loginThunk,
    logoutThunk,
  });
  const feedbackSlice = createFeedbackSlice({ diplicityApi });
  const store = configureStore({
    reducer: createReducer({
      diplicityApi,
      authSlice,
      feedbackSlice,
    }),
    middleware: (gdm) => [
      ...gdm({ serializableCheck: false })
        .concat(diplicityApi.middleware)
        .concat([
          createTelemetryMiddleware(telemetryService),
          createAuthMiddleware({
            authService,
            authSlice,
            diplicityApi,
            telemetryService,
            loginThunk,
            logoutThunk,
          }),
        ]),
    ],
  });
  setupListeners(store.dispatch);
  return [store, { diplicityApi, authSlice }] as [
    typeof store,
    {
      diplicityApi: typeof diplicityApi;
      authSlice: typeof authSlice;
      feedbackSlice: typeof feedbackSlice;
    }
  ];
};
