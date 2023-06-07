import { StyleSheet } from "react-native";
import { useTheme } from "../../hooks/useTheme";

export const useStyles = () => {
  const theme = useTheme();
  return StyleSheet.create({
    root: {
      padding: theme.spacing(1),
    },
    formContainer: {
      paddingBottom: theme.spacing(2),
    },
    section: {
      marginBottom: theme.spacing(2),
    },
    input: {
      borderBottomColor: theme.palette.border.main,
      borderBottomWidth: 1,
      paddingVertical: 0,
    },
    inputSelectContainer: {
      display: "flex",
      flexDirection: "row",
    },
    inputSelectElement: {
      width: "50%",
    },
    loadingContainer: {
      display: "flex",
      height: "100%",
      justifyContent: "center",
    },
  });
};
