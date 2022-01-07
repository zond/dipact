import { isRejected } from "@reduxjs/toolkit";
import { Middleware } from "redux";
import ReactGA from "react-ga";

import { submitSettingsForm } from "./actions";
import { selectUserConfig } from "./selectors";
import { diplicityService } from "./service";
import { actions as authActions } from "./auth";
import { actions as feedbackActions } from "./feedback";
import { actions as uiActions } from "./ui";
import { actions as gaActions } from "./ga";
import { Severity } from "./types";

const GTAG_DEFAULT_CATEGORY = "(not set)";
const PAGE_VIEW_ACTION = "page_view";

export const submitSettingsFormMiddleware: Middleware<{}, any> = ({
  getState,
  dispatch,
}) => (next) => (action) => {
  next(action);
  if (action.type === submitSettingsForm.type) {
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

export const uiPageLoadMiddleware: Middleware<{}, any> = ({
  getState,
  dispatch,
}) => (next) => (action) => {
  next(action);
  if (action.type === uiActions.pageLoad.type) {
    dispatch(gaActions.registerPageView(action.payload));
  }
};

export const gaRegisterPageViewMiddleware: Middleware<{}, any> = () => (
  next
) => (action) => {
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

export const joinGameMiddleware: Middleware<{}, any> = ({
  getState,
  dispatch,
}) => (next) => (action) => {
  if (diplicityService.endpoints.joinGame.matchFulfilled(action)) {
    dispatch(
      feedbackActions.add({
        severity: Severity.Success,
        message: "Joined game!",
      })
    );
  }
  if (diplicityService.endpoints.joinGame.matchRejected(action)) {
    dispatch(
      feedbackActions.add({
        severity: Severity.Error,
        message: "Couldn't join game.",
      })
    );
  }
  next(action);
};

export const rescheduleGameMiddleware: Middleware<{}, any> = ({
  getState,
  dispatch,
}) => (next) => (action) => {
  if (diplicityService.endpoints.rescheduleGame.matchFulfilled(action)) {
    dispatch(
      feedbackActions.add({
        severity: Severity.Success,
        message: "Rescheduled game!",
      })
    );
  }
  if (diplicityService.endpoints.rescheduleGame.matchRejected(action)) {
    dispatch(
      feedbackActions.add({
        severity: Severity.Error,
        message: "Couldn't reschedule game.",
      })
    );
  }
  next(action);
};

export const inviteMiddleware: Middleware<{}, any> = ({
  getState,
  dispatch,
}) => (next) => (action) => {
  if (diplicityService.endpoints.invite.matchFulfilled(action)) {
    dispatch(
      feedbackActions.add({
        severity: Severity.Success,
        message: "Invited!",
      })
    );
  }
  if (diplicityService.endpoints.invite.matchRejected(action)) {
    dispatch(
      feedbackActions.add({
        severity: Severity.Error,
        message: "Couldn't invite user.",
      })
    );
  }
  next(action);
};

// TODO test
export const unInviteMiddleware: Middleware<{}, any> = ({
  getState,
  dispatch,
}) => (next) => (action) => {
  if (diplicityService.endpoints.unInvite.matchFulfilled(action)) {
    dispatch(
      feedbackActions.add({
        severity: Severity.Success,
        message: "Un-invited.",
      })
    );
  }
  if (diplicityService.endpoints.unInvite.matchRejected(action)) {
    dispatch(
      feedbackActions.add({
        severity: Severity.Error,
        message: "Couldn't un-invite user.",
      })
    );
  }
  next(action);
};

export const renameGameMiddleware: Middleware<{}, any> = ({
  getState,
  dispatch,
}) => (next) => (action) => {
  if (diplicityService.endpoints.renameGame.matchFulfilled(action)) {
    dispatch(
      feedbackActions.add({
        severity: Severity.Success,
        message: "Renamed!",
      })
    );
  }
  if (diplicityService.endpoints.renameGame.matchRejected(action)) {
    dispatch(
      feedbackActions.add({
        severity: Severity.Error,
        message: "Couldn't rename game.",
      })
    );
  }
  next(action);
};

export const deleteGameMiddleware: Middleware<{}, any> = ({
  getState,
  dispatch,
}) => (next) => (action) => {
  if (diplicityService.endpoints.deleteGame.matchFulfilled(action)) {
    dispatch(
      feedbackActions.add({
        severity: Severity.Success,
        message: "Deleted!",
      })
    );
  }
  if (diplicityService.endpoints.deleteGame.matchRejected(action)) {
    dispatch(
      feedbackActions.add({
        severity: Severity.Error,
        message: "Couldn't delete game.",
      })
    );
  }
  next(action);
};

const logoutOn400: Middleware<{}, any> = ({ getState, dispatch }) => (next) => (
  action
) => {
  if (isRejected(action)) {
    if (action?.payload?.status === 401) {
      dispatch(authActions.logout());
    }
  }
  return next(action);
};

const middleware = [
  submitSettingsFormMiddleware,
  logoutOn400,
  joinGameMiddleware,
  rescheduleGameMiddleware,
  inviteMiddleware,
  unInviteMiddleware,
  renameGameMiddleware,
  deleteGameMiddleware,
  gaRegisterPageViewMiddleware,
  uiPageLoadMiddleware,
];
export default middleware;
