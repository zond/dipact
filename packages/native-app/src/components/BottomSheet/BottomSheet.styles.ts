import { StyleSheet } from "react-native";

import { useTheme } from "../../hooks/useTheme";

export const useStyles = () => {
  const theme = useTheme();
  return StyleSheet.create({
    container: {
      backgroundColor: theme.palette.paper.main,
    },
  });
};
