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
    main: "#FFF",
    dark: "#AAA",
  },
  border: {
    main: "#000",
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
