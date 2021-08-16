import React from "react";
import ReactDOM from "react-dom";
import Enzyme from "enzyme";
import Settings from "../Settings";
import { Scenarios, createSettingsFormDI } from "../Settings.scenarios";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
import { MemoryRouter } from "react-router-dom";

Enzyme.configure({ adapter: new Adapter() });

interface WrappedSettingsProps {
	scenario: typeof Scenarios.Loaded;
}

const WrappedSettings = ({ scenario }: WrappedSettingsProps) => {
	const useDI = createSettingsFormDI(scenario);
	return (
		<MemoryRouter>
			<Settings useSettingsFormDI={useDI} />
		</MemoryRouter>
	);
};

describe("Snapshot tests", () => {
	let container: HTMLDivElement;
	beforeEach(() => {
		// setup a DOM element as a render target
		container = document.createElement("div");
		document.body.appendChild(container);
	});
	test("Not Loaded", () => {
		const rendered = ReactDOM.render(
			<WrappedSettings scenario={Scenarios.NotLoaded} />,
			container
		);
		expect(rendered).toMatchSnapshot();
	});
	test("IsLoading", () => {
		const rendered = ReactDOM.render(
			<WrappedSettings scenario={Scenarios.IsLoading} />,
			container
		);
		expect(rendered).toMatchSnapshot();
	});
	test("Loaded", () => {
		const rendered = ReactDOM.render(
			<WrappedSettings scenario={Scenarios.Loaded} />,
			container
		);
		expect(rendered).toMatchSnapshot();
	});
	test("TokenEnabled", () => {
		const rendered = ReactDOM.render(
			<WrappedSettings scenario={Scenarios.TokenEnabled} />,
			container
		);
		expect(rendered).toMatchSnapshot();
	});
	test("Unedited", () => {
		const rendered = ReactDOM.render(
			<WrappedSettings scenario={Scenarios.Unedited} />,
			container
		);
		expect(rendered).toMatchSnapshot();
	});
});

// describe("Settings", () => {
// 	test("Create component", () => {
// 		const div = document.createElement("div");
// 		ReactDOM.render(<WrappedSettings />, div);
// 	});

// 	test("Mount component", () => {
// 		mount(<WrappedSettings />);
// 	});

// 	test("Colors for classical variant are visible", () => {});

// 	test("Home button", () => {});

// 	test("Changing variant changes nations", () => {});

// 	test("Toggle push notifications disabled", () => {});

// 	test("Toggle push notifications", () => {});

// 	test("Toggle email notifications disabled", () => {});

// 	test("Toggle email notifications", () => {});

// 	test("Reset color", () => {});

// 	test("Color edited", () => {});

// 	test("Submit form", () => {});

// 	test("Success response closes dialog", () => {});

// 	test("Error response closes dialog", () => {});

// 	test("Success response shows message", () => {});

// 	test("Error response shows message", () => {});

// 	test("Save changes button disabled if no changes", () => {});

// 	test("Submit form push notifications enabled", () => {});

// 	test("Submit form email notifications enabled", () => {});

// 	test("Submit form colors changed", () => {});

// 	test("Reset settings opens dialog", () => {});

// 	test("Loading", () => {});
// });
