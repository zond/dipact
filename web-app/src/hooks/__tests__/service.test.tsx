import React from "react";
import { act, renderHook } from "@testing-library/react-hooks";
import {
	useCreateGameMutation,
	useGetRootQuery,
	useListVariantsQuery,
	useUpdateUserConfigMutation,
} from "../service";
import { Provider } from "react-redux";
import { setupServer } from "msw/node";
import { handlers } from "../../mockService/handlers";
import { setupApiStore } from "../../store/testUtils";
import { diplicityService } from "../../store/service";
import { newGame, userConfig } from "../../store/testData";
import authReducer from "../../store/auth";

const server = setupServer();

const updateTimeout = 5000;

beforeAll((): void => {
	server.listen();
});

beforeEach((): void => {
	fetchMock.resetMocks();
	fetchMock.dontMock();
});

afterEach((): void => {
	server.resetHandlers();
});

afterAll((): void => {
	server.close();
});

const wrapper: React.FC = ({ children }) => {
	const storeRef = setupApiStore(diplicityService, { auth: authReducer });
	return <Provider store={storeRef.store}>{children}</Provider>;
};

describe("useListVariantsQuery", () => {
	it("Success", async () => {
		server.use(handlers.variants.success);
		const { result, waitForNextUpdate } = renderHook(
			() => useListVariantsQuery(undefined),
			{ wrapper }
		);
		const initialResponse = result.current;
		expect(initialResponse.data).toBeUndefined();
		expect(initialResponse.isLoading).toBe(true);
		await waitForNextUpdate({ timeout: updateTimeout });

		const nextResponse = result.current;
		expect(nextResponse.data).not.toBeUndefined();
		expect(nextResponse.isLoading).toBe(false);
		expect(nextResponse.isSuccess).toBe(true);
	});

	it("Internal Server Error", async () => {
		server.use(handlers.variants.internalServerError);
		const { result, waitForNextUpdate } = renderHook(
			() => useListVariantsQuery(undefined),
			{ wrapper }
		);
		const initialResponse = result.current;
		expect(initialResponse.data).toBeUndefined();
		expect(initialResponse.isLoading).toBe(true);

		await waitForNextUpdate({ timeout: updateTimeout });

		const nextResponse = result.current;
		expect(nextResponse.data).toBeUndefined();
		expect(nextResponse.isLoading).toBe(false);
		expect(nextResponse.isError).toBe(true);
	});

	it("Token timeout", async () => {
		server.use(handlers.variants.tokenTimeout);
		const { result, waitForNextUpdate } = renderHook(
			() => useListVariantsQuery(undefined),
			{ wrapper }
		);
		const initialResponse = result.current;
		expect(initialResponse.data).toBeUndefined();
		expect(initialResponse.isLoading).toBe(true);

		await waitForNextUpdate({ timeout: updateTimeout });

		const nextResponse = result.current;
		expect(nextResponse.data).toBeUndefined();
		expect(nextResponse.isLoading).toBe(false);
		expect(nextResponse.isError).toBe(true);
	});
});

describe("useCreateGameMutation", () => {
	it("Success", async () => {
		server.use(handlers.createGame.success);
		const { result, waitForNextUpdate } = renderHook(
			() => useCreateGameMutation(undefined),
			{
				wrapper,
			}
		);
		const [createGame, initialResponse] = result.current;
		expect(initialResponse.data).toBeUndefined();
		expect(initialResponse.isLoading).toBe(false);

		act(() => {
			void createGame(newGame);
		});

		const loadingResponse = result.current[1];
		expect(loadingResponse.data).toBeUndefined();
		expect(loadingResponse.isLoading).toBe(true);

		await waitForNextUpdate({ timeout: updateTimeout });

		const loadedResponse = result.current[1];
		expect(loadedResponse.data).not.toBeUndefined();
		expect(loadedResponse.isLoading).toBe(false);
		expect(loadedResponse.isSuccess).toBe(true);
	});

	it("Internal Server Error", async () => {
		server.use(handlers.createGame.internalServerError);
		const { result, waitForNextUpdate } = renderHook(
			() => useCreateGameMutation(undefined),
			{
				wrapper,
			}
		);
		const [createGame, initialResponse] = result.current;
		expect(initialResponse.data).toBeUndefined();
		expect(initialResponse.isLoading).toBe(false);

		act(() => {
			void createGame(newGame);
		});

		const loadingResponse = result.current[1];
		expect(loadingResponse.data).toBeUndefined();
		expect(loadingResponse.isLoading).toBe(true);

		await waitForNextUpdate({ timeout: updateTimeout });

		const loadedResponse = result.current[1];
		expect(loadedResponse.data).toBeUndefined();
		expect(loadedResponse.isLoading).toBe(false);
		expect(loadedResponse.isError).toBe(true);
	});

	it("Token timeout", async () => {
		server.use(handlers.createGame.tokenTimeout);
		const { result, waitForNextUpdate } = renderHook(
			() => useCreateGameMutation(undefined),
			{
				wrapper,
			}
		);
		const [createGame, initialResponse] = result.current;
		expect(initialResponse.data).toBeUndefined();
		expect(initialResponse.isLoading).toBe(false);

		act(() => {
			void createGame(newGame);
		});

		const loadingResponse = result.current[1];
		expect(loadingResponse.data).toBeUndefined();
		expect(loadingResponse.isLoading).toBe(true);

		await waitForNextUpdate({ timeout: updateTimeout });

		const loadedResponse = result.current[1];
		expect(loadedResponse.data).toBeUndefined();
		expect(loadedResponse.isLoading).toBe(false);
		expect(loadedResponse.isError).toBe(true);
	});
});

describe("useUpdateUserConfigMutation", () => {
	it("Success", async () => {
		server.use(handlers.updateUserConfig.success);
		const { result, waitForNextUpdate } = renderHook(
			() => useUpdateUserConfigMutation(undefined),
			{ wrapper }
		);
		const [updateUserConfig, initialResponse] = result.current;
		expect(initialResponse.data).toBeUndefined();
		expect(initialResponse.isLoading).toBe(false);

		act(() => {
			void updateUserConfig(userConfig);
		});

		const loadingResponse = result.current[1];
		expect(loadingResponse.data).toBeUndefined();
		expect(loadingResponse.isLoading).toBe(true);

		await waitForNextUpdate({ timeout: updateTimeout });

		const loadedResponse = result.current[1];
		// This endpoint returns an empty response
		expect(loadedResponse.data).not.toBeUndefined();
		expect(loadedResponse.isLoading).toBe(false);
		expect(loadedResponse.isSuccess).toBe(true);
	});

	it("Internal Server Error", async () => {
		server.use(handlers.updateUserConfig.internalServerError);
		const { result, waitForNextUpdate } = renderHook(
			() => useUpdateUserConfigMutation(undefined),
			{ wrapper }
		);
		const [updateUserConfig, initialResponse] = result.current;
		expect(initialResponse.data).toBeUndefined();
		expect(initialResponse.isLoading).toBe(false);

		act(() => {
			void updateUserConfig(userConfig);
		});

		const loadingResponse = result.current[1];
		expect(loadingResponse.data).toBeUndefined();
		expect(loadingResponse.isLoading).toBe(true);

		await waitForNextUpdate({ timeout: updateTimeout });

		const loadedResponse = result.current[1];
		expect(loadedResponse.data).toBeUndefined();
		expect(loadedResponse.isLoading).toBe(false);
		expect(loadedResponse.isError).toBe(true);
	});
});

// describe("Root", () => {
// 	it("Fetch data from Root endpoint", async () => {
// 		const { result, waitForNextUpdate } = renderHook(
// 			() => useGetRootQuery(undefined),
// 			{ wrapper }
// 		);
// 		let response = result.current;
// 		expect(response.data).toBeUndefined();
// 		expect(response.isLoading).toBe(true);
// 		await waitForNextUpdate({ timeout: updateTimeout });

// 		expect(response.data).not.toBeUndefined();
// 		expect(response.isLoading).toBe(false);
// 		expect(response.isSuccess).toBe(true);
// 	});
// });
