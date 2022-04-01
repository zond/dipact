import React from "react";
import { StyleProp, StyleSheet, Text, TextInput, View } from "react-native";
import { Button, CheckBox, Input } from "react-native-elements";
import { useTheme } from "../hooks";
import Switch from "../components/Switch";
import TextInputContainer from "../components/TextInputContainer";
import { translateKeys as tk } from "@diplicity/common";

const values = {
  enableEmailNotifications: false,
  enablePushNotifications: true,
  phaseDeadline: "60",
};

const onValueChange = () => {};

const useStyles = () => {
  const theme = useTheme();
  return StyleSheet.create({
    root: {
      padding: theme.spacing(1),
    },
    input: {
      borderBottomColor: theme.palette.border.main,
      borderBottomWidth: 1,
      paddingVertical: 0,
    },
  });
};

const CreateGame = () => {
  const styles = useStyles();

  const isLoading = false;
  const isError = false;
  const error = null;

  const handleBlur = (valueName: string) => {};
  const handleChange = (valueName: string) => {};

  const values = {
    name: "The Game's name",
    privateGame: true,
    gameMaster: true,
  };

  return (
    <View style={styles.root}>
      {isLoading ? (
        <View></View>
      ) : isError && error ? (
        <View></View>
      ) : (
        <View>
          <View>
            <Input
              label={<Text>{tk.createGame.nameInput.label}</Text>}
              placeholder={tk.createGame.nameInput.label}
              value={values.name}
              onChangeText={() => handleChange("name")}
            />
            <CheckBox
              title={tk.createGame.privateCheckbox.label}
              checked={values.privateGame}
              onPress={() => handleChange("privateGame")}
            />
            <CheckBox
              title={tk.createGame.gameMasterCheckbox.label}
              checked={values.gameMaster}
              onPress={() => handleChange("gameMaster")}
            />
          </View>
        </View>
      )}
    </View>
  );
};

export default CreateGame;
