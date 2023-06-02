import { IAuthService, ITelemetryService } from "../../services";
import { createDiplicityApi } from "../diplicity";
import { createAuthSlice, createLoginThunk, createLogoutThunk } from "./auth";

export type Auth = {
  token: string | null;
  loggedIn: boolean;
};

export type CreateAuthSliceOptions = {
  diplicityApi: ReturnType<typeof createDiplicityApi>;
  authService: IAuthService;
  telemetryService: ITelemetryService;
  loginThunk: ReturnType<typeof createLoginThunk>;
  logoutThunk: ReturnType<typeof createLogoutThunk>;
};

export type CreateAuthMiddlewareOptions = {
  authSlice: Awaited<ReturnType<typeof createAuthSlice>>;
  diplicityApi: ReturnType<typeof createDiplicityApi>;
  authService: IAuthService;
  telemetryService: ITelemetryService;
  loginThunk: ReturnType<typeof createLoginThunk>;
  logoutThunk: ReturnType<typeof createLogoutThunk>;
};

export type CreateLoginThunkOptions = {
  authService: IAuthService;
};

export type CreateLogoutThunkOptions = {
  authService: IAuthService;
};
