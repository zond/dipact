import React from "react";
import ReactDOM from "react-dom";
import { mount } from "enzyme";
import IroColorPicker from "../IroColorPicker";

describe("IroColorPicker", () => {
	test("Create component", () => {
		const div = document.createElement("div");
		ReactDOM.render(<IroColorPicker />, div);
	});

	test("Mount component", () => {
		mount(<IroColorPicker />);
	});
});
