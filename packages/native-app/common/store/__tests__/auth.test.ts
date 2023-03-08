import authReducer, { actions as authActions } from "../auth";
import { Auth } from "../types";

const testToken = "test-token-123";
const initialState: Auth = { isLoggedIn: false };

describe("Auth actions", () => {
  test("login", () => {
    const state = { ...initialState }
    const updatedState = authReducer(state, authActions.login(testToken));
    expect(updatedState.token).toBe(testToken);
    expect(updatedState.isLoggedIn).toBe(true);
  });
  test("logout", () => {
    const state = { ...initialState, isLoggedIn: true, token: testToken }
    const updatedState = authReducer(state, authActions.logout());
    expect(updatedState.token).toBeUndefined();
    expect(updatedState.isLoggedIn).toBe(false);
  });
});
