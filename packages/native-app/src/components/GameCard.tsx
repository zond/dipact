import React from "react";
import { StyleProp, Text, TouchableHighlight, View } from "react-native";
import { useTheme } from "../hooks/useTheme";
import {
  GameDisplay,
  NationAllocation,
  translateKeys as tk,
} from "@diplicity/common";
import { Icon } from "@rneui/base";
import { useNavigation } from "../hooks/useNavigation";
import { useTranslation } from "react-i18next";
import Button from "./Button";

const useStyles = (): StyleProp<any> => {
  const theme = useTheme();
  return {
    root: {
      padding: theme.spacing(2),
    },
    nameRow: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      paddingBottom: theme.spacing(2),
    },
    name: {
      fontWeight: "bold",
    },
    rulesRow: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      paddingBottom: theme.spacing(1),
    },
    icons: {
      display: "flex",
      flexDirection: "row",
    },
    rulesText: {
      color: theme.palette.text.light,
    },
    chatLanguageContainer: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
    },
    bottomRow: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
  };
};

interface GameCardProps {
  game: GameDisplay;
}

const GameCard = ({ game }: GameCardProps) => {
  const styles = useStyles();
  const { t } = useTranslation();
  const theme = useTheme();
  const {
    chatDisabled,
    chatLanguage,
    deadlineDisplay,
    name,
    rulesSummary,
    phaseSummary,
    privateGame,
    minQuickness,
    minRating,
    minReliability,
    nationAllocation,
    id,
  } = game;
  const navigation = useNavigation<"Home">();
  const onPressGame = () => {
    navigation.navigate("GameDetail", { gameId: id });
  };
  const onPressView = () => {
    navigation.navigate("Game", { gameId: id });
  };
  return (
    <TouchableHighlight
      onPress={onPressGame}
      underlayColor={theme.palette.highlight.main}
    >
      <View style={styles.root}>
        <View style={styles.nameRow}>
          <Text style={styles.name}>{name}</Text>
          <Text>{deadlineDisplay}</Text>
        </View>
        <View style={styles.rulesRow}>
          <Text>{rulesSummary}</Text>
          <Text>{phaseSummary}</Text>
        </View>
        <View style={styles.bottomRow}>
          <View style={styles.icons}>
            {Boolean(chatLanguage) && <Text>{chatLanguage}</Text>}
            {privateGame && (
              <Icon
                name="lock"
                accessibilityLabel={t(
                  tk.gameList.gameCard.privateGameIcon.tooltip
                )}
              />
            )}
            {Boolean(minQuickness || minReliability) && (
              <Icon
                name={"timer"}
                accessibilityLabel={t(
                  tk.gameList.gameCard.minQuicknessOrReliabilityRequiredIcon
                    .tooltip
                )}
              />
            )}
            {nationAllocation === NationAllocation.Preference && (
              <Icon
                name={"playlist-add-check"}
                accessibilityLabel={t(
                  tk.gameList.gameCard.preferenceBaseNationAllocationIcon
                    .tooltip
                )}
              />
            )}
            {Boolean(minRating) && (
              <Icon
                name="star-border"
                accessibilityLabel={t(
                  tk.gameList.gameCard.minRatingRequiredIcon.tooltip
                )}
              />
            )}
            {chatDisabled && (
              <Icon
                name="closed-caption-disabled"
                accessibilityLabel={t(
                  tk.gameList.gameCard.chatDisabledIcon.tooltip
                )}
              />
            )}
          </View>
          <View>
            <Button
              onPress={onPressView}
              accessibilityLabel={t(tk.gameList.gameCard.viewButton.label)}
              title={t(tk.gameList.gameCard.viewButton.label)}
              iconProps={{ name: "eye" }}
            />
          </View>
        </View>
      </View>
    </TouchableHighlight>
  );
};

export default GameCard;
