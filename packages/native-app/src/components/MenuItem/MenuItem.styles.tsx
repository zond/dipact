import { StyleSheet } from "react-native";

export const useStyles = () => {
  return StyleSheet.create({
    container: {
      width: "100%",
    },
    title: {
      flexGrow: 1,
      textAlign: "left",
    },
  });
};
