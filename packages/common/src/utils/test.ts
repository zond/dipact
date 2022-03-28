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

export const createTestMatcher =
  (endpointName: string, requestStatus: string) => (action: AnyAction) =>
    action.meta?.arg?.endpointName === endpointName &&
    action.meta?.requestStatus === requestStatus;

export const mockGetQueryMatchers = {
  matchCreateGameFulfilled: createTestMatcher("createGame", "fulfilled"),
  matchCreateGameRejected: createTestMatcher("createGame", "rejected"),
  matchJoinGameFulfilled: createTestMatcher("joinGame", "fulfilled"),
  matchJoinGameRejected: createTestMatcher("joinGame", "rejected"),
  matchRescheduleGameFulfilled: createTestMatcher(
    "rescheduleGame",
    "fulfilled"
  ),
  matchRescheduleGameRejected: createTestMatcher("rescheduleGame", "rejected"),
  matchInviteFulfilled: createTestMatcher("invite", "fulfilled"),
  matchInviteRejected: createTestMatcher("invite", "rejected"),
  matchUnInviteFulfilled: createTestMatcher("unInvite", "fulfilled"),
  matchUnInviteRejected: createTestMatcher("unInvite", "rejected"),
  matchRenameGameFulfilled: createTestMatcher("renameGame", "fulfilled"),
  matchRenameGameRejected: createTestMatcher("renameGame", "rejected"),
  matchDeleteGameFulfilled: createTestMatcher("deleteGame", "fulfilled"),
  matchDeleteGameRejected: createTestMatcher("deleteGame", "rejected"),
};
