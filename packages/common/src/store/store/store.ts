import { combineReducers } from "redux";
import { createOrderReducer } from "../createOrder";
import { createFeedbackSlice } from "../feedback";
import { phaseReducer } from "../phase";
import { createDiplicityApi } from "../diplicity";
import {
  createAuthMiddleware,
  createAuthSlice,
  createLoginThunk,
  createLogoutThunk,
} from "../auth";
import { CreateStoreOptions } from "./store.types";
import { configureStore } from "@reduxjs/toolkit";
import { createTelemetryMiddleware } from "../telemetry";
import { setupListeners } from "@reduxjs/toolkit/dist/query";

export const createReducer = ({
  diplicityApi,
  authSlice,
  feedbackSlice,
}: {
  diplicityApi: ReturnType<typeof createDiplicityApi>;
  authSlice: Awaited<ReturnType<typeof createAuthSlice>>;
  feedbackSlice: ReturnType<typeof createFeedbackSlice>;
}) =>
  combineReducers({
    auth: authSlice.reducer,
    createOrder: createOrderReducer,
    feedback: feedbackSlice.reducer,
    phase: phaseReducer,
    [diplicityApi.reducerPath]: diplicityApi.reducer,
  });

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
