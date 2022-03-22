import { setupApiStore } from "../testUtils";
import authReducer, { actions as authActions } from "../auth";
import { diplicityService } from "../service";

const testToken = "test-token-123";

describe("Auth actions", () => {
  it("login", () => {
    const { store } = setupApiStore(diplicityService, { auth: authReducer });
    const stateBeforeAction = store.getState();
    store.dispatch(authActions.login(testToken));
    const stateAfterAction = store.getState();

    expect(stateBeforeAction.auth.token).toBe(undefined);
    expect(stateBeforeAction.auth.isLoggedIn).toBe(false);

    expect(stateAfterAction.auth.token).toBe(testToken);
    expect(stateAfterAction.auth.isLoggedIn).toBe(true);
  });
});
