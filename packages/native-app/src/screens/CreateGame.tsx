import React, { SyntheticEvent, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { CheckBox, Input } from "@rneui/themed";
import { useTheme } from "../hooks/useTheme";
import { translateKeys as tk, useCreateGame } from "@diplicity/common";
import { useTranslation } from "react-i18next";

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

type HandleChange = (
  fieldName: string
) => (value: string | boolean | number) => void;

const CreateGame = () => {
  const styles = useStyles();
  const { t } = useTranslation();

  const getMoviesFromApiAsync = async () => {
    try {
      const response = await fetch("https://diplicity-engine.appspot.com/", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Diplicity-API-Level": "8",
        "X-Diplicity-Client-Name": "dipact@",
      },
      });
      const json = await response.json();
      console.log(json);
    } catch (error) {
      console.error(error);
    }
  };

  getMoviesFromApiAsync();

  const {
    error,
    isError,
    isLoading,
    handleChange: unTypedHandleChange,
    setFieldValue,
    values,
    variants,
  } = useCreateGame();
  const handleChange = unTypedHandleChange as HandleChange;

  return (
    <View style={styles.root}>
      {isLoading ? (
        <View>
          <Text>Loading...</Text>
        </View>
      ) : isError && error ? (
        <View>
          <Text>Error!</Text>
        </View>
      ) : (
        <View>
          <View>
            <Input
              label={<Text>{t(tk.createGame.nameInput.label)}</Text>}
              accessibilityLabel={t(tk.createGame.nameInput.label)}
              placeholder={t(tk.createGame.nameInput.label)}
              value={values.name}
              onChangeText={handleChange("name")}
              shake={() => {}}
            />
            <CheckBox
              title={t(tk.createGame.privateCheckbox.label)}
              accessibilityLabel={t(tk.createGame.privateCheckbox.label)}
              checked={values.privateGame}
              onPress={() => setFieldValue("privateGame", !values.privateGame)}
            />
            <CheckBox
              title={t(tk.createGame.gameMasterCheckbox.label)}
              accessibilityLabel={t(tk.createGame.gameMasterCheckbox.label)}
              checked={values.gameMaster}
              disabled={!values.privateGame}
              onPress={() => setFieldValue("gameMaster", !values.gameMaster)}
            />
            {values.privateGame ? (
              <Text>
                {t(tk.createGame.gameMasterCheckbox.helpText.default)}
              </Text>
            ) : (
              <Text>
                {t(tk.createGame.gameMasterCheckbox.helpText.disabled)}
              </Text>
            )}

            {values.privateGame && values.gameMaster && (
              <>
                <CheckBox
                  title={t(tk.createGame.requireGameMasterInvitation.label)}
                  accessibilityLabel={t(
                    tk.createGame.requireGameMasterInvitation.label
                  )}
                  checked={values.requireGameMasterInvitation}
                  disabled={!values.gameMaster}
                  onPress={() =>
                    setFieldValue(
                      "requireGameMasterInvitation",
                      !values.requireGameMasterInvitation
                    )
                  }
                />
                <Text>
                  {t(tk.createGame.requireGameMasterInvitation.helpText)}
                </Text>
              </>
            )}
          </View>
          <View>
            <Picker selectedValue={values.variant}>
              {variants.map((variant) => (
                <Picker.Item label={variant.Name} value={variant.Name} />
              ))}
            </Picker>
          </View>
        </View>
      )}
    </View>
  );
};

export default CreateGame;
