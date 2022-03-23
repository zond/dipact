import React from "react";

import { render, screen } from "@testing-library/react";
import { MemoryRouter, BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom/extend-expect";
import Router from "../Router";

enum MockStrings {
  LegacyApp = "LegacyApp",
  CreateGame = "CreateGame",
}

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  BrowserRouter: jest.fn(),
}));
jest.mock("../../App", () => ({
  LegacyApp: () => <div>{MockStrings.LegacyApp}</div>,
}));
jest.mock("../CreateGame", () => () => <div>{MockStrings.CreateGame}</div>);

const renderRoute = (route: string): void => {
  (BrowserRouter as jest.Mock).mockImplementation(({ children }) => (
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
