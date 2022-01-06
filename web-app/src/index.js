/* eslint-disable no-restricted-globals */
import React from "react";
import gtag from "ga-gtag";
import "./index.css";
import ReactDOM from "react-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ThemeProvider, StyledEngineProvider } from "@mui/material";
import { Provider } from "react-redux";
import { store } from "./store";
import theme from "./theme";
import Globals from "./Globals";
import "@fontsource/cabin";
import worker from "./mockService/browser";
import { I18nextProvider } from "react-i18next";
import i18next from "i18next";
import common_en from "./translations/en/common.json";

i18next.init({
  interpolation: { escapeValue: false },
  lng: "en",
  resources: {
    en: {
      common: common_en, 
    },
  },
});

if (process.env.NODE_ENV === "development") {
  worker.start();
}

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <I18nextProvider i18n={i18next}>
            <App />
          </I18nextProvider>
        </ThemeProvider>
      </StyledEngineProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

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
  window.location.href.indexOf("https://dipact.appspot.com") === 0 ||
  window.location.href.indexOf("https://diplicity.com") === 0
) {
  gtag("set", { api: "prod" });
} else if (
  window.location.href.indexOf("https://beta-dot-dipact.appspot.com") === 0
) {
  gtag("set", { api: "beta" });
} else {
  gtag("set", { api: "unknown" });
}
