import { set, event } from "react-ga";

import {
  gaRegisterEventMiddleware,
  gaRegisterPageViewMiddleware,
  gaRequestRegisterEventMiddleware,
} from "../../middleware";
import { actions } from "../../ga";
import {
  createMiddlewareAPI,
  mockGetQueryMatchers,
  createThunkAction,
  ignoresOtherAction,
  RequestStatus,
} from "./utils";
import { PageName } from "../../ui";
import { mockFunction } from "../../../utils/test";

jest.mock("react-ga", () => ({
  set: jest.fn(),
  event: jest.fn(),
}));

jest.mock("../../utils", () => ({
  getQueryMatchers: () => mockGetQueryMatchers,
}));

const mockSet = mockFunction(set);
const mockEvent = mockFunction(event);

describe("gaRegisterPageViewMiddleware", () => {
  const middleware = gaRegisterPageViewMiddleware;
  test("Calls ReactGA.set and ReactGA.event", () => {
    const { invoke, next } = createMiddlewareAPI(middleware);
    const pageName = PageName.CreateGame;
    const action = { type: actions.registerPageView.type, payload: pageName };
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

describe("gaRegisterEventMiddleware", () => {
  const middleware = gaRegisterEventMiddleware;
  test("Calls ReactGA.event", () => {
    const { invoke, next } = createMiddlewareAPI(middleware);
    const event = "create_game";
    const action = { type: actions.registerEvent.type, payload: event };
    invoke(action);
    expect(mockEvent).toBeCalledWith({
      category: expect.any(String),
      action: event,
    });
    expect(next).toBeCalledWith(action);
  });
  test("Ignores other action", () => {
    ignoresOtherAction(middleware);
  });
});

describe("gaRequestRegisterEventMiddleware", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  const middleware = gaRequestRegisterEventMiddleware;
  test("Dispatches ga/registerEvent for createGame/fulfilled", () => {
    const {
      invoke,
      next,
      store: { dispatch },
    } = createMiddlewareAPI(middleware);
    const action = createThunkAction("createGame", RequestStatus.Fulfilled);
    invoke(action);
    expect(dispatch).toBeCalledWith(actions.registerEvent("create_game"));
    expect(next).toBeCalledWith(action);
  });
  test("Ignores other action", () => {
    ignoresOtherAction(middleware);
  });
});
