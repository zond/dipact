import * as selectors from "../selectors";
import { RootState } from "../store";
import { initialState, privateStats } from "../testData";

describe("selectColorOverrides", () => {
	test("gets color overrides", () => {
		const state = { ...initialState };
		const result = selectors.selectColorOverrides(state);
		expect(result).toStrictEqual(state.colorOverrides);
	});
});

describe("selectHasPlayed", () => {
	test("has played false", () => {
		const state = { ...initialState };
		const result = selectors.selectHasPlayed(state);
		expect(result).toBe(false);
	});
	test("has played true", () => {
		const userStats = { JoinedGames: 1 };
		const state = { ...initialState, userStats };
		const result = selectors.selectHasPlayed(state);
		expect(result).toBe(true);
	});
	test("has played private", () => {
		const userStats = { PrivateStats: { ...privateStats, JoinedGames: 1 } };
		const state = { ...initialState, userStats };
		const result = selectors.selectHasPlayed(state);
		expect(result).toBe(true);
	});
});

describe("selectUser", () => {
	test("gets user", () => {
		const diplicityService = {
			...initialState.diplicityService,
			queries: {
				"getRoot(undefined)": {
					data: {
						Properties: {
							User: {
								Email: "fake-email@email.com",
							},
						},
					},
				},
			},
		};
		const user = { Email: "fake-email@email.com" };
		const state = { ...initialState, diplicityService };
		const result = selectors.selectUser(state as unknown as RootState);
		expect(result).toStrictEqual(user);
	});
});

// describe("selectUserConfig", () => {
// 	test("gets user config", () => {
// 		const userConfig = { UserId: "fake-user-id", loaded: true };
// 		const state = { ...initialState, diplicityService };
// 		const result = selectors.selectUserConfig(state);
// 		expect(result).toStrictEqual(userConfig);
// 	});
// });

describe("selectToken", () => {
	test("gets token", () => {
		const testToken = "test-token";
		const auth = { isLoggedIn: true, token: testToken };
		const state = { ...initialState, auth };
		const result = selectors.selectToken(state);
		expect(result).toStrictEqual(testToken);
	});
});

// describe("selectMessaging", () => {
// 	test("gets messaging", () => {
// 		const state = { ...initialState };
// 		const result = selectors.selectToken(state);
// 		expect(result).toStrictEqual(initialState.messaging);
// 	});
// });
