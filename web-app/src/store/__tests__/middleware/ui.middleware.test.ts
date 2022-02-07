import middleware, { uiPageLoadMiddleware } from "../../middleware";
import { actions } from "../../ui";

describe(("uiPageloadMiddleware") => {
    const middleware = uiPageLoadMiddleware;
    test(() => {
           const { invoke, next, store } = createMiddlewareAPI(middleware);
    const { dispatch } = store;
    const action = { type: actions.pageLoad.type };
    invoke(action);
    expect(dispatch).toBeCalledWith(hostActions.startClient(initialAppConfig));
    expect(next).toBeCalledWith(action); 
    })
})