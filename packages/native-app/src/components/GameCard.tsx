import React from "react";
import { StyleProp, Text, View } from "react-native";
import { Card } from "@rneui/themed";
import { useTheme } from "../hooks/useTheme";

const game = {
  deadlineDisplay: "<2d",
  name: "Sell a field",
  rulesSummary: "Classical 2d",
  phaseSummary: "Fall 1910, Adjustment",
};

const useStyles = (): StyleProp<any> => {
  const theme = useTheme();
  return {
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
    <Card>
      <View style={styles.nameRow}>
        <Text>{name}</Text>
        <Text>{deadlineDisplay}</Text>
      </View>
      <View style={styles.rulesRow}>
        <Text>{rulesSummary}</Text>
        <Text>{phaseSummary}</Text>
      </View>
    </Card>
  );
};

export default GameCard;
