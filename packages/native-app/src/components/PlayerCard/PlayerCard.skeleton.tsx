import React from "react";
import { Stack } from "../Stack";
import Skeleton from "../Skeleton/Skeleton";
import { useStyles } from "./PlayerCard.styles";
import PlayerCard from "./PlayerCard";

interface PlayerCardSkeletonProps
  extends Pick<Parameters<typeof PlayerCard>[0], "variant" | "style"> {}

const PlayerCardSkeleton = ({ style, variant }: PlayerCardSkeletonProps) => {
  const styles = useStyles();
  return (
    <Stack orientation="vertical" style={[style, styles.root]}>
      <Stack padding={1} gap={1} align="flex-start">
        <Stack gap={2} align="center" justify="space-between" fillWidth>
          <Stack align="center" gap={1}>
            <Skeleton height={50} width={50} circle />
          </Stack>
          <Stack grow>
            <Skeleton width={100} />
          </Stack>
          <Stack align="flex-end">
            <Skeleton circle height={24} width={24} />
          </Stack>
        </Stack>
      </Stack>
      {Boolean(variant === "expanded") && (
        <Stack fillWidth padding={1} style={styles.section}>
          <Stack gap={1}>
            <Stack grow flex={1}>
              <Skeleton width={100} />
            </Stack>
            <Stack grow flex={4}>
              <Skeleton />
            </Stack>
          </Stack>
        </Stack>
      )}
      {Boolean(variant === "expanded") && (
        <Stack padding={1} style={styles.section} fillWidth>
          {[1, 2, 3, 4].map((_, index) => (
            <Stack
              grow
              gap={1}
              orientation="vertical"
              key={index}
              style={index !== 0 && styles.gameStatColumn}
            >
              <Skeleton width={20} circle />
              <Skeleton width={50} />
            </Stack>
          ))}
        </Stack>
      )}
    </Stack>
  );
};

export default PlayerCardSkeleton;
