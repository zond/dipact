import { useContext } from "react";
import { TelemetryContext } from "./telemetry.provider";

const useTelemetry = () => {
  return useContext(TelemetryContext);
};

export { useTelemetry };
