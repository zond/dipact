import { StyleProp } from "react-native";
import { useTheme } from "./useTheme";

export const useCommonStyles = (): StyleProp<any> => {
  const theme = useTheme();
  return {
    section: {
      borderBottomColor: theme.palette.border.light,
      borderBottomWidth: 1,
    },
  };
};
