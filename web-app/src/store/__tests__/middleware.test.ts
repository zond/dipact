import { set, event } from "react-ga";
import {
  gaActions,
  mockFunction,
  PageName,
  createMiddlewareAPI,
  ignoresOtherAction,
  authActions,
} from "@diplicity/common";

import { storeInitAction } from "../actions";
import {
  authLoginMiddleware,
  authLogoutMiddleware,
  gaRegisterPageViewMiddleware,
  initMiddleware,
} from "../middleware";

jest.mock("react-ga", () => ({
  set: jest.fn(),
  event: jest.fn(),
}));

const mockSet = mockFunction(set);
const mockEvent = mockFunction(event);

jest.spyOn(window.localStorage.__proto__, "removeItem");
jest.spyOn(window.localStorage.__proto__, "getItem");
jest.spyOn(window.localStorage.__proto__, "setItem");
window.localStorage.__proto__.setItem = jest.fn();

describe("gaRegisterPageViewMiddleware", () => {
  const middleware = gaRegisterPageViewMiddleware;
  test("Calls ReactGA.set and ReactGA.event", () => {
    const { invoke, next } = createMiddlewareAPI(middleware);
    const pageName = PageName.CreateGame;
    const action = { type: gaActions.registerPageView.type, payload: pageName };
    invoke(action);
    expect(mockSet).toBeCalledWith({
      page_title: pageName,
      page_location: expect.any(String),
    });
    expect(mockEvent).toBeCalledWith({
      category: expect.any(String),
      action: expect.any(String),
    });
    expect(next).toBeCalledWith(action);
  });
  test("Ignores other action", () => {
    ignoresOtherAction(middleware);
  });
});

describe("authLoginMiddleware", () => {
  const middleware = authLoginMiddleware;
  test("Calls localStorage.setItem", () => {
    const { invoke, next } = createMiddlewareAPI(middleware);
    const token = "123";
    const action = { type: authActions.login.type, payload: token };
    invoke(action);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(window.localStorage.setItem).toHaveBeenCalledWith("token", token);
    expect(next).toBeCalledWith(action);
  });
  test("Ignores other action", () => {
    ignoresOtherAction(middleware);
  });
});

describe("authLogoutMiddleware", () => {
  const middleware = authLogoutMiddleware;
  test("Calls localStorage.removeItem", () => {
    const { invoke, next } = createMiddlewareAPI(middleware);
    const action = { type: authActions.logout.type };
    invoke(action);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(window.localStorage.removeItem).toHaveBeenCalledWith("token");
    expect(next).toBeCalledWith(action);
  });
  test("Ignores other action", () => {
    ignoresOtherAction(middleware);
  });
});

describe("initMiddleware", () => {
  const middleware = initMiddleware;
  test("Calls localStorage.getItem", () => {
    const { invoke, next } = createMiddlewareAPI(middleware);
    const action = { type: storeInitAction.type };
    invoke(action);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(window.localStorage.getItem).toHaveBeenCalledWith("token");
    expect(next).toBeCalledWith(action);
  });
  test("Ignores other action", () => {
    ignoresOtherAction(middleware);
  });
});
