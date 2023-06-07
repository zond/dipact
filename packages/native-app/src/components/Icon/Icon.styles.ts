import { StyleSheet } from "react-native";
import { IconStyleProps } from "./Icon.types";

export const useStyles = ({ size }: IconStyleProps) => {
  return StyleSheet.create({
    iconContainer: {
      width: size === "small" ? 16 : size === "medium" ? 24 : 32,
      height: size === "small" ? 16 : size === "medium" ? 24 : 32,
    },
  });
};
