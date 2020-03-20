import Main from '%{ cb "./main.js" }%';
import ProgressDialog from '%{ cb "./progress_dialog.js" }%';

window.Globals = {
	server_request: new Request("https://diplicity-engine.appspot.com/", {
		headers: {
			"X-Diplicity-API-Level": "8",
			Accept: "application/json"
		},
		mode: "cors"
	}),
	user: null,
	self_url: null,
	token: null,
	main: null,
	progress_count: 0,
	order_dialog: null,
	progress_dialog: null
};

ReactDOM.render(<ProgressDialog />, document.getElementById("progress"));
ReactDOM.render(<Main />, document.getElementById("app"));
