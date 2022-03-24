import { feedbackRequestMiddleware } from "../../middleware";
import { actions } from "../../feedback";
import {
  createMiddlewareAPI,
  mockGetQueryMatchers,
  createThunkAction,
  ignoresOtherAction,
  RequestStatus,
} from "../../../utils/test";
import { Severity } from "../../types";
import tk from "../../../translations/translateKeys";

jest.mock("../../utils", () => ({
  getQueryMatchers: () => mockGetQueryMatchers,
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
      actions.add({
        severity: Severity.Success,
        message: tk.feedback.invite.fulfilled,
      })
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