import { GoogleSignin } from "@react-native-google-signin/google-signin";
import AsyncStorage from "@react-native-community/async-storage";

import { ITelemetryService, IAuthService } from "../../../common";

const serviceUrl = "https://diplicity-engine.appspot.com/";

class AuthService implements IAuthService {
  constructor(private telemetry: ITelemetryService) {
    GoogleSignin.configure({
      webClientId:
        "635122585664-ao5i9f2p5365t4htql1qdb6uulso4929.apps.googleusercontent.com",
      offlineAccess: true,
    });
  }
  public async getTokenFromStorage() {
    this.telemetry.logInfo("Reading token from storage");
    const token = await AsyncStorage.getItem("token");
    this.telemetry.logInfo(`Token is in storage: ${Boolean(token)}`);
    return token;
  }
  public async setTokenInStorage(token: string) {
    this.telemetry.logInfo("Setting token in storage");
    await AsyncStorage.setItem("token", token);
    this.telemetry.logInfo("Token set in storage");
  }
  public async removeTokenFromStorage() {
    this.telemetry.logInfo("Setting token in storage");
    await AsyncStorage.removeItem("token");
    this.telemetry.logInfo("Token set in storage");
  }
  public async getCallbackUrl(serverAuthCode: string) {
    const encodedServerAuthCode = encodeURIComponent(serverAuthCode);
    const encodedState = encodeURIComponent(serviceUrl);
    return `${serviceUrl}Auth/OAuth2Callback?code=${encodedServerAuthCode}&approve-redirect=true&state=${encodedState}`;
  }
  public getTokenFromRedirectUrl(redirectUrl: string) {
    const decodedRedirectUrl = decodeURIComponent(redirectUrl);
    const match = decodedRedirectUrl.match(/token=([^&]*)/);
    if (!match) {
      throw new Error("Could not get token from decoded redirect URL");
    }
    return match[1];
  }
  public async getServerAuthCode() {
    try {
      this.telemetry.logInfo("Checking if user has play services");
      const hasPlayServices = await GoogleSignin.hasPlayServices();
      this.telemetry.logInfo(`Has play services: ${hasPlayServices}`);

      this.telemetry.logInfo("Signing in");
      const userInfo = await GoogleSignin.signIn();
      this.telemetry.logInfo("Signed in");

      this.telemetry.logInfo("Checking server auth code");
      const { serverAuthCode } = userInfo;
      if (!serverAuthCode) {
        throw new Error("Server auth code is null");
      }
      this.telemetry.logInfo("Server auth code is not null");
      return serverAuthCode;
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
