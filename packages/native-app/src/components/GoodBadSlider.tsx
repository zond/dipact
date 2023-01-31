import React from "react";
import { StyleSheet } from "react-native";
import { LinearProgress } from "@rneui/base";

import { Stack } from "./Stack";
import { useTheme } from "../hooks/useTheme";

type ValueRating = "positive" | "neutral" | "negative";

interface GoodBadSliderProps {
  // Between -1 and 1
  value: number;
}

const useStyles = () => {
  const theme = useTheme();
  return StyleSheet.create({
    leftContainer: {
      height: 8,
    },
    rightContainer: {
      height: 8,
      borderLeftColor: theme.palette.border.main,
      borderLeftWidth: 1,
    },
  });
};

const getValueRating = (value: number): ValueRating => {
  if (value > 0.5) {
    return "positive";
  } else if (value < -0.5) {
    return "negative";
  } else if (value >= -0.5 && value <= 0.5) {
    return "neutral";
  }
  throw new Error("Invalid value");
};

const GoodBadSlider = ({ value }: GoodBadSliderProps) => {
  const styles = useStyles();
  const theme = useTheme();
  const negativeValue = Math.abs(Math.min(0, value));
  const positiveValue = 1 - Math.max(0, value);
  const valueRating = getValueRating(value);
  const valueRatingColorMap: Record<ValueRating, [string, string | undefined]> =
    {
      positive: [
        theme.palette.valueRatingPositive.main,
        theme.palette.valueRatingPositive.light,
      ],
      neutral: [
        theme.palette.valueRatingNeutral.main,
        theme.palette.valueRatingNeutral.light,
      ],
      negative: [
        theme.palette.valueRatingNegative.main,
        theme.palette.valueRatingNegative.light,
      ],
    };

  const [color, trackColor] = valueRatingColorMap[valueRating];

  return (
    <Stack>
      <Stack grow flex={1} style={styles.leftContainer}>
        <LinearProgress
          animation={false}
          color={trackColor}
          trackColor={color}
          variant="determinate"
          value={positiveValue}
        />
      </Stack>
      <Stack grow flex={1} style={styles.rightContainer}>
        <LinearProgress
          animation={false}
          color={color}
          trackColor={trackColor}
          variant="determinate"
          value={negativeValue}
        />
      </Stack>
    </Stack>
  );
};

export default GoodBadSlider;
