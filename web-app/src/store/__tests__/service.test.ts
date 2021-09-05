import fetchMock from "jest-fetch-mock";
import { diplicityService, diplicityServiceURL } from "../service";
import { Headers } from "../types";
import {
	createGameResponse,
	listVariantsResponse,
	newGame,
	userConfig,
	userConfigResponse,
	variant,
} from "../testData";
import authReducer from "../auth";
import { setupApiStore } from "../testUtils";
import { actions as authActions } from "../auth";

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

		server.use(handlers.variants.tokenTimeout);
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
	test("request is correct", () => {
		const storeRef = setupApiStore(diplicityService, { auth: authReducer });
		storeRef.store.dispatch(authActions.login(testToken));
		fetchMock.mockResponse(JSON.stringify(getGameResponse));
		const gameId = "123";
		return storeRef.store
			.dispatch<any>(diplicityService.endpoints.getGame.initiate(gameId))
			.then(() => {
				expect(fetchMock).toBeCalledTimes(1);
				const request = fetchMock.mock.calls[0][0] as Request;
				const { method, headers, url } = request;

				void request.json().then((data) => {
					expect(data).toStrictEqual(game);
				});

				validateHeaders(headers, expectedHeadersAuthorized);
				expect(method).toBe("GET");
				expect(url).toBe(`${diplicityServiceURL}Game`);
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
