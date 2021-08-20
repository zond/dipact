import { FullTheme, useTheme as rneUseTheme } from "react-native-elements";

export const useTheme = (): FullTheme => {
  return rneUseTheme().theme as FullTheme;
}