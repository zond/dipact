import {
  AnyAction,
  isRejected,
  isFulfilled,
  isPending,
  Middleware,
} from "@reduxjs/toolkit";
import { ITelemetryService } from "../../services";

const tryGetEndpointName = (action: AnyAction) => {
  const typedAction = action as unknown as {
    meta?: { arg?: { endpointName?: string } };
  };
  return typedAction?.meta?.arg?.endpointName;
};

const createTelemetryMiddleware = (telemetryService: ITelemetryService) => {
  return (() => (next) => (action: AnyAction) => {
    if (isRejected(action)) {
      telemetryService.logInfo(
        `Action ${tryGetEndpointName(
          action
        )} rejected with error ${JSON.stringify(action.error)}`
      );
    } else if (isFulfilled(action)) {
      telemetryService.logInfo(
        `Action ${tryGetEndpointName(action)} fulfilled`
      );
    } else if (isPending(action)) {
      telemetryService.logInfo(`Action ${tryGetEndpointName(action)} pending`);
    } else {
      telemetryService.logInfo(`Action ${action.type}`);
    }
    next(action);
  }) as Middleware;
};

export { createTelemetryMiddleware };
