import { createThunkAction, RequestStatus } from "@diplicity/common";
import { Middleware, AnyAction } from "redux";
import { push } from "connected-react-router";

import { redirectMiddleware } from "../middleware";
import { RouteConfig } from "../../pages/RouteConfig";

/**
 * Test utility for invoking middleware in the same way that Redux does.
 */
const createMiddlewareAPI = (middleware: Middleware) => {
  const store = {
    getState: jest.fn(() => ({})),
    dispatch: jest.fn(),
  };
  const next = jest.fn();

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  const invoke = (action: AnyAction) => middleware(store)(next)(action);

  return { store, next, invoke };
};

const testMiddleware = (
  middleware: Middleware,
  action: AnyAction,
  state?: any
) => {
  const { store, next, invoke } = createMiddlewareAPI(middleware);
  const { dispatch } = store;
  store.getState = jest.fn(() => ({ ...state }));
  invoke(action);
  return { dispatch, next };
};

describe("redirectMiddleware", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  test("other action does not redirect", () => {
    const action = { type: "other" };
    const { dispatch } = testMiddleware(redirectMiddleware, action);
    expect(dispatch).not.toBeCalled();
  });
  test("createGameFulfilled redirects to home", () => {
    const action = createThunkAction("createGame", RequestStatus.Fulfilled);
    const { dispatch } = testMiddleware(redirectMiddleware, action);
    expect(dispatch).toBeCalledWith(push(RouteConfig.Home));
  });
});
