import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { Button, Icon } from "@rneui/base";
import { usePhaseSelector, translateKeys as tk } from "@diplicity/common";
import { useTranslation } from "react-i18next";
import { useTheme } from "../hooks/useTheme";
interface PhaseSelectorProps {
  gameId: string;
  rootStyles?: any;
}

const useStyles = () => {
  const theme = useTheme();
  return StyleSheet.create({
    root: {
      padding: theme.spacing(1),
      backgroundColor: theme.palette.primary.main,
      display: "flex",
      flexDirection: "row",
      width: "100%",
      alignItems: "center",
    },
    picker: {
      flexGrow: 1,
      borderWidth: 1,
    },
    text: {
      color: theme.palette.secondary.main,
      flexGrow: 1,
      textAlign: "center",
    },
  });
};

const PhaseSelector = ({ gameId, rootStyles }: PhaseSelectorProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const styles = useStyles();
  const {
    phases,
    setNextPhase,
    setPreviousPhase,
    selectedPhase,
    isLoading,
    isError,
  } = usePhaseSelector(gameId);

  const selectedPhaseObject = phases?.find(
    ([value]) => value === selectedPhase
  );

  if (isLoading || isError || !phases || !selectedPhaseObject) {
    return null;
  }

  const previousDisabled = selectedPhase === 1;
  const nextDisabled = selectedPhase === phases.length;

  return (
    <View style={{ ...styles.root, ...rootStyles }}>
      <Button
        accessibilityLabel={t(tk.phaseSelector.previousButton.title)}
        icon={
          <Icon
            name={"arrow-back"}
            type="material-ui"
            color={previousDisabled ? "grey" : theme.palette.secondary.main}
          />
        }
        onPress={setPreviousPhase}
        disabled={previousDisabled}
        type={"clear"}
      />
      <Text style={styles.text}>{selectedPhaseObject[1]}</Text>
      <Button
        accessibilityLabel={t(tk.phaseSelector.nextButton.title)}
        icon={
          <Icon
            name={"arrow-forward"}
            type="material-ui"
            color={nextDisabled ? "grey" : theme.palette.secondary.main}
          />
        }
        onPress={setNextPhase}
        disabled={nextDisabled}
        type={"clear"}
      />
    </View>
  );
};

export default PhaseSelector;
