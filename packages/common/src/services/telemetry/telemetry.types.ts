export interface ITelemetryServiceOptions {}

export interface ITelemetryService {
  /**
   * Delegates to inner telemetry instance `logInfo` method.
   */
  logInfo: (message: string) => void;
  /**
   * Delegates to inner telemetry instance `logWarning` method.
   */
  logWarning: (message: string) => void;
  /**
   * Delegates to inner telemetry instance `logError` method.
   */
  logError: (message: string) => void;
}

export type TelemetryProviderProps = {
  children: React.ReactNode;
  telemetryService: ITelemetryService;
};
