import { StyleSheet } from "react-native";

import { useTheme } from "../../hooks/useTheme";

export const useStyles = () => {
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
