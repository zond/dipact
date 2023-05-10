import { ThunkAction, Action, Middleware } from "@reduxjs/toolkit";
import { IAuthService, ITelemetryService, createAuthApi } from "../../common";
import { createStore } from "./store";

export type CreateStoreOptions = {
  telemetryService: ITelemetryService;
  authService: IAuthService;
};

export type CreateStoreInnerOptions = {
  telemetryMiddleware: Middleware;
  authApi: ReturnType<typeof createAuthApi>;
};

type StoreType = ReturnType<typeof createStore>[0];
export type RootState = ReturnType<StoreType["getState"]>;
export type AppDispatch = StoreType["dispatch"];

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
