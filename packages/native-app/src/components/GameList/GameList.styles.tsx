import { StyleSheet } from "react-native";
import { useTheme } from "../../hooks/useTheme";

export const useStyles = () => {
  const theme = useTheme();
  return StyleSheet.create({
    title: {
      fontSize: 16,
      fontWeight: "bold",
    },
    gameCardContainer: {
      padding: theme.spacing(0.5),
    },
  });
};
