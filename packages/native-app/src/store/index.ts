import { combineReducers } from "redux";
import {
  configureStore,
  ThunkAction,
  Action,
  Middleware,
  AnyAction,
} from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import {
  reducers as commonReducers,
  middleware as commonMiddleware,
  diplicityService,
} from "@diplicity/common";

const reducer = combineReducers({ ...commonReducers });

const debugMiddleware: Middleware<{}, any> =
  ({ getState }) =>
  (next) =>
  (action: AnyAction) => {
    next(action);
    console.log(getState());
    console.log(action);
  };

export const store = configureStore({
  reducer,
  middleware: (gdm) => [
    ...gdm({ serializableCheck: false })
      .concat(diplicityService.middleware)
      .concat(commonMiddleware)
      .concat([debugMiddleware]),
  ],
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
