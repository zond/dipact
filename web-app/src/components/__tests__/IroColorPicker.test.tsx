import React from "react";
import ReactDOM from "react-dom";
import Enzyme, { mount } from "enzyme";
import IroColorPicker from "../IroColorPicker";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";

Enzyme.configure({ adapter: new Adapter() });

describe("IroColorPicker", () => {
	test("Create component", () => {
		const div = document.createElement("div");
		ReactDOM.render(<IroColorPicker />, div);
	});

	test("Mount component", () => {
		mount(<IroColorPicker />);
	});
});
