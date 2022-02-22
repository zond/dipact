import { isRejected } from "@reduxjs/toolkit";
import { Action, Middleware } from "redux";
import ReactGA from "react-ga";

import { selectUserConfig } from "./selectors";
import { diplicityService } from "./service";
import { actions as authActions } from "./auth";
import { actions as feedbackActions } from "./feedback";
import { actions as uiActions } from "./ui";
import { actions as gaActions } from "./ga";
import { Severity } from "./types";
import { getQueryMatchers } from "./utils";
import { translateKeys as tk } from "../translations";

const GTAG_DEFAULT_CATEGORY = "(not set)";
const PAGE_VIEW_ACTION = "page_view";

export const uiSubmitSettingsFormMiddleware: Middleware<{}, any> =
  ({ getState, dispatch }) =>
  (next) =>
  (action) => {
    next(action);
    if (action.type === uiActions.submitSettingsForm.type) {
      const state = getState();
      const userConfig = selectUserConfig(state);
      if (!userConfig) return;
      dispatch<any>(
        diplicityService.endpoints.updateUserConfig.initiate(userConfig, {
          track: true,
        })
      );
    }
  };

export const uiPageLoadMiddleware: Middleware<{}, any> =
  ({ dispatch }) =>
  (next) =>
  (action) => {
    next(action);
    if (action.type === uiActions.pageLoad.type) {
      dispatch(gaActions.registerPageView(action.payload));
    }
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

const getFeedbackForRequest = (action: Action<any>) => {
  const getFeedback = (severity: Severity, message: string) => ({
    severity,
    message,
  });
  const queryMatchers = getQueryMatchers();
  if (queryMatchers.matchJoinGameFulfilled(action)) {
    return getFeedback(Severity.Success, tk.feedback.joinGame.fulfilled);
  } else if (queryMatchers.matchJoinGameRejected(action)) {
    return getFeedback(Severity.Error, tk.feedback.joinGame.rejected);
  } else if (queryMatchers.matchRescheduleGameFulfilled(action)) {
    return getFeedback(Severity.Success, tk.feedback.rescheduleGame.fulfilled);
  } else if (queryMatchers.matchRescheduleGameRejected(action)) {
    return getFeedback(Severity.Error, tk.feedback.rescheduleGame.rejected);
  } else if (queryMatchers.matchInviteFulfilled(action)) {
    return getFeedback(Severity.Success, tk.feedback.invite.fulfilled);
  } else if (queryMatchers.matchInviteRejected(action)) {
    return getFeedback(Severity.Error, tk.feedback.invite.rejected);
  } else if (queryMatchers.matchUnInviteFulfilled(action)) {
    return getFeedback(Severity.Success, tk.feedback.unInvite.fulfilled);
  } else if (queryMatchers.matchUnInviteRejected(action)) {
    return getFeedback(Severity.Error, tk.feedback.unInvite.rejected);
  } else if (queryMatchers.matchRenameGameFulfilled(action)) {
    return getFeedback(Severity.Success, tk.feedback.renameGame.fulfilled);
  } else if (queryMatchers.matchRenameGameRejected(action)) {
    return getFeedback(Severity.Error, tk.feedback.renameGame.rejected);
  } else if (queryMatchers.matchDeleteGameFulfilled(action)) {
    return getFeedback(Severity.Success, tk.feedback.deleteGame.fulfilled);
  } else if (queryMatchers.matchDeleteGameRejected(action)) {
    return getFeedback(Severity.Error, tk.feedback.deleteGame.rejected);
  }
  return;
};

export const feedbackRequestMiddleware: Middleware<{}, any> =
  ({ dispatch }) =>
  (next) =>
  (action) => {
    const feedback = getFeedbackForRequest(action);
    if (feedback) dispatch(feedbackActions.add(feedback));
    next(action);
  };

export const authLogoutMiddleware: Middleware<{}, any> =
  ({ dispatch }) =>
  (next) =>
  (action) => {
    if (isRejected(action)) {
      if (action?.payload?.status === 401) {
        dispatch(authActions.logout());
      }
    }
    return next(action);
  };

const middleware = [
  feedbackRequestMiddleware,
  gaRegisterPageViewMiddleware,
  authLogoutMiddleware,
  uiPageLoadMiddleware,
  uiSubmitSettingsFormMiddleware,
];
export default middleware;
