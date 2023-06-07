import {
  AnyAction,
  isFulfilled,
  isPending,
  Middleware,
  isRejectedWithValue,
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
    if (isRejectedWithValue(action)) {
      telemetryService.logInfo(
        `Action ${tryGetEndpointName(
          action
        )} rejected with payload: ${JSON.stringify(
          action.payload
        )}; error: ${JSON.stringify(action.error)}`
      );
    } else if (isFulfilled(action)) {
      telemetryService.logInfo(
        `Action ${tryGetEndpointName(action)} fulfilled`
      );
    } else if (isPending(action)) {
      telemetryService.logInfo(
        `Action ${tryGetEndpointName(action) || action.type} pending`
      );
    } else {
      telemetryService.logInfo(`Action ${action.type}`);
    }
    next(action);
  }) as Middleware;
};

export { createTelemetryMiddleware };
