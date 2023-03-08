import { StyleProp, ViewStyle } from "react-native";
import { useTheme } from "../../hooks/useTheme";

export const useStyles = (): StyleProp<ViewStyle> => {
  const theme = useTheme();
  return {
    backgroundColor: theme.palette.border.light,
  };
};
