/* eslint-disable no-restricted-globals */
import { AnyAction, Middleware } from "@reduxjs/toolkit";
import { RouteConfig } from "../pages/RouteConfig";
import { createMiddleware } from "./base";
import { push } from "connected-react-router";
import { gaActions } from "@diplicity/common";
import ReactGA from "react-ga";

const GTAG_DEFAULT_CATEGORY = "(not set)";
const PAGE_VIEW_ACTION = "page_view";

const matchCreateGameFulfilled = (action: AnyAction) =>
  action.type === "diplicityService/executeQuery/fulfilled" &&
  action.meta.arg.endpointName === "createGame";

export const redirectMiddleware = createMiddleware<AnyAction>({
  match: (action: AnyAction) => matchCreateGameFulfilled(action),
  afterAction: (action, { dispatch }) => {
    if (matchCreateGameFulfilled(action)) {
      dispatch(push(RouteConfig.Home));
    }
  },
});

// TODO test
// TODO implement in native
export const registerPageViewMiddleware = createMiddleware<AnyAction>({
  match: gaActions.registerPageView.type,
  afterAction: (action) => {
      ReactGA.set({ page_title: action.payload, page_location: location.href });
      ReactGA.event({
        category: GTAG_DEFAULT_CATEGORY,
        action: PAGE_VIEW_ACTION,
      });
  },
});

// TODO test
// TODO implement in native
export const registerEventMiddleware = createMiddleware<AnyAction>({
  match: gaActions.registerEvent.type,
  afterAction: (action) => {
      ReactGA.event({
        category: GTAG_DEFAULT_CATEGORY,
        action: action.payload,
      });
  },
});

const middleware = [
  registerEventMiddleware,
  registerPageViewMiddleware,
  redirectMiddleware,
];

export default middleware;
