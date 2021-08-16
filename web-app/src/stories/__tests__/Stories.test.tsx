import { composeStories } from "@storybook/testing-react";
import { render } from "@testing-library/react";
import React from "react";

import * as aboutStories from "../About.stories";
import * as settingsStories from "../Settings.stories";

describe("About", () => {
	it("should render all storybook stories without error", () => {
		const allStories = Object.values(composeStories(aboutStories));
		allStories.forEach((Story) => render(<Story />));
	});
});

describe("Settings", () => {
	it("should render all storybook stories without error", () => {
		const allStories = Object.values(composeStories(settingsStories));
		allStories.forEach((Story) => render(<Story />));
	});
});
