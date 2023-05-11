import { IAuthService, ITelemetryService } from "../../services";
import { createReducer } from "./store";

export type CreateStoreOptions = {
  authService: IAuthService;
  telemetryService: ITelemetryService;
};

export type RootState = ReturnType<ReturnType<typeof createReducer>>;
