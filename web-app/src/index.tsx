import React from "react";
import ReactDOM from "react-dom";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { Provider } from "react-redux";

import theme from "./theme";
import { store } from "./store";
import App from "./App";
// import ProgressDialog from "./port/progress_dialog";
// import Snackbar from "./port/snackbar";
import reportWebVitals from "./reportWebVitals";

// ReactDOM.render(<ProgressDialog />, document.getElementById("progress"));
// ReactDOM.render(<Snackbar />, document.getElementById("snackbar"));

ReactDOM.render(
  <React.StrictMode>
    <MuiThemeProvider theme={theme}>
      <Provider store={store}>
        <App />
      </Provider>
    </MuiThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

// // TODO remove after port to regular react is finished
// addEventListener("error", (ev) => {
//   const oldErrorsJSON = localStorage.getItem("errors");
//   const oldErrors = oldErrorsJSON ? JSON.parse(oldErrorsJSON) : [];
//   const struct = {
//     at: new Date(),
//     message: ev.message,
//     filename: ev.filename,
//     lineno: ev.lineno,
//     colno: ev.colno,
//     error: ev.error,
//   };
//   oldErrors.push(struct);
//   while (oldErrors.length > 64) {
//     oldErrors.shift();
//   }
//   localStorage.setItem("errors", JSON.stringify(oldErrors));
//   gtag("event", "exception", struct);
//   return false;
// });

// if (window.Wrapper) {
//   if (window.Wrapper.getAPI) {
//     gtag("set", { client: "wrapped-" + window.Wrapper.getAPI() });
//   } else {
//     gtag("set", { client: "wrapped-unknown" });
//   }
// } else {
//   gtag("set", { client: "browser" });
// }

// if (
//   window.location.href.indexOf("https://dipact.appspot.com") == 0 ||
//   window.location.href.indexOf("https://diplicity.com") == 0
// ) {
//   gtag("set", { api: "prod" });
// } else if (
//   window.location.href.indexOf("https://beta-dot-dipact.appspot.com") == 0
// ) {
//   gtag("set", { api: "beta" });
// } else {
//   gtag("set", { api: "unknown" });
// }
