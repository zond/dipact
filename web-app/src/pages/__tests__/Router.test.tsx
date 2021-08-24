import React from "react";
import { Routes } from "../Router";

import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import "@testing-library/jest-dom/extend-expect";

enum MockStrings {
	About = "AboutPageMock",
	MainMenu = "MainMenuPageMock",
	Game = "GamePageMock",
}

jest.mock("../../components/MainMenu", () => () => (
	<div>{MockStrings.MainMenu}</div>
));
jest.mock("../About", () => () => <div>{MockStrings.About}</div>);
jest.mock("../../components/Game", () => () => <div>{MockStrings.Game}</div>);

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

	test("should render about on /about", () => {
		renderRoute("/about");
		expect(screen.getByText(MockStrings.About)).toBeInTheDocument();
	});

	test("should render game on /Game/:gameId", () => {
		renderRoute("/Game/abc123");
		expect(screen.getByText(MockStrings.Game)).toBeInTheDocument();
	});

	test("should render game on /Game/:gameId/Channel/:channelId/Messages", () => {
		renderRoute("/Game/abc123/Channel/efg456/Messages");
		expect(screen.getByText(MockStrings.Game)).toBeInTheDocument();
	});

	test("should render game case insensitive", () => {
		renderRoute("/game/abc123/channel/efg456/messages");
		expect(screen.getByText(MockStrings.Game)).toBeInTheDocument();
	});
});