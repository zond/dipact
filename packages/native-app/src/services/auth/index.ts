import { AuthService } from "./auth";
import { IAuthService, IAuthServiceOptions } from "diplicity-common-internal";

const createAuthService = (options: IAuthServiceOptions): IAuthService => {
  return new AuthService(options.telemetryService);
};

export { createAuthService };
