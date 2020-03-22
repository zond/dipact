import Main from '%{ cb "./main.js" }%';
import ProgressDialog from '%{ cb "./progress_dialog.js" }%';

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
	orderDialog: null,
	progressDialog: null,
	variants: [],
	memoizeCache: {}
};

ReactDOM.render(<ProgressDialog />, document.getElementById("progress"));
ReactDOM.render(<Main />, document.getElementById("app"));
