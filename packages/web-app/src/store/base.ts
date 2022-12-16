import { Action, AnyAction, MiddlewareAPI, Middleware } from "@reduxjs/toolkit";

interface CreateMiddlewareOptions<T extends Action = AnyAction> {
  afterAction: (action: T, middlewareApi: MiddlewareAPI) => void;
  beforeAction: (action: T, middlewareApi: MiddlewareAPI) => void;
  match: ((action: T) => boolean) | string;
}

/**
 * Utility to standardize the creation of Redux Middleware.
 *
 * @return {*}  {Middleware}
 */
export const createMiddleware = <T extends Action<string> = AnyAction>({
  afterAction,
  beforeAction,
  match,
}: Partial<CreateMiddlewareOptions<T>> &
  Pick<CreateMiddlewareOptions<T>, "match">): Middleware => {
  const isMatch = (action: T) =>
    typeof match === "function" ? match(action) : action.type === match;
  const middleware: Middleware = (middlewareApi) => (next) => (action: T) => {
    if (isMatch(action)) {
      beforeAction && beforeAction(action, middlewareApi);
    }
    next(action);
    if (isMatch(action)) {
      afterAction && afterAction(action, middlewareApi);
    }
  };
  return middleware;
};
