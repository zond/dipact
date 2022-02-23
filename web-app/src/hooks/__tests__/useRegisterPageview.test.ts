import { renderHook } from "@testing-library/react-hooks";
import useRegisterPageView from "../useRegisterPageview";
import { mockFunction } from "@diplicity/common";
import { set, event } from "react-ga";

// Mock ReactGA
jest.mock("react-ga", () => ({
	set: jest.fn(),
	event: jest.fn(),
}));
const setMock = mockFunction(set);
const eventMock = mockFunction(event);

describe("useRegisterPageview", () => {
	it("Fires event", () => {
		const pageTitle = "TestPage";
		const pageLocation = "http://localhost/";
		renderHook(() => useRegisterPageView(pageTitle));
		expect(setMock).toBeCalledTimes(1);
		expect(setMock).toBeCalledWith({
			page_title: pageTitle,
			page_location: pageLocation,
		});
		expect(eventMock).toBeCalledTimes(1);
		expect(eventMock).toBeCalledWith({
			category: "(not set)",
			action: "page_view",
		});
	});
});
