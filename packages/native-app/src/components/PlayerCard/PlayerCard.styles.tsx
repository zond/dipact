import { StyleSheet } from "react-native";

import { useTheme } from "../../hooks/useTheme";

export const useStyles = () => {
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
