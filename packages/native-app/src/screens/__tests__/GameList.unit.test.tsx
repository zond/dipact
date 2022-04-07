import React from "react";
import { render } from "@testing-library/react-native";
import { useGameList } from "@diplicity/common";

import GameList from "../GameList";

interface ArrangeOptions {}

jest.mock("@diplicity/common", () => ({
  ...jest.requireActual("@diplicity/common"),
  useGameList: jest.fn(),
}));

const createUseGameListMock = (_?: ArrangeOptions) => ({
  games: [],
});

describe("GameList", () => {
  const arrange = (options?: ArrangeOptions) => {
    (useGameList as jest.Mock).mockImplementation(() =>
      createUseGameListMock(options)
    );
    return render(<GameList />);
  };
  beforeEach(() => {
    (useGameList as jest.Mock).mockImplementation(() =>
      createUseGameListMock()
    );
    jest.clearAllMocks();
  });
  test("Renders without error", () => {
    arrange();
  });
});
