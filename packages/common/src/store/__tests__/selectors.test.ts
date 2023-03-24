import Globals from "../../Globals";
import * as selectors from "../selectors";
import * as mapUtils from "../../utils/map";
import { diplicityService } from "../service";
import { RootState } from "../store";
import { initialState } from "../testData";
import { Variant } from "../types";

const createListVariantsSlice = (data: any) => ({
  queries: {
    "listVariants(undefined)": {
      data,
    },
  },
});

const createGetRootSlice = (data: any) => ({
  queries: {
    "getRoot(undefined)": {
      data,
    },
  },
});

describe("selectUser", () => {
  test("gets user", () => {
    const user = {
      Email: "fake-email@email.com",
    };
    const diplicityService = {
      ...initialState.diplicityService,
      ...createGetRootSlice(user),
    };
    const state = { ...initialState, diplicityService };
    const result = selectors.selectUser(state as unknown as RootState);
    expect(result).toEqual(user);
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
    const variants = [
      {
        Name: "variant-name",
      },
      {
        Name: "other-variant-name",
      },
    ];
    const diplicityService = {
      ...initialState.diplicityService,
      ...createListVariantsSlice(variants),
    };
    const state = { ...initialState, diplicityService };
    const result = selectors.selectVariant(
      state as unknown as RootState,
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
      ...createListVariantsSlice([]),
    };
    const state = { ...initialState, diplicityService };
    const result = selectors.selectVariant(
      state as unknown as RootState,
      "variant-name"
    );
    expect(result).toBeUndefined();
  });
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
    const state = {
      ...initialState,
      diplicityService,
    } as unknown as RootState;
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
    const state = {
      ...initialState,
      diplicityService,
    } as unknown as RootState;
    const result = selectors.selectNationColor(state, "variant", "france");
    expect(result).toBe("#000000");
  });
  test("gets color for diplicity", () => {
    const variantData = [
      {
        Name: "variant",
        Nations: [],
      },
    ];
    const diplicityService = {
      ...initialState.diplicityService,
      ...createListVariantsSlice(variantData),
    };
    const state = {
      ...initialState,
      diplicityService,
    } as unknown as RootState;
    const result = selectors.selectNationColor(state, "variant", "Diplicity");
    expect(result).toBe("#000000");
  });
  test("gets color for neutral", () => {
    const variantData = [
      {
        Name: "variant",
        Nations: [],
      },
    ];
    const diplicityService = {
      ...initialState.diplicityService,
      ...createListVariantsSlice(variantData),
    };
    const state = {
      ...initialState,
      diplicityService,
    } as unknown as RootState;
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
    const state = {
      ...initialState,
      diplicityService,
    } as unknown as RootState;
    const result = selectors.selectNationAbbreviation(
      state,
      "variant",
      "france"
    );
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
    const state = {
      ...initialState,
      diplicityService,
    } as unknown as RootState;
    const result = selectors.selectNationAbbreviation(
      state,
      "variant",
      "france"
    );
    expect(result).toBe("");
  });
});

describe("selectNationFlagLink", () => {
  test("gets nation flag link from variant", () => {
    const variantData = [
      {
        Name: "variant",
        Links: [{ Rel: "flag-France", URL: "abc123" }],
      },
    ];
    const diplicityService = {
      ...initialState.diplicityService,
      ...createListVariantsSlice(variantData),
    };
    const state = {
      ...initialState,
      diplicityService,
    } as unknown as RootState;
    const result = selectors.selectNationFlagLink(state, "variant", "France");
    expect(result).toBe("abc123");
  });
  test("missing flag link", () => {
    const variantData = [
      {
        Name: "variant",
        Links: [],
      },
    ];
    const diplicityService = {
      ...initialState.diplicityService,
      ...createListVariantsSlice(variantData),
    };
    const state = {
      ...initialState,
      diplicityService,
    } as unknown as RootState;
    const result = selectors.selectNationFlagLink(state, "variant", "france");
    expect(result).toBeUndefined();
  });
});

describe("selectOrdersView", () => {});

interface TestQuery {
  [key: string]: {
    status: string;
    endpointName: string;
    requestId: string;
    data: any;
  };
}

export const createQuery = (
  endpointName: string,
  args: string | { [key: string]: string | number } | undefined,
  status: string,
  data?: any
): TestQuery => {
  const requestId = `${endpointName}-${args}`;
  const key = JSON.stringify(args);
  const query: TestQuery = {
    [`${endpointName}(${key})`]: {
      status: status,
      endpointName,
      requestId: requestId,
      data: data || undefined,
    },
  };
  return query;
};

const createDiplicityServiceState = (...queryArray: TestQuery[]) => {
  const queries = queryArray.reduce((acc, query) => {
    return { ...acc, ...query };
  }, {});
  return {
    queries,
    config: {
      online: true,
      focused: true,
      middlewareRegistered: true,
      refetchOnFocus: false,
      refetchOnReconnect: false,
      refetchOnMountOrArgChange: false,
      keepUnusedDataFor: 60,
      reducerPath: "diplicityService",
    },
  };
};

const gameId = "game-id";

describe("getGame selector", () => {
  const sut = diplicityService.endpoints.getGame.select(gameId);
  test("Gets game", () => {
    const getGameQuery = createQuery("getGame", gameId, "fulfilled");
    const state = {
      diplicityService: createDiplicityServiceState(getGameQuery),
    } as RootState;
    const result = sut(state);
    expect(result).toEqual({
      data: undefined,
      endpointName: "getGame",
      isError: false,
      isLoading: false,
      isSuccess: true,
      isUninitialized: false,
      requestId: `getGame-${gameId}`,
      status: "fulfilled",
    });
  });
});

const dummySvg = "<svg></svg>";

const createGetGameQuery = (
  gameId: string,
  data?: any,
  status = "fulfilled"
) => {
  return createQuery("getGame", gameId, status, data);
};

const createGetVariantSvgQuery = (
  variantName: string,
  data = dummySvg,
  status = "fulfilled"
) => {
  return createQuery("getVariantSVG", variantName, status, data);
};

const createGetVariantArmySvgQuery = (
  variantName: string,
  data = dummySvg,
  status = "fulfilled"
) => {
  return createQuery(
    "getVariantUnitSVG",
    { unitType: "Army", variantName },
    status,
    data
  );
};

const createGetVariantFleetSvgQuery = (
  variantName: string,
  data = dummySvg,
  status = "fulfilled"
) => {
  return createQuery(
    "getVariantUnitSVG",
    { unitType: "Fleet", variantName },
    status,
    data
  );
};

const createListPhasesQuery = (
  gameId: string,
  data?: any,
  status = "fulfilled"
) => {
  return createQuery("listPhases", gameId, status, data);
};

const createListVariantsQuery = (data?: any, status = "fulfilled") => {
  return createQuery("listVariants", undefined, status, data);
};

const updateMapSpy = jest.spyOn(mapUtils, "updateMap");

describe("selectMapView", () => {
  const sut = selectors.selectMapView;
  const variantName = "Classical";
  const phaseId = 1;

  const getGameQuery = createGetGameQuery(gameId, { Variant: variantName });
  const getVariantSvgQuery = createGetVariantSvgQuery(variantName);
  const getVariantArmySvgQuery = createGetVariantArmySvgQuery(variantName);
  const getVariantFleetSvgQuery = createGetVariantFleetSvgQuery(variantName);
  const listPhasesQuery = createListPhasesQuery(gameId, [
    { PhaseOrdinal: phaseId, Units: [], SCs: [] },
  ]);
  const listVariantsQuery = createListVariantsQuery([{ Name: variantName }]);

  const defaultDiplicityServiceState = createDiplicityServiceState(
    listPhasesQuery,
    listVariantsQuery,
    getGameQuery,
    getVariantArmySvgQuery,
    getVariantFleetSvgQuery,
    getVariantSvgQuery
  );

  const defaultState = {
    diplicityService: defaultDiplicityServiceState,
    game: {
      gameId,
    },
    phase: phaseId,
  } as RootState;

  test("Returns data from updateMap if ready", () => {
    updateMapSpy.mockReturnValue("updated-svg");
    const state = { ...defaultState };
    const result = sut(state);
    expect(result).toEqual({
      isLoading: false,
      isError: false,
      data: "updated-svg",
    });
  });

  test("If game not in store data is undefined", () => {
    const diplicityServiceState = { ...defaultDiplicityServiceState };
    diplicityServiceState.queries['getGame("game-id")'] = {
      status: "pending",
      endpointName: "getGame",
      requestId: "getGame-game-id",
      data: undefined,
    };
    const state = {
      ...defaultState,
      diplicityService: diplicityServiceState,
    } as RootState;
    const result = sut(state);
    expect(result).toEqual({
      isLoading: true,
      isError: false,
      data: undefined,
    });
  });
});
