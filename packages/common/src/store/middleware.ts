import {
  isRejected,
  PayloadAction,
  ThunkAction,
  ThunkDispatch,
} from "@reduxjs/toolkit";
import { Action, AnyAction, Middleware } from "redux";

import {
  selectCreateOrderIsComplete,
  selectCreateOrderParts,
  selectCreateOrderStep,
  selectGame,
  selectNewestPhaseId,
  selectPhase,
  selectUserConfig,
} from "./selectors";
import { diplicityService } from "./service";
import { actions as authActions } from "./auth";
import { actions as createOrderActions } from "./createOrder";
import { actions as feedbackActions } from "./feedback";
import { actions as uiActions } from "./ui";
import { actions as gaActions } from "./ga";
import {
  CreateGameFormValues,
  CreateOrderStep,
  NationAllocation,
  NewGame,
  OrderType,
  Severity,
} from "./types";
import { getQueryMatchers } from "./utils";
import { translateKeys as tk } from "../translations";
import { actions as viewActions } from "./views";
import { gameActions, phaseActions, selectors } from ".";
import { RootState } from "./store";

const { endpoints } = diplicityService;

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
        endpoints.createGame.initiate(newGame, {
          track: true,
        })
      );
    }
  };

export const uiSelectCreateOrderOptionMiddleware: Middleware<{}, any> =
  ({ dispatch, getState }) =>
  (next) =>
  (action: PayloadAction<string>) => {
    next(action);
    if (action.type === uiActions.selectCreateOrderOption.type) {
      const state = getState();
      const step = selectCreateOrderStep(state);
      switch (step) {
        case CreateOrderStep.SelectSource:
          dispatch(createOrderActions.setSource(action.payload));
          break;
        case CreateOrderStep.SelectType:
          dispatch(createOrderActions.setType(action.payload as OrderType));
          break;
        case CreateOrderStep.SelectAux:
          dispatch(createOrderActions.setAux(action.payload));
          break;
        case CreateOrderStep.SelectTarget:
          dispatch(createOrderActions.setTarget(action.payload));
          break;
        case CreateOrderStep.SelectAuxTarget:
          dispatch(createOrderActions.setAuxTarget(action.payload));
          break;
        default:
          break;
      }
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
        endpoints.createGame.initiate(newGame, {
          track: true,
        })
      );
    }
  };

export const submitOrderMiddleware: Middleware<{}, any> =
  ({ dispatch, getState }) =>
  (next) =>
  (action: AnyAction) => {
    next(action);
    if (
      [
        createOrderActions.setTarget.type,
        createOrderActions.setType.type,
      ].includes(action.type)
    ) {
      const createOrderIsComplete = selectCreateOrderIsComplete(getState());
      if (createOrderIsComplete) {
        const state = getState();
        const parts = selectCreateOrderParts(state);
        const { gameId, newestPhaseId } = selectGame(state);
        dispatch(createOrderActions.clear());
        dispatch(
          endpoints.createOrder.initiate({
            Parts: parts,
            gameId: gameId,
            phaseId: newestPhaseId,
          }) as unknown as AnyAction
        );
      }
    }
  };

export const setNewestPhaseIdMiddleware: Middleware<{}, any> =
  ({ dispatch, getState }) =>
  (next) =>
  (action: AnyAction) => {
    next(action);
    if (endpoints.getGame.matchFulfilled(action)) {
      const phaseId = selectNewestPhaseId(getState());
      const currentPhaseId = selectPhase(getState());
      if (phaseId) {
        dispatch(gameActions.setNewestPhaseId(phaseId.toString()));
        if (!currentPhaseId) {
          dispatch(phaseActions.set(phaseId));
        }
      }
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
        endpoints.updateUserConfig.initiate(userConfig, {
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
  } else if (queryMatchers.matchCreateOrderFulfilled(action)) {
    return getFeedback(Severity.Success, tk.feedback.createOrder.fulfilled);
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
        endpoints.listVariants.initiate(undefined) as unknown as AnyAction
      );
      dispatch(
        endpoints.listPhases.initiate(action.payload) as unknown as AnyAction
      );
    }
    return next(action);
  };

export type AppThunk<
  ActionTypes extends Action,
  ReturnType = void
> = ThunkAction<ReturnType, RootState, unknown, ActionTypes>;

export const initializeMapViewMiddleware: Middleware<
  {},
  RootState,
  ThunkDispatch<RootState, unknown, AnyAction>
> =
  ({ dispatch, getState }) =>
  (next) =>
  (action: PayloadAction<string>) => {
    next(action);
    if (action.type === viewActions.initializeMapView.type) {
      const gameId = action.payload;
      dispatch(gameActions.setGameId(gameId));
      const listVariantsResult = dispatch(
        endpoints.listVariants.initiate(undefined)
      );
      const getGameResult = dispatch(endpoints.getGame.initiate(gameId));
      dispatch(endpoints.listPhases.initiate(gameId));
      Promise.all([listVariantsResult, getGameResult]).then(() => {
        const variant = selectors.selectVariantFromGameId(getState())?.Name;
        if (variant) {
          dispatch(endpoints.getVariantSVG.initiate(variant));
          dispatch(
            endpoints.getVariantUnitSVG.initiate({
              variantName: variant,
              unitType: "Army",
            })
          );
          dispatch(
            endpoints.getVariantUnitSVG.initiate({
              variantName: variant,
              unitType: "Fleet",
            })
          );
        }
      });
    }
  };

const middleware = [
  feedbackRequestMiddleware,
  gaRequestRegisterEventMiddleware,
  authLogoutMiddleware,
  uiPageLoadMiddleware,
  uiSelectCreateOrderOptionMiddleware,
  uiSubmitCreateGameFormMiddleware,
  uiSubmitCreateGameFormWithPreferencesMiddleware,
  uiSubmitSettingsFormMiddleware,
  submitOrderMiddleware,
  setNewestPhaseIdMiddleware,
  ordersViewMiddleware,
  initializeMapViewMiddleware,
];
export default middleware;
