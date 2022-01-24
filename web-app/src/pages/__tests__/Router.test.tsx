import React from "react";
import { Routes } from "../Router";

import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import "@testing-library/jest-dom/extend-expect";

enum MockStrings {
  CreateGame = "CreateGamePageMock",
  Donate = "DonatePageMock",
  GameRouter = "GameRouterMock",
  GameList = "GameListMock",
  Settings = "SettingsMock",
}

jest.mock("../CreateGame", () => () => <div>{MockStrings.CreateGame}</div>);
jest.mock("../Donate", () => () => <div>{MockStrings.Donate}</div>);
jest.mock("../GameRouter", () => () => <div>{MockStrings.GameRouter}</div>);
jest.mock("../GameList", () => () => <div>{MockStrings.GameList}</div>);
jest.mock("../Settings", () => () => <div>{MockStrings.Settings}</div>);

const renderRoute = (route: string | null = null): void => {
  const initialEntries = route ? [route] : undefined;
  render(
    <MemoryRouter initialEntries={initialEntries}>
      <Routes />
    </MemoryRouter>
  );
};

describe("Router", () => {
  test("should render game list on default route", () => {
    renderRoute();
    expect(screen.getByText(MockStrings.GameList)).toBeInTheDocument();
  });

  test("should render game list on unknown route", () => {
    renderRoute("fake-route");
    expect(screen.getByText(MockStrings.GameList)).toBeInTheDocument();
  });

  test("should render game on /Game/:gameId", () => {
    renderRoute("/Game/abc123");
    expect(screen.getByText(MockStrings.GameRouter)).toBeInTheDocument();
  });

  test("should render game on /Game/:gameId/Channel/:channelId/Messages", () => {
    renderRoute("/Game/abc123/Channel/efg456/Messages");
    expect(screen.getByText(MockStrings.GameRouter)).toBeInTheDocument();
  });

  test("should render game case insensitive", () => {
    renderRoute("/game/abc123/channel/efg456/messages");
    expect(screen.getByText(MockStrings.GameRouter)).toBeInTheDocument();
  });
});
