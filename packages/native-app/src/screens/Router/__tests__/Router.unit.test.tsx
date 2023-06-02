import React from "react";
import { render } from "@testing-library/react-native";

import Router from "../Router";
import { useSelector } from "react-redux";
import { translateKeys as tk } from "@diplicity/common";

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useSelector: jest.fn(),
}));

jest.mock("../../BrowseGames", () => () => <>BrowseGames</>);
jest.mock("../../Chat", () => () => <>Chat</>);
jest.mock("../../CreateGame", () => () => <>CreateGame</>);
jest.mock("../../GameInfo", () => () => <>GameInfo</>);
jest.mock("../../Login", () => () => <>Login</>);
jest.mock("../../Map", () => () => <>Map</>);
jest.mock("../../MyGames", () => () => <>MyGames</>);
jest.mock("../../Orders", () => () => <>Orders</>);

jest.mock("@diplicity/common", () => ({
  ...jest.requireActual("@diplicity/common"),
  useGameDetailView: jest.fn(),
}));

describe("Router", () => {
  const arrange = () => {
    return render(<Router />);
  };
  beforeEach(() => {});
  test("Renders without error", () => {
    (useSelector as jest.Mock).mockImplementation(() => true);
    arrange();
  });
  test("Logged in", () => {
    (useSelector as jest.Mock).mockImplementation(() => true);
    const { getByText, getAllByText } = arrange();
    expect(getAllByText(tk.gameList.myGamesTab.label).length).toBeGreaterThan(
      0
    );
    getByText(tk.createGame.title);
  });
  test("Logged out", () => {
    (useSelector as jest.Mock).mockImplementation(() => false);
    const { toJSON } = arrange();
    const json = toJSON();
    expect(json).toBe("Login");
  });
});
