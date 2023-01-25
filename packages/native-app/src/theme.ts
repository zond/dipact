import { createTheme } from "@rneui/themed";

const gridSize = 8;

const palette = {
  primary: {
    light: "#63ccff",
    main: "#281A1A",
    dark: "#006db3",
    contrastText: "#FDE2B5",
  },
  secondary: {
    light: "#fef1da",
    main: "#FDE2B5",
    dark: "#006db3",
    contrastText: "#000",
  },
  paper: {
    main: "#FFF",

  },
  background: {
    main: "#F5F5F5",
    dark: "#AAA",
  },
  border: {
    main: "#000",
    light: "#0000001f",
  },
  notification: {
    main: "#000",
  },
  text: {
    main: "#000",
    light: "#57606a",
    contrastText: "#FFF",
  },
  highlight: {
    main: "#DDDDDD",
  },
  success: {
    main: "#4caf50",
  },
  error: {
    main: "#f44336",
  },
  confirmed: {
    main: "#66BB6A",
    contrastText: "#000000"
  },
  notConfirmed: {
    main: "#FBD86C",
    contrastText: "#000000"
  }
};

export const theme = createTheme({
  Button: {
    raised: true,
  },
  lightColors: {
    primary: palette.primary.main,
    secondary: palette.secondary.main,
  },
  palette,
  spacing: (value: number) => value * gridSize,
});
