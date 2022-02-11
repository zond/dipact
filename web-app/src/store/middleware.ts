import { isRejected, PayloadAction } from "@reduxjs/toolkit";
import { Action, Middleware } from "redux";
import ReactGA from "react-ga";

import { selectUserConfig } from "./selectors";
import { diplicityService } from "./service";
import { actions as authActions } from "./auth";
import { actions as feedbackActions } from "./feedback";
import { actions as uiActions } from "./ui";
import { actions as gaActions } from "./ga";
import { CreateGameFormValues, NewGame, Severity } from "./types";
import { getQueryMatchers } from "./utils";
import tk from "../translations/translateKeys";

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

// TODO test
// TODO move to transformers
const transformCreateGameValuesToNewGame = (
  values: CreateGameFormValues
): NewGame => {
  const adjustmentPhaseLengthMinutes =
    values.adjustmentPhaseLengthMultiplier * values.adjustmentPhaseLengthUnit;
  const phaseLengthMinutes =
    values.phaseLengthMultiplier * values.phaseLengthUnit;
  const chatLanguage =
    values.chatLanguage === "players_choice" ? "" : values.chatLanguage;
  return {
    Anonymous: values.anonymousEnabled,
    ChatLanguageISO639_1: chatLanguage,
    Desc: values.name,
    DisableConferenceChat: !values.conferenceChatEnabled,
    DisableGroupChat: !values.groupChatEnabled,
    DisablePrivateChat: !values.individualChatEnabled,
    GameMasterEnabled: values.gameMaster,
    LastYear: values.endAfterYearsValue,
    MaxHated: 0,
    MaxHater: 0,
    MaxRating: values.maxRating,
    MinQuickness: values.minQuickness,
    MinRating: values.minRating,
    MinReliability: values.minReliability,
    NationAllocation: values.nationAllocation,
    NonMovementPhaseLengthMinutes: adjustmentPhaseLengthMinutes,
    PhaseLengthMinutes: phaseLengthMinutes,
    Private: values.privateGame,
    RequireGameMasterInvitation: values.requireGameMasterInvitation,
    SkipMuster: false,
    Variant: values.variant,
  };
};

export const uiSubmitCreateGameFormMiddleware: Middleware<{}, any> =
  ({ dispatch }) =>
  (next) =>
  (action: PayloadAction<CreateGameFormValues>) => {
    next(action);
    if (action.type === uiActions.submitCreateGameForm.type) {
      const values = action.payload;
      const newGame = transformCreateGameValuesToNewGame(values);
      dispatch<any>(
        diplicityService.endpoints.createGame.initiate(newGame, {
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

export const gaRegisterEventMiddleware: Middleware<{}, any> =
  () => (next) => (action) => {
    next(action);
    if (action.type === gaActions.registerEvent.type) {
      // eslint-disable-next-line no-restricted-globals
      ReactGA.event({
        category: GTAG_DEFAULT_CATEGORY,
        action: action.payload,
      });
    }
  };

const getGAEventForRequest = (action: Action<any>) => {
  const queryMatchers = getQueryMatchers();
  if (queryMatchers.matchCreateGameFulfilled(action)) {
    return "create_game";
  }
}

export const gaRequestRegisterEventMiddleware: Middleware<{}, any> =
  ({ dispatch }) => (next) => (action) => {
    const event = getGAEventForRequest(action);
    if (event) dispatch(gaActions.registerEvent(event));
    next(action);
  }

const getFeedbackForRequest = (action: Action<any>) => {
  const getFeedback = (severity: Severity, message: string) => ({
    severity,
    message,
  });
  const queryMatchers = getQueryMatchers();
  if (queryMatchers.matchCreateGameRejected(action)) {
    return getFeedback(Severity.Error, tk.feedback.createGame.rejected);
  } else if (queryMatchers.matchCreateGameFulfilled(action)) {
    return getFeedback(Severity.Success, tk.feedback.createGame.fulfilled);
  } else if (queryMatchers.matchJoinGameFulfilled(action)) {
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
  gaRegisterEventMiddleware,
  gaRequestRegisterEventMiddleware,
  authLogoutMiddleware,
  uiPageLoadMiddleware,
  uiSubmitCreateGameFormMiddleware,
  uiSubmitSettingsFormMiddleware,
];
export default middleware;
