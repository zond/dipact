import { Middleware, AnyAction } from "@reduxjs/toolkit";

export function mockFunction<T extends (...args: any[]) => any>(
	fn: T
): jest.MockedFunction<T> {
	return fn as jest.MockedFunction<T>;
}

export enum RequestStatus {
  Fulfilled = "fulfilled",
  Rejected = "rejected",
}

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

export const ignoresOtherAction = (middleware: Middleware) => {
  const { invoke, next, store } = createMiddlewareAPI(middleware);
  const { dispatch } = store;
  const action = { type: otherActionType };
  invoke(action);
  expect(dispatch).not.toBeCalled();
  expect(next).toBeCalledWith(action);
};

export const diplicityServiceExecuteQueryActionTypePrefix =
  "diplicityService/executeQuery/";

export const createThunkAction = (
  endpointName: string,
  requestStatus: RequestStatus
) => ({
  type: `${diplicityServiceExecuteQueryActionTypePrefix}${requestStatus}`,
  meta: { arg: { endpointName }, requestStatus, requestId: "" },
  payload: { status: 200 },
});