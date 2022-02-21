import React from "react";
import { StyleProp, Text, View } from "react-native";
import { useTheme } from "../hooks";
import TextSecondary from "./TextSecondary";

const game = {
  deadlineDisplay: "<2d",
  name: "Sell a field",
  rulesSummary: "Classical 2d",
  phaseSummary: "Fall 1910, Adjustment",
};

const useStyles = (): StyleProp<any> => {
  const theme = useTheme();
  return {
    root: {
      padding: theme.spacing(1),
    },
    nameRow: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
    },
    rulesRow: {
      marginTop: theme.spacing(1),
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
    },
    rulesText: {
      color: theme.palette.text.light,
    },
  };
};

const GameCard = ({}) => {
  const styles = useStyles();
  const { deadlineDisplay, name, rulesSummary, phaseSummary } = game;
  return (
    <View style={styles.root}>
      <View style={styles.nameRow}>
        <Text style={{ fontSize: 16 }}>{name}</Text>
        <Text style={{ fontSize: 16 }}>{deadlineDisplay}</Text>
      </View>
      <View style={styles.rulesRow}>
        <TextSecondary>{rulesSummary}</TextSecondary>
        <TextSecondary>{phaseSummary}</TextSecondary>
      </View>
    </View>
  );
};

export default GameCard;
