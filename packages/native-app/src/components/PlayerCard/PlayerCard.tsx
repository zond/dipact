import React from "react";
import {
  StyleProp,
  StyleSheet,
  View,
  ViewProps,
  ViewStyle,
} from "react-native";
import { Avatar } from "@rneui/base";

import { MoreButton } from "../Button";
import { Text } from "../Text";
import { Stack } from "../Stack";
import { useTheme } from "../../hooks/useTheme";
import Chip from "../Chip";
import GoodBadSlider from "../GoodBadSlider";

interface PlayerCardProps extends ViewProps {
  style?: StyleProp<ViewStyle>;
  variant: "compact" | "expanded";
  src: string;
  username: string;
  reliabilityLabel: "commited" | "uncommited" | "disengaged";
  reliabilityRating: number;
  numPlayedGames: number;
  numWonGames: number;
  numDrawnGames: number;
  numAbandonnedGames: number;
}

const useStyles = () => {
  const theme = useTheme();
  return StyleSheet.create({
    root: {
      backgroundColor: theme.palette.paper.main,
      elevation: 1,
    },
    moreButton: {
      paddingRight: 0,
    },
    section: {
      borderTopColor: theme.palette.border.light,
      borderTopWidth: 1,
    },
    gameStatColumn: {
      borderLeftColor: theme.palette.border.light,
      borderLeftWidth: 1,
    },
  });
};

const PlayerCard = ({
  src,
  style,
  username,
  variant,
  reliabilityRating,
  numPlayedGames,
  numWonGames,
  numDrawnGames,
  numAbandonnedGames,
  ...rest
}: PlayerCardProps) => {
  const styles = useStyles();
  const gameStatsTable = [
    { label: "Played", value: numPlayedGames },
    { label: "Won", value: numWonGames },
    { label: "Drawn", value: numDrawnGames },
    { label: "Abandonned", value: numAbandonnedGames },
  ] as const;
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
          <Chip title="Committed" variant="success" />
        </Stack>
        <Stack orientation="vertical" align="flex-end">
          <MoreButton buttonStyle={styles.moreButton} />
          {Boolean(variant === "compact") && (
            <Text>
              {numPlayedGames}/{numWonGames}/{numDrawnGames}/
              {numAbandonnedGames}
            </Text>
          )}
        </Stack>
      </Stack>
      {Boolean(variant === "expanded") && (
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
      )}
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
