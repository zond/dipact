import fetchMock, { FetchMock } from "jest-fetch-mock";
import { diplicityService, diplicityServiceURL } from "../../service";
import { Headers } from "../../types";
import {
  createGameResponse,
  getGameResponse,
  listVariantsResponse,
  newGame,
  userConfig,
  userConfigResponse,
  variant,
} from "../../testData";
import authReducer from "../../auth";
import { setupApiStore } from "../../testUtils";
import { actions as authActions } from "../../auth";

beforeEach((): void => {
  fetchMock.resetMocks();
});

const testToken = "test-123";
const expectedHeadersUnauthorized = {
  [Headers.Accept]: "application/json",
  [Headers.XDiplicityAPILevel]: "8",
  [Headers.XDiplicityClientName]: "dipact@localhost",
  [Headers.Authorization]: null,
};

const expectedHeadersAuthorized = {
  ...expectedHeadersUnauthorized,
  [Headers.Authorization]: `Bearer ${testToken}`,
};

const validateHeaders = (
  headers: globalThis.Headers,
  expectedHeaders: { [key: string]: string | null }
) => {
  Object.entries(expectedHeaders).forEach(([key, value]) => {
    expect(headers.get(key)).toBe(value);
  });
};

const storeRef = setupApiStore(diplicityService, { auth: authReducer });
const getRequestFromMock = (mock: FetchMock): Request =>
  fetchMock.mock.calls[0][0] as Request;
let authorized = true;

beforeEach(() => {
  if (authorized) {
    storeRef.store.dispatch(authActions.login(testToken));
  }
});

const validateRequest = (
  fetchMock: FetchMock,
  expectedMethod: string,
  expectedUrl: string,
  options: { authorized: boolean } = { authorized: true }
) => {
  const { method, headers, url } = getRequestFromMock(fetchMock);
  expect(fetchMock).toBeCalledTimes(1);
  expect(method).toBe(expectedMethod);
  expect(url).toBe(`${diplicityServiceURL}${expectedUrl}`);
  if (options.authorized) {
    validateHeaders(headers, expectedHeadersAuthorized);
  } else {
    validateHeaders(headers, expectedHeadersUnauthorized);
  }
};

const setFetchMock = (response: any) => {
  fetchMock.mockResponse(JSON.stringify(response));
};

describe("getVariantSVG", () => {
  const endpoint = diplicityService.endpoints.getVariantSVG;

  test("Request is correct", async () => {
    const action = endpoint.initiate("Classical");
    await storeRef.store.dispatch<any>(action);
    validateRequest(fetchMock, "GET", `Variant/Classical/Map.svg`);
  });
});

describe("getVariantUnitSVG", () => {
  const endpoint = diplicityService.endpoints.getVariantUnitSVG;

  test("Request is correct", async () => {
    const action = endpoint.initiate({
      variantName: "Classical",
      unitType: "Army",
    });
    await storeRef.store.dispatch<any>(action);
    validateRequest(fetchMock, "GET", `Variant/Classical/Units/Army.svg`);
  });
});

describe("getUserConfig", () => {
  const userId = "user-id";
  const endpoint = diplicityService.endpoints.getUserConfig;

  beforeEach(() => {
    setFetchMock({ Properties: { Id: userId } });
  })

  test("Request is correct", async () => {
    const action = endpoint.initiate(userId);
    await storeRef.store.dispatch<any>(action);
    validateRequest(fetchMock, "GET", `User/${userId}/UserConfig`);
  });

  test("Transform response is correct", async () => {
    const action = endpoint.initiate(userId);
    const { data } = await storeRef.store.dispatch<any>(action);
    expect(data).toEqual({ Id: userId });
  });
});

describe("getUserStats", () => {
  const userId = "user-id";
  const endpoint = diplicityService.endpoints.getUserStats;

  beforeEach(() => {
    setFetchMock({ Properties: { Id: userId } });
  })

  test("Request is correct", async () => {
    const action = endpoint.initiate(userId);
    await storeRef.store.dispatch<any>(action);
    validateRequest(fetchMock, "GET", `User/${userId}/Stats`);
  });

  test("Transform response is correct", async () => {
    const action = endpoint.initiate(userId);
    const { data } = await storeRef.store.dispatch<any>(action);
    expect(data).toEqual({ Id: userId });
  });
});

describe("listUserBans", () => {
  const userId = "user-id";
  const endpoint = diplicityService.endpoints.listUserBans;

  beforeEach(() => {
    setFetchMock({ Properties: [{ Properties: { Id: userId } }] });
  })

  test("Request is correct", async () => {
    const action = endpoint.initiate(userId);
    await storeRef.store.dispatch<any>(action);
    validateRequest(fetchMock, "GET", `User/${userId}/Bans`);
  });

  test("Transform response is correct", async () => {
    const action = endpoint.initiate(userId);
    const { data } = await storeRef.store.dispatch<any>(action);
    expect(data).toEqual([{ Id: userId }]);
  });
});

describe("getUserRatingHistogram", () => {
  const endpoint = diplicityService.endpoints.getUserRatingHistogram;

  beforeEach(() => {
    setFetchMock({ Properties: { Id: 1 } });
  })

  test("Request is correct", async () => {
    const action = endpoint.initiate(undefined);
    await storeRef.store.dispatch<any>(action);
    validateRequest(fetchMock, "GET", `Users/Ratings/Histogram`);
  });

  test("Transform response is correct", async () => {
    const action = endpoint.initiate(undefined);
    const { data } = await storeRef.store.dispatch<any>(action);
    expect(data).toEqual({ Id: 1 });
  });
});

describe("ListVariants", () => {
  const storeRef = setupApiStore(diplicityService, { auth: authReducer });
  fetchMock.mockResponse(JSON.stringify({}));

  test("request is correct", () => {
    fetchMock.mockResponse(JSON.stringify(listVariantsResponse));
    return storeRef.store
      .dispatch<any>(
        diplicityService.endpoints.listVariants.initiate(undefined)
      )
      .then(() => {
        expect(fetchMock).toBeCalledTimes(1);
        const { method, headers, url } = fetchMock.mock.calls[0][0] as Request;

        validateHeaders(headers, expectedHeadersUnauthorized);
        expect(method).toBe("GET");
        expect(url).toBe(`${diplicityServiceURL}Variants`);
      });
  });
  test("successful response", () => {
    const storeRef = setupApiStore(diplicityService, { auth: authReducer });
    fetchMock.mockResponse(JSON.stringify(listVariantsResponse));

    return storeRef.store
      .dispatch<any>(
        diplicityService.endpoints.listVariants.initiate(undefined)
      )
      .then((action: any) => {
        const { status, data, isSuccess } = action;
        expect(status).toBe("fulfilled");
        expect(isSuccess).toBe(true);
        expect(data).toStrictEqual([variant]);
      });
  });
  test("unsuccessful response", () => {
    const storeRef = setupApiStore(diplicityService, { auth: authReducer });
    fetchMock.mockReject(new Error("Internal Server Error"));

    return storeRef.store
      .dispatch<any>(
        diplicityService.endpoints.listVariants.initiate(undefined)
      )
      .then((action: any) => {
        const { status, isError } = action;
        expect(status).toBe("rejected");
        expect(isError).toBe(true);
      });
  });
});

describe("GetGame", () => {
  const storeRef = setupApiStore(diplicityService, { auth: authReducer });

  test("request is correct", () => {
    fetchMock.mockResponse(JSON.stringify(getGameResponse));
    storeRef.store.dispatch(authActions.login(testToken));
    const gameId = "123";
    return storeRef.store
      .dispatch<any>(diplicityService.endpoints.getGame.initiate(gameId))
      .then(() => {
        expect(fetchMock).toBeCalledTimes(1);
        const request = fetchMock.mock.calls[0][0] as Request;
        const { method, headers, url } = request;

        validateHeaders(headers, expectedHeadersAuthorized);
        expect(method).toBe("GET");
        expect(url).toBe(`${diplicityServiceURL}Game/${gameId}`);
      });
  });
  test("successful response", () => {
    const storeRef = setupApiStore(diplicityService, { auth: authReducer });
    storeRef.store.dispatch(authActions.login(testToken));
    fetchMock.mockResponse(JSON.stringify(createGameResponse));

    return storeRef.store
      .dispatch<any>(diplicityService.endpoints.createGame.initiate(newGame))
      .then((action: any) => {
        const { data } = action;
        expect(data).toStrictEqual(createGameResponse);
      });
  });
  test("unsuccessful response", () => {
    const storeRef = setupApiStore(diplicityService, { auth: authReducer });
    fetchMock.mockReject(new Error("Internal Server Error"));

    return storeRef.store
      .dispatch<any>(
        diplicityService.endpoints.listVariants.initiate(undefined)
      )
      .then((action: any) => {
        const { status, isError } = action;
        expect(status).toBe("rejected");
        expect(isError).toBe(true);
      });
  });
});

describe("updateUserConfig", () => {
  test("request is correct", () => {
    const storeRef = setupApiStore(diplicityService, { auth: authReducer });
    storeRef.store.dispatch(authActions.login(testToken));
    fetchMock.mockResponse(JSON.stringify(userConfigResponse));
    return storeRef.store
      .dispatch<any>(
        diplicityService.endpoints.updateUserConfig.initiate(userConfig)
      )
      .then(() => {
        expect(fetchMock).toBeCalledTimes(1);
        const request = fetchMock.mock.calls[0][0] as Request;
        const { method, headers, url } = request;

        void request.json().then((data) => {
          expect(data).toStrictEqual(userConfig);
        });

        validateHeaders(headers, expectedHeadersAuthorized);
        expect(method).toBe("PUT");
        expect(url).toBe(
          `${diplicityServiceURL}User/${userConfig.UserId}/UserConfig`
        );
      });
  });
  test("successful response", () => {
    const storeRef = setupApiStore(diplicityService, { auth: authReducer });
    storeRef.store.dispatch(authActions.login(testToken));
    fetchMock.mockResponse(JSON.stringify(userConfigResponse));

    return storeRef.store
      .dispatch<any>(
        diplicityService.endpoints.updateUserConfig.initiate(userConfig)
      )
      .then((action: any) => {
        const { data } = action;
        expect(data).toStrictEqual(userConfigResponse);
      });
  });
  test("unsuccessful response", () => {
    const storeRef = setupApiStore(diplicityService, { auth: authReducer });
    fetchMock.mockReject(new Error("Internal Server Error"));

    return storeRef.store
      .dispatch<any>(
        diplicityService.endpoints.listVariants.initiate(undefined)
      )
      .then((action: any) => {
        const { status, isError } = action;
        expect(status).toBe("rejected");
        expect(isError).toBe(true);
      });
  });
});
