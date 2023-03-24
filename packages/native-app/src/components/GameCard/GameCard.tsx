import React, { useState } from "react";
import { TouchableHighlight, View } from "react-native";
import { Avatar, Chip, Divider, Icon } from "@rneui/base";
import {
  NationAllocation,
  TransformedGame,
  TransformedUser,
  TransformedVariant,
  translateKeys as tk,
} from "../../../common";
import { useTranslation } from "react-i18next";

import { useTheme } from "../../hooks/useTheme";
import { useNavigation } from "../../hooks/useNavigation";
import Button, { ButtonProps, MoreButton } from "../Button";
import { useStyles } from "./GameCard.styles";
import { Stack } from "../Stack";
import Text from "../Text";
import { useDispatch } from "react-redux";
import BottomSheet, { BottomSheetButton } from "../BottomSheet";

interface GameCardProps {
  game: TransformedGame;
  user: TransformedUser;
  variant: TransformedVariant;
  showActions?: boolean;
  numAvatarsToDisplay?: number;
}

// TODO translations
const confirmationStatusTextMap = {
  confirmed: "Orders confirmed",
  notConfirmed: "Orders not confirmed",
  nmr: "NMR",
} as const;

const defaultNumAvatarsToDisplay = 7;

const GameCard = ({
  game,
  user,
  variant,
  showActions = false,
  numAvatarsToDisplay = defaultNumAvatarsToDisplay,
}: GameCardProps) => {
  // const {
  //   actions,
  //   chatDisabled,
  //   chatLanguage,
  //   name,
  //   rulesSummary,
  //   phaseSummary,
  //   privateGame,
  //   nationAllocation,
  //   confirmationStatus,
  //   status,
  //   players,
  //   id,
  //   variantNumNations,
  // } = game;
  const confirmationStatus = undefined;
  const { chatLanguage, id, name, players, privateGame, rulesSummary, status } =
    game;
  const styles = useStyles({ confirmationStatus });
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const theme = useTheme();
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const numAvatarsOverspill = players.length - numAvatarsToDisplay;
  const confirmationStatusText = confirmationStatus
    ? confirmationStatusTextMap[confirmationStatus]
    : "";
  const navigation = useNavigation<"GameDetail">();
  const openGameDetailTab = (
    screen: "GameInfo" | "PlayerInfo" | "VariantInfo" | ""
  ) => {
    navigation.navigate("GameDetail", { gameId: id, screen });
  };
  const onPressGameInfo = () => openGameDetailTab("GameInfo");
  const onPressPlayerInfo = () => openGameDetailTab("PlayerInfo");
  const onPressVariantInfo = () => openGameDetailTab("VariantInfo");
  const onPressGame = () => {
    if (status === "staging") {
      openGameDetailTab("");
    } else {
      navigation.navigate("Game", { gameId: id });
    }
  };

  // TODO translations
  const actionButtonProps: ActionNameButtonMap = {
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
      onPress: () => alert("Coming soon"),
      iconProps: { name: "share", type: "material" },
    },
    gameInfo: {
      title: "Game info",
      onPress: onPressGameInfo,
      iconProps: { name: "info-outline", type: "material-ui" },
    },
  } as const;

  const onPressMore = () => {
    setShowMoreMenu(true);
  };

  const ActionButton = (props: ButtonProps) => (
    <Button {...props} containerStyle={styles.actionButtonContainer} />
  );

  return (
    <>
      <TouchableHighlight
        onPress={onPressGame}
        underlayColor={theme.palette.highlight.main}
        testID="game-card"
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
                      {players.length}/{variant.nations.length}
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
                {game}
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
                  <Text variant="body2" testID="avatar-overspill-icon">
                    +{numAvatarsOverspill}
                  </Text>
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
                      {Boolean(chatLanguage) && (
                        <Text bold>{chatLanguage}</Text>
                      )}
                      {nationAllocation === NationAllocation.Preference && (
                        <Icon
                          name={"playlist-add-check"}
                          testID="nation-allocation-preference-icon"
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
            <View testID="game-card-actions">
              <Stack>
                {actions.has("gameInfo") && (
                  <ActionButton {...actionButtonProps.gameInfo} />
                )}
                {actions.has("share") && (
                  <ActionButton {...actionButtonProps.share} />
                )}
                {actions.has("join") && (
                  <ActionButton {...actionButtonProps.join} />
                )}
                {actions.has("leave") && (
                  <ActionButton {...actionButtonProps.leave} />
                )}
              </Stack>
            </View>
          )}
        </View>
      </TouchableHighlight>
      <BottomSheet
        modalProps={{}}
        isVisible={showMoreMenu}
        onBackdropPress={() => setShowMoreMenu(false)}
        testID="game-card-more-menu"
      >
        <Stack orientation="vertical">
          {actions.has("gameInfo") && (
            <BottomSheetButton {...actionButtonProps.gameInfo} />
          )}
          {actions.has("variantInfo") && (
            <BottomSheetButton {...actionButtonProps.variantInfo} />
          )}
          {actions.has("playerInfo") && (
            <BottomSheetButton {...actionButtonProps.playerInfo} />
          )}
          {actions.has("share") && (
            <BottomSheetButton {...actionButtonProps.share} />
          )}
          {actions.has("join") && (
            <BottomSheetButton {...actionButtonProps.join} />
          )}
          {actions.has("leave") && (
            <BottomSheetButton {...actionButtonProps.leave} />
          )}
        </Stack>
      </BottomSheet>
    </>
  );
};

export default GameCard;
