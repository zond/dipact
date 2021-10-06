// See https://stackoverflow.com/questions/61220424/material-ui-drawer-finddomnode-is-deprecated-in-strictmode
import { unstable_createMuiStrictModeTheme as createMuiTheme } from '@material-ui/core/styles';


const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
    fontFamily: ["Cabin", "Roboto", "sans-serif"].join(","),
  },
  palette: {
    primary: {
      light: "#63ccff",
      main: "#281A1A",
      dark: "#006db3",
      contrastText: "#FDE2B5",
    },
    secondary: {
      light: "#63ccff",
      main: "#FDE2B5",
      dark: "#006db3",
      contrastText: "#000",
    },
    success: {
      main: "#008000",
    },
  },
});

export default theme;
