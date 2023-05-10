import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import {
  createAuthApi,
  createOrderReducer,
  createTelemetryMiddleware,
  feedbackReducer,
  phaseReducer,
  service,
} from "../../common";
import { CreateStoreInnerOptions, CreateStoreOptions } from "./store.types";

export const createStoreInner = ({
  authApi,
  telemetryMiddleware,
}: CreateStoreInnerOptions) =>
  configureStore({
    reducer: combineReducers({
      createOrder: createOrderReducer,
      feedback: feedbackReducer,
      phase: phaseReducer,
      service: service.reducer,
      [authApi.reducerPath]: authApi.reducer,
    }),
    middleware: (gdm) => [
      ...gdm({ serializableCheck: false })
        .concat(service.middleware)
        .concat([telemetryMiddleware]),
    ],
  });

export const createStore = ({
  authService,
  telemetryService,
}: CreateStoreOptions) => {
  const authApi = createAuthApi(authService);
  const store = configureStore({
    reducer: combineReducers({
      createOrder: createOrderReducer,
      feedback: feedbackReducer,
      phase: phaseReducer,
      service: service.reducer,
      [authApi.reducerPath]: authApi.reducer,
    }),
    middleware: (gdm) => [
      ...gdm({ serializableCheck: false })
        .concat(service.middleware)
        .concat(authApi.middleware)
        .concat([createTelemetryMiddleware(telemetryService)]),
    ],
  });
  setupListeners(store.dispatch);
  return [store, { authApi }] as [typeof store, { authApi: typeof authApi }];
};
