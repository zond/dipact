import { ITelemetryService } from "./telemetry.types";

class TelemetryService implements ITelemetryService {
  public logInfo(message: string): void {
    console.log("[Log Info]", message);
  }
  public logWarning(message: string): void {
    console.warn("[Log Warning]", message);
  }
  public logError(message: string): void {
    console.error("[Log Error]", message);
  }
}

export { TelemetryService };
