import React from "react";
import ReactDOM from "react-dom";
import Enzyme, { mount } from "enzyme";
import About from "../About";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";

Enzyme.configure({ adapter: new Adapter() });

describe("About", () => {
	test("Create component", () => {
		const div = document.createElement("div");
		ReactDOM.render(<About />, div);
	});

	test("Mount component", () => {
		mount(<About />);
	});
});

describe("Snapshot tests", () => {
	let container: HTMLDivElement;
	beforeEach(() => {
		// setup a DOM element as a render target
		container = document.createElement("div");
		document.body.appendChild(container);
	});
	test("Default", () => {
		const rendered = ReactDOM.render(<About />, container)
		expect(rendered).toMatchSnapshot();
	});
});