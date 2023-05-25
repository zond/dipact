/* eslint-disable no-restricted-globals */
import React from "react";
import gtag from "ga-gtag";
import "./index.css";
import ReactDOM from "react-dom";
import App from "./App";
import ProgressDialog from "./components/ProgressDialog";
import Snackbar from "./components/Snackbar";
import { ThemeProvider } from "@material-ui/core";
import theme from "./theme";
import Globals from "./Globals";
import "@fontsource/cabin";
import { i18n } from "@diplicity/common";
import { store } from "./store";
import { I18nextProvider } from "react-i18next";
import { Provider } from "react-redux";

if (process.env.NODE_ENV === "development") {
  const { worker } = require("./mocks/browser");
  // worker.start();
}

ReactDOM.render(<ProgressDialog />, document.getElementById("progress"));
ReactDOM.render(<Snackbar />, document.getElementById("snackbar"));
ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <I18nextProvider i18n={i18n}>
          <App />
        </I18nextProvider>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
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

if (window.location.href.indexOf("https://diplicity.com") === 0) {
  gtag("set", { api: "prod" });
} else if (window.location.href.indexOf("https://beta.diplicity.com") === 0) {
  gtag("set", { api: "beta" });
} else {
  gtag("set", { api: "unknown" });
}
