import React from "react";
import { Linking, View } from "react-native";
import { GoogleSigninButton } from "@react-native-google-signin/google-signin";
import { useStyles } from "./Login.styles";
import { loginUrl } from "./Login.util";

const Login = () => {
  const styles = useStyles();

  const handlePress = () => {
    Linking.openURL(loginUrl);
  };

  return (
    <View style={styles.root}>
      <View style={styles.buttonContainer}>
        <GoogleSigninButton size={1} onPress={handlePress} />
      </View>
    </View>
  );
};

export default Login;
