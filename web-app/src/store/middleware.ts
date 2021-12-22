import { isRejected } from "@reduxjs/toolkit";
import { Middleware } from "redux";
import { submitSettingsForm } from "./actions";
import { selectUserConfig } from "./selectors";
import { diplicityService } from "./service";
import { actions as authActions } from "./auth";
import { actions as feedbackActions } from "./feedback";
import { Severity } from "./types";

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
];
export default middleware;
