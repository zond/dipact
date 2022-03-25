import { combineReducers } from "redux";
import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import {
  reducers as commonReducers,
  middleware as commonMiddleware,
  diplicityService,
} from "@diplicity/common";
import middleware from "./middleware";
import { connectRouter, routerMiddleware } from "connected-react-router";
import { createBrowserHistory } from "history";

export const history = createBrowserHistory();

const createRootReducer = (history: any) =>
  combineReducers({
    router: connectRouter(history),
    ...commonReducers,
  });

export const createStore = () =>
  configureStore({
    reducer: createRootReducer(history),
    middleware: (gdm) => [
      ...gdm({ serializableCheck: false })
        .concat(routerMiddleware(history))
        .concat(diplicityService.middleware)
        .concat(commonMiddleware)
        .concat(middleware),
    ],
  });

export const store = createStore();

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
