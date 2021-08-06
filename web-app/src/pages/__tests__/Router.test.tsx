import React from "react";
import { Routes } from "../Router";

import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import "@testing-library/jest-dom/extend-expect";

enum MockStrings {
	About = "AboutPageMock",
	MainMenu = "MainMenuPageMock",
	Settings = "SettingsPageMock",
}

jest.mock("../../components/MainMenu", () => () => (
	<div>{MockStrings.MainMenu}</div>
));
jest.mock("../Settings", () => () => <div>{MockStrings.Settings}</div>);

jest.mock("../About", () => () => <div>{MockStrings.About}</div>);

const renderRoute = (route: string | null = null): void => {
	const initialEntries = route ? [route] : undefined;
	render(
		<MemoryRouter initialEntries={initialEntries}>
			<Routes urls={{}} />
		</MemoryRouter>
	);
};

describe("Router", () => {
	test("should render main menu on default route", () => {
		renderRoute();
		expect(screen.getByText(MockStrings.MainMenu)).toBeInTheDocument();
	});

	test("should render main menu on unknown route", () => {
		renderRoute("fake-route");
		expect(screen.getByText(MockStrings.MainMenu)).toBeInTheDocument();
	});

	test("should render settings on /settings", () => {
		renderRoute("/settings");
		expect(screen.getByText(MockStrings.Settings)).toBeInTheDocument();
	});

	test("should render about on /about", () => {
		renderRoute("/about");
		expect(screen.getByText(MockStrings.About)).toBeInTheDocument();
	});
});
