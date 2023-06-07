import { ButtonProps, ChipProps, TextProps } from "@rneui/base";
import { StyleProp, TextStyle } from "react-native";

declare module "@rneui/themed" {
  export type Palette = {
    [key: string]: {
      main: string;
      light?: string;
      inactive?: string;
      dark?: string;
      contrastText?: string;
    };
  };

  type TypographyVariant = "body1" | "body2" | "title" | "sectionTitle";

  export type Typography = {
    [key in TypographyVariant]: StyleProp<TextStyle>;
  };

  export interface FullTheme {
    components: {
      Button: ButtonProps;
      Chip: ChipProps;
      Text: TextProps;
    };
    palette: Palette;
    spacing: (value: number) => number;
    typography: Typography;
  }
}
