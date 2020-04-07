

const theme = MaterialUI.createMuiTheme({ 
  typography: {
    useNextVariants: true,
    fontFamily: [
      'Cabin',
      'Roboto',
      'sans-serif',
    ].join(','),
  },
  palette: {
    primary: {
      light: '#63ccff',
      main: '#281A1A',
      dark: '#006db3',
      contrastText: '#FDE2B5',
    },
     secondary: {
      light: '#63ccff',
      main: '#FDE2B5',
      dark: '#006db3',
      contrastText: '#000',
    },
  },
 }); 
 
 export default theme;
