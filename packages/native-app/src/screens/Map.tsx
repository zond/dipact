import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { gameActions, useCreateOrderMenu, useMap } from "@diplicity/common";
import { Dialog, FAB, Theme } from "@rneui/base";
import { useTheme } from "../hooks/useTheme";
import { Picker } from "@react-native-picker/picker";
import { useDispatch } from "react-redux";

interface MapProps {
  gameId: string;
}

const useStyles = () => {
  return StyleSheet.create({
    root: {
      height: "100%",
    },
  });
};

const Map = ({ gameId }: MapProps) => {
  const styles = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const rneTheme = { colors: { white: "#FFFFFF" } } as Theme;
  const [createOrderMenuOpen, setCreateOrderMenuOpen] = useState(false);
  const closeCreateOrderMenu = () => setCreateOrderMenuOpen(false);
  useMap(gameId);
  const { options, orderSummary, orderPrompt, handleSelectOption } =
    useCreateOrderMenu(closeCreateOrderMenu);

  const handleValueChange = (value: string) => {
    if (!value) {
      return;
    }
    handleSelectOption(value);
  };

  useEffect(() => {
    dispatch(gameActions.setGameId(gameId));
  }, [dispatch, gameId]);
  return (
    <View style={styles.root}>
      <Text>Map</Text>
      <Text>{gameId}</Text>
      <FAB
        color={theme.palette.primary.main}
        icon={{
          name: "add",
          color: theme.palette.secondary.main,
        }}
        placement={"right"}
        onPress={() => setCreateOrderMenuOpen(true)}
      />
      <Dialog
        theme={rneTheme}
        isVisible={createOrderMenuOpen}
        onPressOut={closeCreateOrderMenu}
        onRequestClose={closeCreateOrderMenu}
      >
        <Dialog.Title title="Create order" />
        <View>
          <Text>{orderSummary}</Text>
          <Text>{orderPrompt}</Text>
          <Picker onValueChange={handleValueChange}>
            <Picker.Item
              key={""}
              label={"-- Select an option --"}
              value={null}
              enabled={true}
              style={{ display: "none"}}
            />
            {options?.map((option) => (
              <Picker.Item
                key={option.value}
                label={option.label}
                value={option.value}
              />
            ))}
          </Picker>
        </View>
      </Dialog>
    </View>
  );
};

export default Map;
