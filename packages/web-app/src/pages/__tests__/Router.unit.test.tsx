import React from "react";

import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ConnectedRouter } from "connected-react-router";
import "@testing-library/jest-dom/extend-expect";
import Router from "../Router";
import AuthWrapper from "../../components/AuthWrapper";

enum MockStrings {
  LegacyApp = "LegacyApp",
  CreateGame = "CreateGame",
}

jest.mock("connected-react-router", () => ({
  ...jest.requireActual("connected-react-router"),
  ConnectedRouter: jest.fn(),
}));
jest.mock("../../components/AuthWrapper", () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock("../../App", () => ({
  LegacyApp: () => <div>{MockStrings.LegacyApp}</div>,
}));
jest.mock("../CreateGame", () => () => <div>{MockStrings.CreateGame}</div>);

const renderRoute = (route: string): void => {
  (AuthWrapper as jest.Mock).mockImplementation(({ children }) => (
    <div>{children}</div>
  ));
  (ConnectedRouter as jest.Mock).mockImplementation(({ children }) => (
    <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
  ));
  render(<Router />);
};

describe("Router", () => {
  test.each`
    path                    | expected
    ${""}                   | ${MockStrings.LegacyApp}
    ${"/"}                  | ${MockStrings.LegacyApp}
    ${"/unrecognized-path"} | ${MockStrings.LegacyApp}
    ${"/create-game"}       | ${MockStrings.CreateGame}
  `("Shows $expected on path '$path'", ({ expected, path }) => {
    renderRoute(path);
    expect(screen.getByText(expected)).toBeInTheDocument();
  });
});
