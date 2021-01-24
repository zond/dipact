import * as helpers from '%{ cb "/js/helpers.js" }%';

import Main from '%{ cb "/js/main.js" }%';
import ProgressDialog from '%{ cb "/js/progress_dialog.js" }%';
import Snackbar from '%{ cb "/js/snackbar.js" }%';
import Messaging from '%{ cb "/js/messaging.js" }%';
import Theme from '%{ cb "/js/theme.js" }%';

const hrefURL = new URL(location.href);

const serverURL = new URL(
	localStorage.getItem("serverURL") || "https://diplicity-engine.appspot.com/"
);
const fakeID = localStorage.getItem("fakeID");
if (fakeID) {
	serverURL.searchParams.set("fake-id", fakeID);
}

window.Globals = {
	serverRequest: new Request(serverURL, {
		headers: {
			"X-Diplicity-API-Level": "8",
			Accept: "application/json",
			"X-Diplicity-Client-Name": "dipact@" + hrefURL.host,
		},
		mode: "cors",
	}),
	user: {},
	onNewForumMail: (fm) => {
		window.Globals.latestForumMail = fm;
	},
	latestForumMail: null,
	userStats: { Properties: { TrueSkill: {} } },
	userConfig: { Properties: { FCMTokens: [], MailConfig: {}, Colors: [] } },
	gameMasterMode: !!localStorage.getItem("gameMasterMode"),
	token: null,
	progressCount: 0,
	progressDialog: null,
	snackbar: null,
	variants: [],
	memoizeCache: {},
	messaging: Messaging,
	contrastColors: ((_) => {
		let m = dippyMap($("body"));
		return m.contrasts;
	})(),
	colorOverrides: {
		nationCodes: {},
		variantCodes: {},
		positions: [],
		variants: {},
		nations: {},
	},
	backListeners: [],
	WrapperCallbacks: {},
	bans: {},
	loginURL: null,
	userRatingHistogram: null,
	fakeID: fakeID,
};

ReactDOM.render(<ProgressDialog />, document.getElementById("progress"));
ReactDOM.render(<Snackbar />, document.getElementById("snackbar"));
ReactDOM.render(
	<MaterialUI.ThemeProvider theme={Theme}>
		<Main />
	</MaterialUI.ThemeProvider>,
	document.getElementById("app")
);

addEventListener("error", (ev) => {
	const oldErrorsJSON = localStorage.getItem("errors");
	const oldErrors = oldErrorsJSON ? JSON.parse(oldErrorsJSON) : [];
	const struct = {
		at: new Date(),
		message: ev.message,
		filename: ev.filename,
		lineno: ev.lineno,
		colno: ev.colno,
		error: ev.error,
	};
	oldErrors.push(struct);
	while (oldErrors.length > 64) {
		oldErrors.shift();
	}
	localStorage.setItem("errors", JSON.stringify(oldErrors));
	gtag("event", "exception", struct);
	return false;
});

addEventListener("popstate", (ev) => {
	if (Globals.backListeners.length > 0) {
		const listener = Globals.backListeners.shift();
		listener();
	} else {
		location.reload();
	}
});

if (window.Wrapper) {
	if (window.Wrapper.getAPI) {
		gtag("set", { client: "wrapped-" + window.Wrapper.getAPI() });
	} else {
		gtag("set", { client: "wrapped-unknown" });
	}
} else {
	gtag("set", { client: "browser" });
}

if (
	window.location.href.indexOf("https://dipact.appspot.com") == 0 ||
	window.location.href.indexOf("https://diplicity.com") == 0
) {
	gtag("set", { api: "prod" });
} else if (
	window.location.href.indexOf("https://beta-dot-dipact.appspot.com") == 0
) {
	gtag("set", { api: "beta" });
} else {
	gtag("set", { api: "unknown" });
}
