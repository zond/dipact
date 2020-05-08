import * as helpers from '%{ cb "/js/helpers.js" }%';

import Main from '%{ cb "/js/main.js" }%';
import ProgressDialog from '%{ cb "/js/progress_dialog.js" }%';
import Snackbar from '%{ cb "/js/snackbar.js" }%';
import Messaging from '%{ cb "/js/messaging.js" }%';
import Theme from '%{ cb "/js/theme.js" }%';

const hrefURL = new URL(location.href);

window.Globals = {
	serverRequest: new Request("https://diplicity-engine.appspot.com/", {
		headers: {
			"X-Diplicity-API-Level": "8",
			Accept: "application/json",
			"X-Diplicity-Client-Name": "dipact@" + hrefURL.host
		},
		mode: "cors"
	}),
	user: { Properties: {} },
	userStats: { Properties: { TrueSkill: {} } },
	userConfig: { Properties: { FCMTokens: [], MailConfig: {}, Colors: [] } },
	token: null,
	progressCount: 0,
	progressDialog: null,
	snackbar: null,
	variants: [],
	memoizeCache: {},
	messaging: Messaging,
	contrastColors: (_ => {
		let m = dippyMap($("body"));
		return m.contrasts;
	})(),
	colorOverrides: {
		nationCodes: {},
		variantCodes: {},
		positions: [],
		variants: {},
		nations: {}
	},
	backListeners: [],
	WrapperCallbacks: {},
	bans: {},
	loginURL: null
};

ReactDOM.render(<ProgressDialog />, document.getElementById("progress"));
ReactDOM.render(<Snackbar />, document.getElementById("snackbar"));
ReactDOM.render(
	<MaterialUI.ThemeProvider theme={Theme}>
		<Main />
	</MaterialUI.ThemeProvider>,
	document.getElementById("app")
);

addEventListener("error", ev => {
	const oldErrorsJSON = localStorage.getItem("errors");
	const oldErrors = oldErrorsJSON ? JSON.parse(oldErrorsJSON) : [];
	oldErrors.push({
		at: new Date(),
		message: ev.message,
		filename: ev.filename,
		lineno: ev.lineno,
		colno: ev.colno,
		error: ev.error
	});
	while (oldErrors.length > 64) {
		oldErrors.shift();
	}
	localStorage.setItem("errors", JSON.stringify(oldErrors));
	return false;
});

addEventListener("popstate", ev => {
	if (Globals.backListeners.length > 0) {
		const listener = Globals.backListeners.shift();
		listener();
	} else {
		location.reload();
	}
});
