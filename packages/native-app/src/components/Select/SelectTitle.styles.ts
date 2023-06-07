import { StyleSheet } from "react-native";
import { useTheme } from "../../hooks/useTheme";

export const useStyles = () => {
  const theme = useTheme();
  return StyleSheet.create({
    container: {
      width: "100%",
    },
    title: {
      flexGrow: 1,
      textAlign: "left",
    },
    icon: {
      color: theme.palette.text.light,
    },
  });
};
