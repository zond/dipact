import {
  authActions,
  createThunkAction,
  RequestStatus,
} from "@diplicity/common";
import { Middleware, AnyAction } from "redux";
import { push } from "connected-react-router";

import {
  loginFromLocalStorageMiddleware,
  redirectMiddleware,
} from "../middleware";
import { RouteConfig } from "../../pages/RouteConfig";
import actions from "../actions";

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

describe("loginFromLocalStorageMiddleware", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  test("other action does not call login", () => {
    const action = { type: "other" };
    const { dispatch } = testMiddleware(
      loginFromLocalStorageMiddleware,
      action
    );
    expect(dispatch).not.toBeCalled();
  });
  test("initialize action dispatches login if token in localStorage", () => {
    Storage.prototype.getItem = jest.fn(() => "token");
    const action = actions.initialize();
    const { dispatch } = testMiddleware(
      loginFromLocalStorageMiddleware,
      action
    );
    expect(dispatch).toBeCalledWith(authActions.login("token"));
  });
  test("initialize action does not dispatch login if no token in localStorage", () => {
    Storage.prototype.getItem = jest.fn(() => null);
    const action = actions.initialize();
    const { dispatch } = testMiddleware(
      loginFromLocalStorageMiddleware,
      action
    );
    expect(dispatch).not.toBeCalled();
  });
  test("initialize action does not dispatch login if token is null string", () => {
    Storage.prototype.getItem = jest.fn(() => "null");
    const action = actions.initialize();
    const { dispatch } = testMiddleware(
      loginFromLocalStorageMiddleware,
      action
    );
    expect(dispatch).not.toBeCalled();
  });
});

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
