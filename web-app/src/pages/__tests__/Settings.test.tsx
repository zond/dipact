import React from "react";
import ReactDOM from "react-dom";
import Enzyme, { mount } from "enzyme";
import Settings from "../Settings";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "../../store";

Enzyme.configure({ adapter: new Adapter() });

const WrappedSettings = () => {
	return (
		<Provider store={store}>
			<MemoryRouter>
				<Settings />
			</MemoryRouter>
		</Provider>
	);
};

describe("Settings", () => {
	test("Create component", () => {
		const div = document.createElement("div");
		ReactDOM.render(<WrappedSettings />, div);
	});

	test("Mount component", () => {
		mount(<WrappedSettings />);
	});

	test("Colors for classical variant are visible", () => {});

	test("Home button", () => {});

	test("Changing variant changes nations", () => {});

	test("Toggle push notifications disabled", () => {});

	test("Toggle push notifications", () => {});

	test("Toggle email notifications disabled", () => {});

	test("Toggle email notifications", () => {});

	test("Reset color", () => {});

	test("Color edited", () => {});

	test("Submit form", () => {});

	test("Success response closes dialog", () => {});
	
	test("Error response closes dialog", () => {});

	test("Success response shows message", () => {});
	
	test("Error response shows message", () => {});

	test("Save changes button disabled if no changes", () => {});

	test("Submit form push notifications enabled", () => {});

	test("Submit form email notifications enabled", () => {});

	test("Submit form colors changed", () => {});

	test("Reset settings opens dialog", () => {});

	test("Loading", () => {});
});
