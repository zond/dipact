import {
  uiPageLoadMiddleware,
  uiSubmitSettingsFormMiddleware,
} from "../../middleware";
import { actions, PageName } from "../../ui";
import { actions as gaActions } from "../../ga";
import { createMiddlewareAPI, ignoresOtherAction } from "./utils";

const userConfig = {};

jest.mock("../../selectors", () => ({
  selectUserConfig: () => userConfig,
}));

describe("uiPageloadMiddleware", () => {
  const middleware = uiPageLoadMiddleware;
  test("Calls ga/registerPageView", () => {
    const { invoke, next, store } = createMiddlewareAPI(middleware);
    const { dispatch } = store;
    const page = PageName.CreateGame;
    const action = { type: actions.pageLoad.type, payload: page };
    invoke(action);
    expect(dispatch).toBeCalledWith(gaActions.registerPageView(page));
    expect(next).toBeCalledWith(action);
  });
  test("Ignores other action", () => {
    ignoresOtherAction(middleware);
  });
});

describe("uiSubmitSettingsFormMiddleware", () => {
  const middleware = uiSubmitSettingsFormMiddleware;
  test("Calls diplicityService/updateUserConfig", () => {
    const { invoke, next, store } = createMiddlewareAPI(middleware);
    const { dispatch } = store;
    const action = { type: actions.submitSettingsForm.type };
    invoke(action);
    expect(dispatch).toBeCalledWith(expect.any(Function));
    expect(next).toBeCalledWith(action);
  });
  test("Ignores other action", () => {
    ignoresOtherAction(middleware);
  });
});
