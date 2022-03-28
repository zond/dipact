/* eslint-disable no-restricted-globals */
import { AnyAction } from "@reduxjs/toolkit";
import { RouteConfig } from "../pages/RouteConfig";
import { createMiddleware } from "./base";
import { push } from "connected-react-router";

const matchCreateGameFulfilled = (action: AnyAction) =>
  action.type === "diplicityService/executeQuery/fulfilled" &&
  action.meta.arg.endpointName === "createGame";

export const redirectMiddleware = createMiddleware<AnyAction>({
  match: (action: AnyAction) =>
    matchCreateGameFulfilled(action),
  afterAction: (action, { dispatch }) => {
    if (matchCreateGameFulfilled(action)) {
      dispatch(push(RouteConfig.Home));
    }
  },
});

const middleware = [redirectMiddleware];

export default middleware;
