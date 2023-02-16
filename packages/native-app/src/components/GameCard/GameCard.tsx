import React from "react";
import { TouchableHighlight, View } from "react-native";
import { Avatar, Chip, Divider, Icon } from "@rneui/base";
import {
  GameDisplay,
  NationAllocation,
  translateKeys as tk,
} from "@diplicity/common";
import { useTranslation } from "react-i18next";

import { useTheme } from "../../hooks/useTheme";
import { useNavigation } from "../../hooks/useNavigation";
import Button, { ButtonProps, MoreButton } from "../Button";
import { useStyles } from "./GameCard.styles";
import { toBottomSheetElement, useBottomSheet } from "../BottomSheetWrapper";
import { Stack, StackItem } from "../Stack";
import { Text } from "../Text";
import { useDispatch } from "react-redux";

interface GameCardProps {
  game: GameDisplay;
  showActions?: boolean;
}

// TODO translations
const confirmationStatusTextMap = {
  confirmed: "Orders confirmed",
  notConfirmed: "Orders not confirmed",
  nmr: "NMR",
} as const;

const numAvatarsToDisplay = 7;

type ActionNames =
  | "gameInfo"
  | "join"
  | "leave"
  | "playerInfo"
  | "share"
  | "variantInfo";

const getActions = (
  userIsMember: boolean,
  status: GameDisplay["status"]
): ActionNames[] => {
  if (userIsMember && status === "staging") {
    return ["gameInfo", "playerInfo", "variantInfo", "share", "leave"];
  }
  if (!userIsMember && status === "staging") {
    return ["gameInfo", "playerInfo", "variantInfo", "share", "join"];
  }
  return ["gameInfo", "playerInfo", "variantInfo", "share"];
};

type ActionNameButtonMap = {
  [key in ActionNames]: Partial<ButtonProps>;
};

type ActionConfig = {
  tray: ActionNames[];
  bottomSheet: [ActionNames[], ActionNames[]];
};

const actionConfig: ActionConfig = {
  tray: ["gameInfo", "share", "join", "leave"],
  bottomSheet: [
    ["gameInfo", "playerInfo", "variantInfo"],
    ["share", "join", "leave"],
  ],
};

const GameCard = ({ game, showActions = false }: GameCardProps) => {
  const {
    chatDisabled,
    chatLanguage,
    name,
    rulesSummary,
    phaseSummary,
    privateGame,
    nationAllocation,
    confirmationStatus,
    status,
    players,
    id,
    userIsMember,
    variantNumNations,
  } = game;
  const styles = useStyles({ confirmationStatus });
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const theme = useTheme();
  const [setBottomSheet] = useBottomSheet();
  const numAvatarsOverspill = players.length - numAvatarsToDisplay;
  const confirmationStatusText = confirmationStatus
    ? confirmationStatusTextMap[confirmationStatus]
    : "";
  const navigation = useNavigation<"Home">();
  const onPressGame = () => {
    if (status === "staging") {
      navigation.navigate("GameDetail", { gameId: id });
    } else {
      navigation.navigate("Game", { gameId: id });
    }
  };
  const onPressGameInfo = () => {
    navigation.navigate("GameDetail", { gameId: id, tab: "game" });
  };
  const onPressPlayerInfo = () => {
    navigation.navigate("GameDetail", { gameId: id, tab: "player" });
  };
  const onPressVariantInfo = () => {
    navigation.navigate("GameDetail", { gameId: id, tab: "variant" });
  };

  const actions = getActions(userIsMember, status);

  // TODO translations
  const allActionButtons: ActionNameButtonMap = {
    join: {
      title: "Join",
      onPress: () => dispatch({ type: "JOIN_GAME", gameId: id }),
      iconProps: { name: "account-plus", type: "material-community" },
    },
    leave: {
      title: "Leave",
      onPress: () => dispatch({ type: "LEAVE_GAME", gameId: id }),
      iconProps: { name: "account-minus", type: "material-community" },
    },
    playerInfo: {
      title: "Player Info",
      onPress: onPressPlayerInfo,
      iconProps: { name: "account-multiple", type: "material-community" },
    },
    variantInfo: {
      title: "Variant Info",
      onPress: onPressVariantInfo,
      iconProps: { name: "map", type: "material-community" },
    },
    share: {
      title: "Share",
      onPress: () => dispatch({ type: "SHARE", gameId: id }),
      iconProps: { name: "share", type: "material" },
    },
    gameInfo: {
      title: "Game info",
      onPress: onPressGameInfo,
      iconProps: { name: "info-outline", type: "material-ui" },
    },
  } as const;

  const trayButtons = Object.entries(allActionButtons)
    .filter(
      ([actionName]) =>
        actions.includes(actionName as ActionNames) &&
        actionConfig.tray.includes(actionName as ActionNames)
    )
    .map(([actionName, buttonProps]) => ({ ...buttonProps, key: actionName }));

  const bottomSheetSections = actionConfig.bottomSheet.map((section) => ({
    elements: Object.entries(allActionButtons)
      .filter(([actionName]) => {
        return (
          actions.includes(actionName as ActionNames) &&
          section.includes(actionName as ActionNames)
        );
      })
      .map(([actionName, buttonProps]) =>
        toBottomSheetElement("button", { ...buttonProps, key: actionName })
      ),
  }));

  const onPressMore = () => {
    setBottomSheet({ sections: bottomSheetSections });
  };
  return (
    <TouchableHighlight
      onPress={onPressGame}
      underlayColor={theme.palette.highlight.main}
    >
      <View style={styles.root}>
        <Stack padding={1} gap={1} orientation="vertical" align="flex-start">
          <Stack justify="space-between" fillWidth>
            <Stack style={styles.nameContainer}>
              {Boolean(privateGame) && (
                <Icon
                  name="lock"
                  type="material-community"
                  testID="private-icon"
                />
              )}
              <Text numberOfLines={1} variant="title">
                {name}
              </Text>
            </Stack>
            <Stack>
              {Boolean(status === "staging") && (
                <Stack>
                  <Icon name="account-multiple" type="material-community" />
                  <Text>
                    {players.length}/{variantNumNations}
                  </Text>
                </Stack>
              )}
              <MoreButton
                onPress={onPressMore}
                accessibilityLabel="More button"
              />
            </Stack>
          </Stack>
          <Stack justify="space-between" fillWidth>
            <Text variant="body2" accessibilityLabel="Rules summary">
              {rulesSummary}
            </Text>
            <Stack gap={1}>
              {Boolean(status === "started") && (
                <Chip
                  title={confirmationStatusText}
                  buttonStyle={styles.chipButton}
                  titleStyle={styles.chipTitle}
                />
              )}
              <Text bold>{"<2d"}</Text>
            </Stack>
          </Stack>
          <Stack justify="space-between" fillWidth>
            <Stack gap={2}>
              <Stack gap={-1}>
                {players
                  .slice(0, numAvatarsToDisplay)
                  .map(({ username, image }) => (
                    <View key={username}>
                      <Avatar
                        rounded
                        key={username}
                        title={username[0]}
                        source={{ uri: image }}
                      />
                    </View>
                  ))}
              </Stack>
              {numAvatarsOverspill > 0 && (
                <Text variant="body2">+{numAvatarsOverspill}</Text>
              )}
            </Stack>
            <Stack justify="space-between">
              {status === "started" && (
                <Text variant="body2" accessibilityLabel="Phase summary">
                  {phaseSummary}
                </Text>
              )}
              {status === "staging" && (
                <TouchableHighlight
                  onPress={onPressGameInfo}
                  underlayColor={theme.palette.highlight.main}
                >
                  <Stack gap={0.5}>
                    {Boolean(chatLanguage) && <Text bold>{chatLanguage}</Text>}
                    {nationAllocation === NationAllocation.Preference && (
                      <Icon
                        name={"playlist-add-check"}
                        accessibilityLabel={t(
                          tk.gameList.gameCard
                            .preferenceBaseNationAllocationIcon.tooltip
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
                  </Stack>
                </TouchableHighlight>
              )}
            </Stack>
          </Stack>
        </Stack>
        <Divider />
        {Boolean(showActions) && (
          <Stack>
            {trayButtons.map(({ title, iconProps, onPress }, ind) => (
              <StackItem key={ind} grow>
                <Button
                  title={title}
                  onPress={onPress}
                  iconProps={{ ...iconProps, size: 20 }}
                />
              </StackItem>
            ))}
          </Stack>
        )}
      </View>
    </TouchableHighlight>
  );
};

export default GameCard;
