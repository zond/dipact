import { combineReducers } from "redux";
import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import {
  reducers as commonReducers,
  middleware as commonMiddleware,
  diplicityService,
} from "@diplicity/common";

import middleware from "./middleware";
import { storeInitAction } from "./actions";

const reducer = combineReducers({ ...commonReducers });

export const store = configureStore({
  reducer,
  middleware: (gdm) => [
    ...gdm({ serializableCheck: false })
      .concat(diplicityService.middleware)
      .concat(commonMiddleware)
      .concat(middleware),
  ],
});

store.dispatch(storeInitAction());

export const createTestStore = (preloadedState?: RootState) =>
  configureStore({
    reducer,
    middleware: (gdm) => [
      ...gdm({ serializableCheck: false })
        .concat(diplicityService.middleware)
        .concat(commonMiddleware)
        .concat(middleware),
    ],
    preloadedState,
  });

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
