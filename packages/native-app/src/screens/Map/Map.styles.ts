import { StyleSheet } from "react-native";

export const useStyles = () => {
  return StyleSheet.create({
    root: {
      height: "100%",
    },
    phaseSelectorRoot: {
      position: "absolute",
      zIndex: 1,
      width: "100%",
    },
  });
};
