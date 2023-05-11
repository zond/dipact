import React from "react";
import { View } from "react-native";
import { Avatar } from "@rneui/base";

import { MoreButton } from "../Button";
import Text from "../Text";
import { Stack } from "../Stack";
import Chip from "../Chip";
import { useStyles } from "./PlayerCard.styles";
import { PlayerCardProps } from "./PlayerCard.types";

const commitedMap = {
  ["commited"]: ["Committed", "success"],
  ["uncommited"]: ["Uncommitted", "warning"],
  ["disengaged"]: ["Disengaged", "error"],
} as const;

const PlayerCard = ({
  src,
  numAbandonedGames,
  numDrawnGames,
  numJoinedGames,
  numSoloWinGames,
  onPressMore,
  reliabilityLabel,
  style,
  username,
  variant,
  ...rest
}: PlayerCardProps) => {
  const styles = useStyles();
  const gameStatsTable = [
    { label: "Played", value: numJoinedGames },
    { label: "Won", value: numSoloWinGames },
    { label: "Drawn", value: numDrawnGames },
    { label: "Abandoned", value: numAbandonedGames },
  ] as const;
  const [commitedLabel, commitedVariant] = commitedMap[reliabilityLabel];
  return (
    <Stack orientation="vertical" style={[style, styles.root]} {...rest}>
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
              {numJoinedGames}/{numSoloWinGames}/{numDrawnGames}/
              {numAbandonedGames}
            </Text>
          )}
        </Stack>
      </Stack>
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
