import Globals from "../../Globals";
import * as selectors from "../selectors";
import { RootState } from "../store";
import { initialState, privateStats } from "../testData";
import { Variant } from "../types";

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
    const result = selectors.selectUser((state as unknown) as RootState);
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

describe("selectVariant", () => {
  test("gets variant", () => {
    const diplicityService = {
      ...initialState.diplicityService,
      queries: {
        "listVariants(undefined)": {
          data: [
            {
              Name: "variant-name",
            },
            {
              Name: "other-variant-name",
            },
          ],
        },
      },
    };
    const state = { ...initialState, diplicityService };
    const result = selectors.selectVariant(
      (state as unknown) as RootState,
      "variant-name"
    );
    expect(result).not.toBeNull();
    expect(result).not.toBeUndefined();
    const variant = result as Variant;
    expect(variant.Name).toStrictEqual("variant-name");
  });
  test("missing variant", () => {
    const diplicityService = {
      ...initialState.diplicityService,
      queries: {
        "listVariants(undefined)": {
          data: [],
        },
      },
    };
    const state = { ...initialState, diplicityService };
    const result = selectors.selectVariant(
      (state as unknown) as RootState,
      "variant-name"
    );
    expect(result).toBeNull();
  });
});

const createListVariantsSlice = (data: any) => ({
  queries: {
    "listVariants(undefined)": {
      data,
    },
  },
});

describe("selectNationColor", () => {
  beforeEach(
    () =>
      (Globals.colorOverrides = {
        nationCodes: {},
        variantCodes: {},
        positions: [],
        variants: {},
        nations: {},
      })
  );
  test("gets color from variant", () => {
    const variantData = [
      {
        Name: "variant",
        NationColors: { france: "#FFFFFF" },
		Nations: [],
      },
    ];
    const diplicityService = {
      ...initialState.diplicityService,
      ...createListVariantsSlice(variantData),
    };
    const state = ({
      ...initialState,
      diplicityService,
    } as unknown) as RootState;
    const result = selectors.selectNationColor(state, "variant", "france");
    expect(result).toBe("#FFFFFF");
  });
  test("gets color from colorOverride", () => {
    const variantData = [
      {
        Name: "variant",
        NationColors: { france: "#FFFFFF" },
		Nations: [],
      },
    ];
    Globals.colorOverrides.variants = {
      variant: { france: "#000000" },
    };
    const diplicityService = {
      ...initialState.diplicityService,
      ...createListVariantsSlice(variantData),
    };
    const state = ({
      ...initialState,
      diplicityService,
    } as unknown) as RootState;
    const result = selectors.selectNationColor(state, "variant", "france");
    expect(result).toBe("#000000");
  });
  test("gets color for diplicity", () => {
    const diplicityService = {
      ...initialState.diplicityService,
      ...createListVariantsSlice([]),
    };
    const state = ({
      ...initialState,
      diplicityService,
    } as unknown) as RootState;
    const result = selectors.selectNationColor(state, "variant", "Diplicity");
    expect(result).toBe("#000000");
  });
  test("gets color for neutral", () => {
    const diplicityService = {
      ...initialState.diplicityService,
      ...createListVariantsSlice([]),
    };
    const state = ({
      ...initialState,
      diplicityService,
    } as unknown) as RootState;
    const result = selectors.selectNationColor(state, "variant", "Neutral");
    expect(result).toBe("#d0d0d0");
  });
});

describe("selectNationAbbreviation", () => {

  test("gets abbreviation from variant", () => {
    const variantData = [
      {
        Name: "variant",
        nationAbbreviations: { france: "fr" },
      },
    ];
    const diplicityService = {
      ...initialState.diplicityService,
      ...createListVariantsSlice(variantData),
    };
    const state = ({
      ...initialState,
      diplicityService,
    } as unknown) as RootState;
    const result = selectors.selectNationAbbreviation(state, "variant", "france");
    expect(result).toBe("fr");
  });
  test("missing abbreviation", () => {
    const variantData = [
      {
        Name: "variant",
        nationAbbreviations: {},
      },
    ];
    const diplicityService = {
      ...initialState.diplicityService,
      ...createListVariantsSlice(variantData),
    };
    const state = ({
      ...initialState,
      diplicityService,
    } as unknown) as RootState;
    const result = selectors.selectNationAbbreviation(state, "variant", "france");
    expect(result).toBe("");
  });
});

describe("selectNationFlagLink", () => {

  test("gets nation flag link from variant", () => {
    const variantData = [
      {
        Name: "variant",
		Links: [{ Rel: "flag-France", URL: "abc123" }]
      },
    ];
    const diplicityService = {
      ...initialState.diplicityService,
      ...createListVariantsSlice(variantData),
    };
    const state = ({
      ...initialState,
      diplicityService,
    } as unknown) as RootState;
    const result = selectors.selectNationFlagLink(state, "variant", "France");
    expect(result).toBe("abc123");
  });
  test("missing flag link", () => {
    const variantData = [
      {
        Name: "variant",
		Links: []
      },
    ];
    const diplicityService = {
      ...initialState.diplicityService,
      ...createListVariantsSlice(variantData),
    };
    const state = ({
      ...initialState,
      diplicityService,
    } as unknown) as RootState;
    const result = selectors.selectNationFlagLink(state, "variant", "france");
    expect(result).toBeUndefined();
  });
});