import ReactGA from "react-ga";
import { authActions, gaActions } from "@diplicity/common";
import { Middleware } from "redux";
import { storeInitAction } from "./actions";
import { PayloadAction } from "@reduxjs/toolkit";

const GTAG_DEFAULT_CATEGORY = "(not set)";
const PAGE_VIEW_ACTION = "page_view";

export const initMiddleware: Middleware<{}, any> = ({ dispatch }) => (next) => (action) => {
  next(action);
  if (action.type === storeInitAction.type) {
    let token = localStorage.getItem("token");
    if (token === "null") {
      token = null;
    }
    if (token) {
      dispatch(authActions.login(token));
    }
  }
};

export const authLoginMiddleware: Middleware<{}, any> =
  () => (next) => (action: PayloadAction<string>) => {
    if (action.type === authActions.login.type) {
      localStorage.setItem("token", action.payload);
    }
    next(action);
  };

export const authLogoutMiddleware: Middleware<{}, any> =
  () => (next) => (action) => {
    if (action.type === authActions.logout.type) {
      localStorage.removeItem("token");
    }
    next(action);
  };

export const gaRegisterPageViewMiddleware: Middleware<{}, any> =
  () => (next) => (action) => {
    next(action);
    if (action.type === gaActions.registerPageView.type) {
      // eslint-disable-next-line no-restricted-globals
      ReactGA.set({ page_title: action.payload, page_location: location.href });
      ReactGA.event({
        category: GTAG_DEFAULT_CATEGORY,
        action: PAGE_VIEW_ACTION,
      });
    }
  };

const middleware = [
  initMiddleware,
  gaRegisterPageViewMiddleware,
  authLoginMiddleware,
  authLogoutMiddleware,
];
export default middleware;
