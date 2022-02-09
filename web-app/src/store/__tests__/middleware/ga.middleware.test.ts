import { set, event } from "react-ga";

import { gaRegisterPageViewMiddleware } from "../../middleware";
import { actions } from "../../ga";
import { createMiddlewareAPI, ignoresOtherAction } from "./utils";
import { PageName } from "../../ui";
import { mockFunction } from "../../../utils/test";

jest.mock("react-ga", () => ({
  set: jest.fn(),
  event: jest.fn(),
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
