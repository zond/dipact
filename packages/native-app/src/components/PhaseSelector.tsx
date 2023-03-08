import React from "react";
import { StyleSheet, View } from "react-native";
import { Button, Icon } from "@rneui/base";
import { usePhaseSelector, translateKeys as tk } from "../../common";
import { Picker } from "@react-native-picker/picker";
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
    },
    container: {
      display: "flex",
      flexDirection: "row",
      width: "100%",
      alignItems: "center",
      borderWidth: 1,
      borderRadius: 15,
      borderColor: theme.palette.border.main,
      backgroundColor: theme.palette.background.main,
    },
    picker: {
      flexGrow: 1,
      borderWidth: 1,
    },
    button: {
      backgroundColor: "transparent",
    },
    disabledButton: {
      display: "none",
    },
  });
};

const PhaseSelector = ({ gameId, rootStyles }: PhaseSelectorProps) => {
  const { t } = useTranslation();
  const styles = useStyles();
  const {
    phases,
    setPhase,
    setNextPhase,
    setPreviousPhase,
    selectedPhase,
    isLoading,
    isError,
  } = usePhaseSelector(gameId);

  if (isLoading || isError || !phases) {
    return null;
  }

  return (
    <View style={{ ...styles.root, ...rootStyles }}>
      <View style={styles.container}>
        <Button
          accessibilityLabel={t(tk.phaseSelector.previousButton.title)}
          icon={<Icon name={"arrow-back"} type="material-ui" />}
          onPress={setPreviousPhase}
          buttonStyle={styles.button}
          disabledStyle={styles.disabledButton}
          disabled={selectedPhase === 1}
        />
        <Picker
          style={styles.picker}
          testID={"phase-select"}
          accessibilityLabel={"phase-select"}
          selectedValue={selectedPhase}
          onValueChange={setPhase}
        >
          {phases?.map(([value, label]) => (
            <Picker.Item label={label} value={value} key={value} />
          ))}
        </Picker>
        <Button
          accessibilityLabel={t(tk.phaseSelector.nextButton.title)}
          icon={<Icon name={"arrow-forward"} type="material-ui" />}
          onPress={setNextPhase}
          disabled={selectedPhase === phases.length}
          disabledStyle={styles.disabledButton}
          buttonStyle={styles.button}
        />
      </View>
    </View>
  );
};

export default PhaseSelector;
