import React, { useContext, useEffect } from "react";
import { View } from "react-native";
import { GoogleSigninButton } from "@react-native-google-signin/google-signin";
import { useStyles } from "./Login.styles";
import { AuthApiContext, useTelemetry } from "../../../common";

const Login = () => {
  const telemetry = useTelemetry();
  const styles = useStyles();
  const { useLazyLoginQuery } = useContext(AuthApiContext);
  const [login] = useLazyLoginQuery();

  useEffect(() => {
    telemetry.logInfo("Login screen loaded");
  }, [telemetry]);

  const onPressSignIn = async () => {
    telemetry.logInfo("Sign in button pressed");
    login(undefined);
  };

  return (
    <View style={styles.root}>
      <View style={styles.buttonContainer}>
        <GoogleSigninButton size={1} onPress={onPressSignIn} />
      </View>
    </View>
  );
};

export default Login;
