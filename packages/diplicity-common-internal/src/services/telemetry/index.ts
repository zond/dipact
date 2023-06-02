import { TelemetryService } from "./telemetry";
import { ITelemetryService } from "./telemetry.types";
import { TelemetryProvider } from "./telemetry.provider";
import { useTelemetry } from "./telemetry.hooks";

const createTelemetryService = (): TelemetryService => {
  return new TelemetryService();
};

export { createTelemetryService, TelemetryProvider, useTelemetry };

export type { ITelemetryService };
