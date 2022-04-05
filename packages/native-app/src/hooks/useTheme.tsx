import { FullTheme, useTheme as rneUseTheme } from "@rneui/themed";

export const useTheme = (): FullTheme => {
  return rneUseTheme().theme as FullTheme;
}