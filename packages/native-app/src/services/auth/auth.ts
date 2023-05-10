import { GoogleSignin } from "@react-native-google-signin/google-signin";

import { ITelemetryService, IAuthService } from "../../../common";

class AuthService implements IAuthService {
  constructor(private telemetry: ITelemetryService) {
    GoogleSignin.configure({
      webClientId:
        "926579634115-67kdr7hhd1qtodbop3r15l358gf0in1u.apps.googleusercontent.com",
    });
  }
  public async getIdToken() {
    try {
      this.telemetry.logInfo("Checking if user has play services");
      const hasPlayServices = await GoogleSignin.hasPlayServices();
      this.telemetry.logInfo(`Has play services: ${hasPlayServices}`);

      this.telemetry.logInfo("Signing in");
      const userInfo = await GoogleSignin.signIn();
      this.telemetry.logInfo("Signed in");

      this.telemetry.logInfo("Checking if ID token is not null");
      const { idToken } = userInfo;
      if (!idToken) {
        throw new Error("ID token is null");
      }
      this.telemetry.logInfo("ID token is not null");
      return idToken;
    } catch (error) {
      if (error instanceof Error) {
        this.telemetry.logError(
          `Error thrown while signing in: ${error.message}`
        );
      } else {
        this.telemetry.logError("Error is not an instance of Error");
      }
      throw error;
    }
  }
}

export { AuthService };
