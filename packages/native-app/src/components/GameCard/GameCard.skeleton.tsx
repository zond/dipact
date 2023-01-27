import React from "react";
import { View } from "react-native";

import { useStyles } from "./GameCard.styles";
import Skeleton from "../Skeleton";
import { Stack } from "../Stack";

const GameCardSkeleton = () => {
  const styles = useStyles({ confirmationStatus: undefined });
  return (
    <View style={styles.root}>
      <Stack padding={1} gap={1} orientation="vertical" align="flex-start">
        <Stack justify="space-between" fillContainer>
          <Skeleton height={24} width={180} />
          <Skeleton circle height={24} width={24} />
        </Stack>
        <Stack justify="space-between" fillContainer>
          <Skeleton height={20} width={90} />
          <Stack gap={1}>
            <Skeleton circle height={24} width={120} />
            <Skeleton height={20} width={20} />
          </Stack>
        </Stack>
        <Stack justify="space-between" fillContainer>
          <Skeleton height={24} width={180} />
          <Skeleton height={16} width={90} />
        </Stack>
      </Stack>
    </View>
  );
};

export default GameCardSkeleton;
