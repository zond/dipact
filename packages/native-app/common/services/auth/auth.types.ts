import { ITelemetryService } from "../telemetry";

interface IAuthServiceOptions {
  telemetryService: ITelemetryService;
}

interface IAuthService {
  getIdToken: () => Promise<string>;
}

export type { IAuthService, IAuthServiceOptions };
