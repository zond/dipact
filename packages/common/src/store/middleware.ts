import { isRejected, PayloadAction } from "@reduxjs/toolkit";
import { Action, AnyAction, Middleware } from "redux";

import { selectUserConfig } from "./selectors";
import { diplicityService } from "./service";
import { actions as authActions } from "./auth";
import { actions as feedbackActions } from "./feedback";
import { actions as uiActions } from "./ui";
import { actions as gaActions } from "./ga";
import {
  CreateGameFormValues,
  NationAllocation,
  NewGame,
  Severity,
} from "./types";
import { getQueryMatchers } from "./utils";
import { translateKeys as tk } from "../translations";
import { actions as viewActions } from "./views";

// TODO test
// TODO move to transformers
const transformCreateGameValuesToNewGame = (
  values: CreateGameFormValues
): NewGame => {
  const phaseLengthMinutes =
    values.phaseLengthMultiplier * values.phaseLengthUnit;
  const adjustmentPhaseLengthMinutes = values.customAdjustmentPhaseLength
    ? values.adjustmentPhaseLengthMultiplier * values.adjustmentPhaseLengthUnit
    : 0;
  const chatLanguage =
    values.chatLanguage === "players_choice" ? "" : values.chatLanguage;
  return {
    Anonymous: values.anonymousEnabled,
    ChatLanguageISO639_1: chatLanguage,
    Desc: values.name,
    DisableConferenceChat: !values.conferenceChatEnabled,
    DisableGroupChat: !values.groupChatEnabled,
    DisablePrivateChat: !values.individualChatEnabled,
    FirstMember: { NationPreferences: "" },
    GameMasterEnabled: values.gameMaster,
    LastYear: values.endAfterYears ? values.endAfterYearsValue : 0,
    MaxHated: 0,
    MaxHater: 0,
    MaxRating: values.maxRatingEnabled ? values.maxRating : 0,
    MinQuickness: values.minQuickness,
    MinRating: values.minRating,
    MinReliability: values.minReliability,
    NationAllocation:
      values.nationAllocation === NationAllocation.Random ? 0 : 1,
    NonMovementPhaseLengthMinutes: adjustmentPhaseLengthMinutes,
    PhaseLengthMinutes: phaseLengthMinutes,
    Private: values.privateGame,
    RequireGameMasterInvitation: values.requireGameMasterInvitation,
    SkipMuster: true,
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

export const uiSubmitCreateGameFormWithPreferencesMiddleware: Middleware<
  {},
  any
> =
  ({ dispatch }) =>
  (next) =>
  (
    action: PayloadAction<{
      values: CreateGameFormValues;
      preferences: string[];
    }>
  ) => {
    next(action);
    if (action.type === uiActions.submitCreateGameFormWithPreferences.type) {
      const { values, preferences } = action.payload;
      const newGame = transformCreateGameValuesToNewGame(values);
      newGame.FirstMember = { NationPreferences: preferences.join(",") };
      dispatch<any>(
        diplicityService.endpoints.createGame.initiate(newGame, {
          track: true,
        })
      );
    }
  };

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

const getGAEventForRequest = (action: Action<any>): string | undefined => {
  const queryMatchers = getQueryMatchers();
  if (queryMatchers.matchCreateGameFulfilled(action)) {
    return "create_game";
  }
  if (queryMatchers.matchJoinGameFulfilled(action)) {
    return "game_list_element_join";
  }
  return;
};

export const gaRequestRegisterEventMiddleware: Middleware<{}, any> =
  ({ dispatch }) =>
  (next) =>
  (action) => {
    const event = getGAEventForRequest(action);
    if (event) dispatch(gaActions.registerEvent(event));
    next(action);
  };

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

export const ordersViewMiddleware: Middleware<any, any> =
  ({ dispatch }) =>
  (next) =>
  (action: PayloadAction<string>) => {
    if (action.type === viewActions.initializeOrdersView.type) {
      dispatch(
        diplicityService.endpoints.listVariants.initiate(
          undefined
        ) as unknown as AnyAction
      );
      dispatch(
        diplicityService.endpoints.listPhases.initiate(
          action.payload
        ) as unknown as AnyAction
      );
    }
    return next(action);
  };

const middleware = [
  feedbackRequestMiddleware,
  gaRequestRegisterEventMiddleware,
  authLogoutMiddleware,
  uiPageLoadMiddleware,
  uiSubmitCreateGameFormMiddleware,
  uiSubmitCreateGameFormWithPreferencesMiddleware,
  uiSubmitSettingsFormMiddleware,
  ordersViewMiddleware,
];
export default middleware;
