import React, { useContext, useEffect } from "react";
import { View } from "react-native";
import { GoogleSigninButton } from "@react-native-google-signin/google-signin";
import { useStyles } from "./Login.styles";
import { useTelemetry } from "../../../common";
import { DiplicityApiContext } from "../../../common/store/diplicity/diplicity.provider";

const Login = () => {
  const telemetry = useTelemetry();
  const styles = useStyles();
  const diplictyApi = useContext(DiplicityApiContext);
  const [getToken, { isLoading }] = diplictyApi.useLazyGetTokenQuery();

  useEffect(() => {
    telemetry.logInfo("Login screen loaded");
  }, [telemetry]);

  const onPressSignIn = async () => {
    telemetry.logInfo("Sign in button pressed");
    getToken(undefined);
  };

  return (
    <View style={styles.root}>
      <View style={styles.buttonContainer}>
        <GoogleSigninButton
          size={1}
          onPress={onPressSignIn}
          disabled={isLoading}
        />
      </View>
    </View>
  );
};

export default Login;
