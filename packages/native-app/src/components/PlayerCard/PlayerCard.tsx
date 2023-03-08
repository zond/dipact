import React from "react";
import { StyleProp, View, ViewProps, ViewStyle } from "react-native";
import { Avatar } from "@rneui/base";

import { MoreButton } from "../Button";
import { Text } from "../Text";
import { Stack } from "../Stack";
import Chip from "../Chip";
import GoodBadSlider from "../GoodBadSlider/GoodBadSlider";
import { PlayerDisplay } from "@diplicity/common";
import { useStyles } from "./PlayerCard.styles";

interface PlayerCardProps extends ViewProps {
  style?: StyleProp<ViewStyle>;
  variant: "compact" | "expanded";
  player: PlayerDisplay;
}

const PlayerCard = ({ style, variant, player, ...rest }: PlayerCardProps) => {
  const { src, username, stats } = player;
  const {
    reliabilityLabel,
    reliabilityRating,
    numAbandonedGames,
    numDrawnGames,
    numPlayedGames,
    numWonGames,
  } = stats;
  const styles = useStyles();
  const gameStatsTable = [
    { label: "Played", value: numPlayedGames },
    { label: "Won", value: numWonGames },
    { label: "Drawn", value: numDrawnGames },
    { label: "Abandoned", value: numAbandonedGames },
  ] as const;
  const commitedMap = {
    ["commited"]: ["Committed", "success"],
    ["uncommited"]: ["Uncommitted", "warning"],
    ["disengaged"]: ["Disengaged", "error"],
  } as const;
  const [commitedLabel, commitedVariant] = commitedMap[reliabilityLabel];
  const onPressMore = () => {
    alert("More button pressed");
  };
  return (
    <Stack orientation="vertical" style={[style, styles.root]} {...rest}>
      const [commitedLabel, commitedVariant] =
      <Stack fillWidth padding={1} gap={1} align="flex-start">
        <Stack fillHeight>
          <View>
            <Avatar
              rounded
              size="medium"
              title={username[0]}
              source={{ uri: src }}
            />
          </View>
        </Stack>
        <Stack grow align="center" fillHeight gap={1}>
          <Text variant="title">{username}</Text>
          <Chip title={commitedLabel} variant={commitedVariant} />
        </Stack>
        <Stack orientation="vertical" align="flex-end">
          <MoreButton buttonStyle={styles.moreButton} onPress={onPressMore} />
          {Boolean(variant === "compact") && (
            <Text>
              {numPlayedGames}/{numWonGames}/{numDrawnGames}/{numAbandonedGames}
            </Text>
          )}
        </Stack>
      </Stack>
      {/* {Boolean(variant === "expanded") && (
        <Stack fillWidth padding={1} style={styles.section}>
          <Stack gap={1}>
            <Stack grow flex={1}>
              <Text>Reliability</Text>
            </Stack>
            <Stack grow flex={4}>
              <GoodBadSlider value={reliabilityRating} />
            </Stack>
          </Stack>
        </Stack>
      )} */}
      {Boolean(variant === "expanded") && (
        <Stack padding={1} style={styles.section} fillWidth>
          {gameStatsTable.map(({ label, value }, index) => (
            <Stack
              grow
              orientation="vertical"
              key={label}
              style={index !== 0 && styles.gameStatColumn}
            >
              <Text variant="title" bold>
                {value}
              </Text>
              <Text variant="body2">{label}</Text>
            </Stack>
          ))}
        </Stack>
      )}
    </Stack>
  );
};

export default PlayerCard;
