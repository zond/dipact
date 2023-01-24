import React from "react";
import { StyleProp, Text, TextStyle, TouchableHighlight, View, ViewStyle } from "react-native";
import { useTheme } from "../hooks/useTheme";
import {
  GameDisplay,
  NationAllocation,
  translateKeys as tk,
} from "@diplicity/common";
import { Avatar, Chip, Icon } from "@rneui/base";
import { useNavigation } from "../hooks/useNavigation";
import { useTranslation } from "react-i18next";
import Button from "./Button";

type StyleProps = {
  ordersStatus: OrdersStatus
}

const useStyles = ({ ordersStatus }: StyleProps): { [key: string]: StyleProp<ViewStyle> | StyleProp<TextStyle> } => {
  const theme = useTheme();
  console.log(theme.palette.confirmed);
  return {
    root: {
      padding: theme.spacing(2),
    },
    nameRow: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    name: {
      fontWeight: "bold",
      fontSize: 16,
    },
    chipButton: {
      paddingHorizontal: theme.spacing(.25),
      paddingVertical: theme.spacing(.2),
      backgroundColor: ordersStatus === "Confirmed" ? theme.palette.confirmed.main : theme.palette.notConfirmed.main
    },
    chipTitle: {
      color: ordersStatus === "Confirmed" ? theme.palette.confirmed.contrastText : theme.palette.notConfirmed.contrastText
    },
    columns: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
    },
    deadline: {
      color: theme.palette.text.main,
      fontWeight: "bold",
      marginLeft: theme.spacing(1),
    },
    moreButton: {
      backgroundColor: "transparent",
      color: theme.palette.text.light,
      padding: 0,
    },
    summaryRow: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
    },
    icons: {
      display: "flex",
      flexDirection: "row",
    },
    secondaryText: {
      color: theme.palette.text.light,
      fontSize: 14,
    },
    chatLanguageContainer: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
    },
    playersRulesRow: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
    },
    playersRow: {
      display: "flex",
      flexDirection: "row",
    },
    playerAvatar: {
      marginRight: -8
    },
    rulesRow: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
  };
};

// TODO move to GameDisplay
type OrdersStatus = "Confirmed" | "NotConfirmed";

const ordersStatusColorMap = new Map<OrdersStatus, [string, string]>([
  ["Confirmed", ["green", "black"]],
  ["NotConfirmed", ["amber", "black"]]
]
)

interface GameCardProps {
  game: GameDisplay;
}

const GameCard = ({ game }: GameCardProps) => {
  const ordersStatus = "Confirmed"
  const styles = useStyles({ ordersStatus });
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
    players,
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
          <Button
            iconProps={{
              type: "material-ui",
              name: "more-horiz",
              color: theme.palette.text.light,
              size: 20,
            }}
            raised={false}
            containerStyle={styles.moreButtonContainer}
            buttonStyle={styles.moreButton}
            // TODO translation
            accessibilityLabel={"more options"}
          />
        </View>
        <View style={styles.summaryRow}>
          <View>
            <Text>{rulesSummary}</Text>
          </View>
          <View style={styles.columns}>
            {/* TODO translation */}
            <Chip title={"Orders Confirmed"} buttonStyle={styles.chipButton} titleStyle={styles.chipTitle} />
            <Text style={styles.deadline}>{"<2d"}</Text>
            {/* <Text style={styles.secondaryText}>{phaseSummary}</Text> */}
          </View>
        </View>
        <View style={styles.playersRulesRow}>
          <View style={styles.playersRow}>
            {players.map(({ username, image }) => (
              <Avatar containerStyle={styles.playerAvatar} rounded title={username[0]} source={{ uri: image }} />
            ))}
          </View>
          <View style={styles.rulesRow}>
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
          </View>
          {/* <View>
              <Button
                onPress={onPressView}
                accessibilityLabel={t(tk.gameList.gameCard.viewButton.label)}
                title={t(tk.gameList.gameCard.viewButton.label)}
                iconProps={{ name: "eye" }}
              />
            </View> */}
        </View>
      </View>
    </TouchableHighlight>
  );
};

export default GameCard;
