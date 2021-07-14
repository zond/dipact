import { composeStories } from "@storybook/testing-react";
import { render } from "@testing-library/react";
import React from "react";

import * as aboutStories from "../About.stories";
import * as IroColorPickerStories from "../IroColorPicker.stories";
import * as ColorStories from "../Color.stories";

describe("About", () => {
	it("should render all storybook stories without error", () => {
		const allStories = Object.values(composeStories(aboutStories));
		allStories.forEach((Story) => render(<Story />));
	});
});

describe("IroColorPicker", () => {
	it("should render all storybook stories without error", () => {
		const allStories = Object.values(composeStories(IroColorPickerStories));
		allStories.forEach((Story) => render(<Story />));
	});
});

describe("Color", () => {
	it("should render all storybook stories without error", () => {
		const allStories = Object.values(composeStories(ColorStories));
		allStories.forEach((Story) => render(<Story />));
	});
});
