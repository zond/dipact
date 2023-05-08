import React from "react";
import { Linking, View } from "react-native";
import {
  GoogleSignin,
  GoogleSigninButton,
} from "@react-native-google-signin/google-signin";
import { useStyles } from "./Login.styles";
import { loginUrl } from "./Login.util";

GoogleSignin.configure();

const signIn = async () => {
  try {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();
    console.log(userInfo);
  } catch (error) {
    console.log(error);
  }
};

const Login = () => {
  const styles = useStyles();

  const handlePress = () => {
    Linking.openURL(loginUrl);
  };

  return (
    <View style={styles.root}>
      <View style={styles.buttonContainer}>
        <GoogleSigninButton size={1} onPress={signIn} />
      </View>
    </View>
  );
};

export default Login;
