import React from "react";
import { Linking, StyleProp, View } from "react-native";
import { GoogleSigninButton } from "@react-native-google-signin/google-signin";
import { getLoginUrl } from "../utils";

const useStyles = (): StyleProp<any> => {
  return {
    root: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      height: "100%",
    },
    buttonContainer: {
      display: "flex",
      alignItems: "center",
      width: "100%",
    },
  };
};

const url = getLoginUrl();

const Login = () => {
  const styles = useStyles();

  const handlePress = () => {
    Linking.openURL(url);
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
