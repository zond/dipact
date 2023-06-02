import React, { createContext } from "react";
import { ITelemetryService, TelemetryProviderProps } from "./telemetry.types";
import { createTelemetryService } from ".";

const TelemetryContext = createContext<ITelemetryService>(
  createTelemetryService()
);

const TelemetryProvider = ({
  children,
  telemetryService,
}: TelemetryProviderProps) => {
  return (
    <TelemetryContext.Provider value={telemetryService}>
      {children}
    </TelemetryContext.Provider>
  );
};

export { TelemetryContext, TelemetryProvider };
