import { StyleSheet } from "react-native";

export const useStyles = () => {
  return StyleSheet.create({
    root: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      height: "100%",
    },
    buttonContainer: {
      display: "flex",
      alignItems: "center",
      width: "100%",
    },
  });
};
