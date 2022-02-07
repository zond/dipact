import { Middleware, AnyAction } from "@reduxjs/toolkit";

export const otherActionType = "other/action";

/**
 * Test utility for invoking middleware in the same way that Redux does.
 *
 * @param {Middleware} middleware
 */
export const createMiddlewareAPI = (middleware: Middleware) => {
  const store = {
    getState: jest.fn(() => ({})),
    dispatch: jest.fn(),
  };
  const next = jest.fn();

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  const invoke = (action: AnyAction) => middleware(store)(next)(action);

  return { store, next, invoke };
};