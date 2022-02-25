import React, { useState } from "react";
import { Text, View } from "react-native";
import { Button, Divider } from "react-native-elements";
import GameCard from "../components/GameCard";
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
  User,
} from "@react-native-google-signin/google-signin";

GoogleSignin.configure();

const Login = () => {
  // TODO move to store
  const [userInfo, setUserInfo] = useState<User | undefined>();

  const signIn = async () => {
    console.log("HERE");
    try {
      console.log("NO?");
      console.log(await GoogleSignin.hasPlayServices());
      await GoogleSignin.hasPlayServices();
      console.log("YO?");
      const userInfo = await GoogleSignin.signIn();
      console.log(userInfo);
      setUserInfo(userInfo);
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log(error);
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log(error);
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log(error);
        // play services not available or outdated
      } else {
        console.log(error);
        // some other error happened
      }
    }
  };
  return (
    <View>
      <Text>Login using google</Text>
      <GoogleSigninButton onPress={signIn} />
    </View>
  );
};

export default Login;
