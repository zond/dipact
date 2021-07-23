import React from "react";
import { renderHook } from "@testing-library/react-hooks";
import { useGetRootQuery, useGetVariantsQuery } from "../service";
import { Provider } from "react-redux";
import { store } from "../store";

const wrapper: React.FC = ({ children }) => {
	return <Provider store={store}>{children}</Provider>;
};

const updateTimeout = 5000;

describe("Variant", () => {
	it("Fetch data from Variants endpoint", async () => {
		const { result, waitForNextUpdate } = renderHook(
			() => useGetVariantsQuery(undefined),
			{ wrapper }
		);
		let response = result.current;
		expect(response.data).toBeUndefined();
		expect(response.isLoading).toBe(true);
		await waitForNextUpdate({ timeout: updateTimeout });

		response = result.current;
		expect(response.data).not.toBeUndefined();
		expect(response.isLoading).toBe(false);
		expect(response.isSuccess).toBe(true);
	});
});

describe("Root", () => {
	it("Fetch data from Root endpoint", async () => {
		const { result, waitForNextUpdate } = renderHook(
			() => useGetRootQuery(undefined),
			{ wrapper }
		);
		let response = result.current;
		expect(response.data).toBeUndefined();
		expect(response.isLoading).toBe(true);
		await waitForNextUpdate({ timeout: updateTimeout });

		response = result.current;
		expect(response.data).not.toBeUndefined();
		expect(response.isLoading).toBe(false);
		expect(response.isSuccess).toBe(true);
	});
});
