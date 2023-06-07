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
    inactive: "#fde2b585",
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
    contrastText: "#000000",
  },
  error: {
    main: "#f44336",
    contrastText: "#000000",
  },
  warning: {
    main: "#FBD86C",
    contrastText: "#000000",
  },
  confirmed: {
    main: "#66BB6A",
    contrastText: "#000000",
  },
  notConfirmed: {
    main: "#FBD86C",
    contrastText: "#000000",
  },
  nmr: {
    main: "#f44336",
    contrastText: "#000000",
  },
  valueRatingPositive: {
    main: "#66BB6A",
    light: "#B6D8B8",
  },
  valueRatingNeutral: {
    main: "#FBD86C",
    light: "#FFE8A3",
  },
  valueRatingNegative: {
    main: "#f44336",
    light: "#FFACAC",
  },
};

const defaultTypography = {
  color: palette.text.main,
  fontFamily: "Cabin-Regular",
};

const typography = {
  body1: {
    ...defaultTypography,
    fontSize: 16,
    lineHeight: 24,
  },
  body2: {
    ...defaultTypography,
    fontSize: 14,
    lineHeight: 20,
    color: palette.text.light,
  },
  title: {
    ...defaultTypography,
    fontSize: 18,
  },
  sectionTitle: {
    ...defaultTypography,
    fontSize: 14,
    textTransform: "uppercase",
  },
} as const;

export const theme = createTheme({
  components: {
    Button: {
      titleStyle: {
        ...defaultTypography,
      },
    },
    Chip: {
      titleStyle: {
        ...defaultTypography,
      },
    },
    Text: {
      style: {
        ...defaultTypography,
      },
    },
  },
  lightColors: {
    primary: palette.primary.main,
    secondary: palette.secondary.main,
  },
  palette,
  spacing: (value: number) => value * gridSize,
  typography,
});
