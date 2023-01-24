import React from "react";
import { ImageBackground, Linking, StyleProp, View } from "react-native";
import { GoogleSigninButton } from "@react-native-google-signin/google-signin";
import { getLoginUrl } from "../utils";

const useStyles = (): StyleProp<any> => {
  return {
    root: {
      flex: 1,
    },
    image: {
      flex: 1,
      justifyContent: "center",
    },
    buttonContainer: {
      flex: 1,
      flexDirection: "row",
      alignItems: "flex-end",
      padding: 24,
      paddingBottom: 48,
    },
    button: {
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
      <ImageBackground
        source={require("../assets/images/login_background.jpg")}
        resizeMode="cover"
        style={styles.image}
      >
        <View style={styles.buttonContainer}>
          <View style={styles.button}>
            <GoogleSigninButton size={1} onPress={handlePress} />
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

export default Login;
