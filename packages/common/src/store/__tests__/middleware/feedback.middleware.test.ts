import { feedbackRequestMiddleware } from "../../middleware";
import { actions } from "../../feedback";
import {
  createMiddlewareAPI,
  createThunkAction,
  ignoresOtherAction,
  RequestStatus,
} from "../../../utils/test";
import { Severity } from "../../types";
import { AnyAction } from "@reduxjs/toolkit";
import tk from "../../../translations/translateKeys";

const createTestMatcher =
  (endpointName: string, requestStatus: string) => (action: AnyAction) =>
    action.meta?.arg?.endpointName === endpointName &&
    action.meta?.requestStatus === requestStatus;

jest.mock("../../utils", () => ({
  getQueryMatchers: () => ({
    matchJoinGameFulfilled: createTestMatcher("joinGame", "fulfilled"),
    matchJoinGameRejected: createTestMatcher("joinGame", "rejected"),
    matchRescheduleGameFulfilled: createTestMatcher(
      "rescheduleGame",
      "fulfilled"
    ),
    matchRescheduleGameRejected: createTestMatcher(
      "rescheduleGame",
      "rejected"
    ),
    matchInviteFulfilled: createTestMatcher("invite", "fulfilled"),
    matchInviteRejected: createTestMatcher("invite", "rejected"),
    matchUnInviteFulfilled: createTestMatcher("unInvite", "fulfilled"),
    matchUnInviteRejected: createTestMatcher("unInvite", "rejected"),
    matchRenameGameFulfilled: createTestMatcher("renameGame", "fulfilled"),
    matchRenameGameRejected: createTestMatcher("renameGame", "rejected"),
    matchDeleteGameFulfilled: createTestMatcher("deleteGame", "fulfilled"),
    matchDeleteGameRejected: createTestMatcher("deleteGame", "rejected"),
  }),
}));

describe("feedbackRequestMiddleware", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  const middleware = feedbackRequestMiddleware;
  test("Dispatches feedback/add for joinGame/fulfilled", () => {
    const {
      invoke,
      next,
      store: { dispatch },
    } = createMiddlewareAPI(middleware);
    const action = createThunkAction("joinGame", RequestStatus.Fulfilled);
    invoke(action);
    expect(dispatch).toBeCalledWith(
      actions.add({
        severity: Severity.Success,
        message: tk.feedback.joinGame.fulfilled,
      })
    );
    expect(next).toBeCalledWith(action);
  });
  test("Dispatches feedback/add for joinGame/rejected", () => {
    const {
      invoke,
      next,
      store: { dispatch },
    } = createMiddlewareAPI(middleware);
    const action = createThunkAction("joinGame", RequestStatus.Rejected);
    invoke(action);
    expect(dispatch).toBeCalledWith(
      actions.add({
        severity: Severity.Error,
        message: tk.feedback.joinGame.rejected,
      })
    );
    expect(next).toBeCalledWith(action);
  });
  test("Dispatches feedback/add for rescheduleGame/fulfilled", () => {
    const {
      invoke,
      next,
      store: { dispatch },
    } = createMiddlewareAPI(middleware);
    const action = createThunkAction("rescheduleGame", RequestStatus.Fulfilled);
    invoke(action);
    expect(dispatch).toBeCalledWith(
      actions.add({
        severity: Severity.Success,
        message: tk.feedback.rescheduleGame.fulfilled,
      })
    );
    expect(next).toBeCalledWith(action);
  });
  test("Dispatches feedback/add for rescheduleGame/rejected", () => {
    const {
      invoke,
      next,
      store: { dispatch },
    } = createMiddlewareAPI(middleware);
    const action = createThunkAction("rescheduleGame", RequestStatus.Rejected);
    invoke(action);
    expect(dispatch).toBeCalledWith(
      actions.add({
        severity: Severity.Error,
        message: tk.feedback.rescheduleGame.rejected,
      })
    );
    expect(next).toBeCalledWith(action);
  });
  test("Dispatches feedback/add for invite/fulfilled", () => {
    const {
      invoke,
      next,
      store: { dispatch },
    } = createMiddlewareAPI(middleware);
    const action = createThunkAction("invite", RequestStatus.Fulfilled);
    invoke(action);
    expect(dispatch).toBeCalledWith(
      actions.add({ severity: Severity.Success, message: tk.feedback.invite.fulfilled })
    );
    expect(next).toBeCalledWith(action);
  });
  test("Dispatches feedback/add for invite/rejected", () => {
    const {
      invoke,
      next,
      store: { dispatch },
    } = createMiddlewareAPI(middleware);
    const action = createThunkAction("invite", RequestStatus.Rejected);
    invoke(action);
    expect(dispatch).toBeCalledWith(
      actions.add({
        severity: Severity.Error,
        message: tk.feedback.invite.rejected,
      })
    );
    expect(next).toBeCalledWith(action);
  });
  test("Dispatches feedback/add for unInvite/fulfilled", () => {
    const {
      invoke,
      next,
      store: { dispatch },
    } = createMiddlewareAPI(middleware);
    const action = createThunkAction("unInvite", RequestStatus.Fulfilled);
    invoke(action);
    expect(dispatch).toBeCalledWith(
      actions.add({
        severity: Severity.Success,
        message: tk.feedback.unInvite.fulfilled,
      })
    );
    expect(next).toBeCalledWith(action);
  });
  test("Dispatches feedback/add for unInvite/rejected", () => {
    const {
      invoke,
      next,
      store: { dispatch },
    } = createMiddlewareAPI(middleware);
    const action = createThunkAction("unInvite", RequestStatus.Rejected);
    invoke(action);
    expect(dispatch).toBeCalledWith(
      actions.add({
        severity: Severity.Error,
        message: tk.feedback.unInvite.rejected,
      })
    );
    expect(next).toBeCalledWith(action);
  });
  test("Dispatches feedback/add for renameGame/fulfilled", () => {
    const {
      invoke,
      next,
      store: { dispatch },
    } = createMiddlewareAPI(middleware);
    const action = createThunkAction("renameGame", RequestStatus.Fulfilled);
    invoke(action);
    expect(dispatch).toBeCalledWith(
      actions.add({
        severity: Severity.Success,
        message: tk.feedback.renameGame.fulfilled,
      })
    );
    expect(next).toBeCalledWith(action);
  });
  test("Dispatches feedback/add for renameGame/rejected", () => {
    const {
      invoke,
      next,
      store: { dispatch },
    } = createMiddlewareAPI(middleware);
    const action = createThunkAction("renameGame", RequestStatus.Rejected);
    invoke(action);
    expect(dispatch).toBeCalledWith(
      actions.add({
        severity: Severity.Error,
        message: tk.feedback.renameGame.rejected,
      })
    );
    expect(next).toBeCalledWith(action);
  });
  test("Dispatches feedback/add for deleteGame/fulfilled", () => {
    const {
      invoke,
      next,
      store: { dispatch },
    } = createMiddlewareAPI(middleware);
    const action = createThunkAction("deleteGame", RequestStatus.Fulfilled);
    invoke(action);
    expect(dispatch).toBeCalledWith(
      actions.add({
        severity: Severity.Success,
        message: tk.feedback.deleteGame.fulfilled,
      })
    );
    expect(next).toBeCalledWith(action);
  });
  test("Dispatches feedback/add for deleteGame/rejected", () => {
    const {
      invoke,
      next,
      store: { dispatch },
    } = createMiddlewareAPI(middleware);
    const action = createThunkAction("deleteGame", RequestStatus.Rejected);
    invoke(action);
    expect(dispatch).toBeCalledWith(
      actions.add({
        severity: Severity.Error,
        message: tk.feedback.deleteGame.rejected,
      })
    );
    expect(next).toBeCalledWith(action);
  });
  test("Ignores other action", () => {
    ignoresOtherAction(middleware);
  });
});
