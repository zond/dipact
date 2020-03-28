import Main from '%{ cb "/js/main.js" }%';
import ProgressDialog from '%{ cb "/js/progress_dialog.js" }%';
import Messaging from '%{ cb "/js/messaging.js" }%';


/* I would prefer to put this into a separate file to impor the class but haven't figured out how to import/export it since we're not using the default React scheme - Joren */
const Theme = MaterialUI.createMuiTheme({ 
  typography: {
    useNextVariants: true,
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
 


window.Globals = {
	serverRequest: new Request("https://diplicity-engine.appspot.com/", {
		headers: {
			"X-Diplicity-API-Level": "8",
			Accept: "application/json"
		},
		mode: "cors"
	}),
	user: null,
	selfURL: null,
	token: null,
	progressCount: 0,
	progressDialog: null,
	variants: [],
	memoizeCache: {},
	messaging: Messaging
};

ReactDOM.render(<ProgressDialog />, document.getElementById("progress"));
ReactDOM.render(<MaterialUI.ThemeProvider theme={Theme}><Main /></MaterialUI.ThemeProvider>, document.getElementById("app"));

window.addEventListener("popstate", ev => {
	window.location.reload();
});
