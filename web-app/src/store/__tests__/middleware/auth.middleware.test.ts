import { authLogoutMiddleware } from "../../middleware";
import { actions } from "../../auth";
import { createMiddlewareAPI, createThunkAction, ignoresOtherAction, RequestStatus } from "./utils";

describe("authLogoutMiddleware", () => {
  const middleware = authLogoutMiddleware;
  test("Dispatches auth/logout if action is rejected", () => {
    const { invoke, next, store: { dispatch } } = createMiddlewareAPI(middleware);
    const action = createThunkAction("", RequestStatus.Rejected);
    action.payload.status = 401;
    invoke(action);
    expect(dispatch).toBeCalledWith(actions.logout())
    expect(next).toBeCalled();
  });
  test("Ignores other action", () => {
    ignoresOtherAction(middleware);
  });
});

