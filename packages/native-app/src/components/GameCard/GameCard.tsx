import React from "react";
import { TouchableHighlight, View } from "react-native";
import { Avatar, Chip, Divider, Icon } from "@rneui/base";
import { NationAllocation, translateKeys as tk } from "@diplicity/common";

import { useTheme } from "../../hooks/useTheme";
import { useNavigation } from "../../hooks/useNavigation";
import { useTranslation } from "react-i18next";
import Button from "../Button";
import { useStyles } from "./GameCard.styles";
import { GameDisplay } from "./types";
import { useBottomSheet } from "../BottomSheetWrapper";
import { Stack, StackItem } from "../Stack";
import { Text } from "../Text";

interface GameCardProps {
  game: GameDisplay;
}

// TODO translations
const confirmationStatusTextMap = {
  Confirmed: "Orders confirmed",
  NotConfirmed: "Orders not confirmed",
  NMR: "NMR",
} as const;

const numAvatarsToDisplay = 7;

const GameCard = ({ game }: GameCardProps) => {
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
    variantNumNations,
  } = game;
  const styles = useStyles({ confirmationStatus });
  const { t } = useTranslation();
  const theme = useTheme();
  const [setBottomSheet, withCloseBottomSheet] = useBottomSheet();
  const numAvatarsOverspill = players.length - numAvatarsToDisplay;
  const confirmationStatusText = confirmationStatus
    ? confirmationStatusTextMap[confirmationStatus]
    : undefined;
  const navigation = useNavigation<"Home">();
  const onPressGame = () => {
    navigation.navigate("GameDetail", { gameId: id });
  };
  const onPressDetails = () => {
    navigation.navigate("GameDetail", { gameId: id });
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

  // TODO translations
  const allActionButtons = {
    join: {
      shortTitle: "Join",
      title: "Join game",
      onPress: () => {},
      iconProps: { name: "account-plus", type: "material-community" },
    },
    playerInfo: {
      shortTitle: "Player Info",
      title: "Player Info",
      onPress: onPressPlayerInfo,
      iconProps: { name: "account-multiple", type: "material-community" },
    },
    variantInfo: {
      shortTitle: "Variant Info",
      title: "Variant Info",
      onPress: onPressVariantInfo,
      iconProps: { name: "map", type: "material-community" },
    },
    share: {
      shortTitle: "Share",
      title: "Share",
      onPress: () => {},
      iconProps: { name: "share", type: "material" },
    },
    gameInfo: {
      shortTitle: "Game info",
      title: "Game info",
      onPress: onPressGameInfo,
      iconProps: { name: "info-outline", type: "material-ui" },
    },
    details: {
      shortTitle: "Details",
      title: "Details",
      onPress: onPressDetails,
      iconProps: { name: "info-outline", type: "material-ui" },
    },
  } as const;

  const moreButtons =
    status === "Staging"
      ? [
          [
            allActionButtons.gameInfo,
            allActionButtons.playerInfo,
            allActionButtons.variantInfo,
          ],
          [allActionButtons.share, allActionButtons.join],
        ]
      : [];
  const actionButtons =
    status === "Staging"
      ? [
          allActionButtons.details,
          allActionButtons.share,
          allActionButtons.join,
        ]
      : [];

  const MoreMenu = () => (
    <View>
      {moreButtons.map((section) => (
        <View>
          {section.map(({ title, onPress, iconProps }) => (
            <Button
              title={title}
              key={title}
              upperCase={false}
              onPress={withCloseBottomSheet(onPress)}
              containerStyle={styles.moreMenuContainer}
              buttonStyle={styles.moreMenuButton}
              iconProps={{
                ...iconProps,
                size: 20,
              }}
            />
          ))}
          <Divider />
        </View>
      ))}
    </View>
  );
  const onPressMore = () => {
    setBottomSheet(() => <MoreMenu />);
  };
  return (
    <TouchableHighlight
      onPress={onPressGame}
      underlayColor={theme.palette.highlight.main}
    >
      <View style={styles.root}>
        <Stack padding={1} gap={1} orientation="vertical" align="flex-start">
          <Stack justify="space-between" fillContainer>
            <Stack style={styles.nameContainer}>
              {Boolean(privateGame) && (
                <Icon name="lock" type="material-community" />
              )}
              <Text numberOfLines={1} variant="title">
                {name}
              </Text>
            </Stack>
            <Stack>
              {Boolean(status === "Staging") && (
                <Stack>
                  <Icon name="account-multiple" type="material-community" />
                  <Text>
                    {players.length}/{variantNumNations}
                  </Text>
                </Stack>
              )}
              <Button
                iconProps={{
                  type: "material-ui",
                  name: "more-horiz",
                  color: theme.palette.text.light,
                  size: 20,
                }}
                raised={false}
                buttonStyle={styles.moreButton}
                onPress={onPressMore}
                // TODO translation
                accessibilityLabel={"more options"}
              />
            </Stack>
          </Stack>
          <Stack justify="space-between" fillContainer>
            <Text variant="body2">{rulesSummary}</Text>
            <Stack gap={1}>
              {Boolean(confirmationStatusText) && (
                <Chip
                  title={confirmationStatusText}
                  buttonStyle={styles.chipButton}
                  titleStyle={styles.chipTitle}
                />
              )}
              <Text bold>{"<2d"}</Text>
            </Stack>
          </Stack>
          <Stack justify="space-between" fillContainer>
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
              {status === "Active" && (
                <Text variant="body2">{phaseSummary}</Text>
              )}
              {status === "Staging" && (
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
        <Stack>
          <>
            {actionButtons.map(({ title, iconProps, onPress }) => (
              <StackItem key={title} grow>
                <Button
                  title={title}
                  onPress={onPress}
                  iconProps={{ ...iconProps, size: 20 }}
                />
              </StackItem>
            ))}
          </>
        </Stack>
      </View>
    </TouchableHighlight>
  );
};

export default GameCard;
