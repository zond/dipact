

const theme = MaterialUI.createMuiTheme({ 
  typography: {
    useNextVariants: true,
    fontFamily: [
      'Cabin',
      'Roboto',
      'sans-serif',
    ].join(','),
    h1: {
      fontSize: '1.625rem',
      fontWeight: 'bold',
    },
    h2: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
    },
    h3: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
    },
    h4: {
      fontSize: '1rem',
      fontWeight: 'bold',
    }
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
