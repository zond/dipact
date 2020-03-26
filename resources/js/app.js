import Main from '%{ cb "/js/main.js" }%';
import ProgressDialog from '%{ cb "/js/progress_dialog.js" }%';

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
	memoizeCache: {}
};

ReactDOM.render(<ProgressDialog />, document.getElementById("progress"));
ReactDOM.render(<Main />, document.getElementById("app"));
window.addEventListener("popstate", ev => {
	window.location.reload();
});
