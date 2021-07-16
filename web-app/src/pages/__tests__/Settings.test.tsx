import React from "react";
import ReactDOM from "react-dom";
import Enzyme, { mount } from "enzyme";
import Settings from "../Settings";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";

Enzyme.configure({ adapter: new Adapter() });

describe("Settings", () => {
	test("Create component", () => {
		const div = document.createElement("div");
		ReactDOM.render(<Settings />, div);
	});

	test("Mount component", () => {
		mount(<Settings />);
	});
});