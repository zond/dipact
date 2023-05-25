import React from "react";

import GameList from "../GameList.new";
import { GameDisplay, GameStatus, useGameList } from "@diplicity/common";
import GameCard from "../GameCard";
import { render, screen } from "@testing-library/react";

interface ArrangeOptions {
  props: Parameters<typeof GameList>[0];
  useGameListValues: Partial<ReturnType<typeof useGameList>>;
}

jest.mock("@diplicity/common", () => ({
  ...jest.requireActual("@diplicity/common"),
  useGameList: jest.fn(),
}));

jest.mock("../GameCard");

const id = "id";

let props: Parameters<typeof GameList>[0];
let useGameListValues: Partial<ReturnType<typeof useGameList>>;

describe("GameList", () => {
  const gameCardMock = GameCard as unknown as jest.Mock;
  const arrange = (options: ArrangeOptions) => {
    (GameCard as unknown as jest.Mock).mockImplementation(() => (
      <div>GameCard</div>
    ));
    (useGameList as jest.Mock).mockImplementation(
      () => options.useGameListValues
    );
    return render(<GameList {...options.props} />);
  };
  beforeEach(() => {
    props = {
      title: "Started Games",
      filters: { my: false, status: GameStatus.Started, mastered: false },
    };
    useGameListValues = {
      games: [{ id } as GameDisplay],
      isLoading: false,
      isError: false,
      isSuccess: true,
    };
    jest.clearAllMocks();
  });
  test("Renders without error", () => {
    arrange({ props, useGameListValues });
  });
  test("Renders nothing if isLoading", () => {
    useGameListValues.isLoading = true;
    arrange({ props, useGameListValues });
    expect(screen.queryByText("GameCard")).toBeNull();
  });
  test("Renders games", () => {
    arrange({ props, useGameListValues });
    expect(screen.getByText("GameCard")).not.toBeNull();
  });
  test("Passes summary only", () => {
    props.summaryOnly = true;
    arrange({ props, useGameListValues });
    expect(gameCardMock).toBeCalledWith(
      {
        game: expect.anything(),
        summaryOnly: true,
        space: expect.any(Number),
      },
      {}
    );
    expect(screen.getByText("GameCard")).not.toBeNull();
  });
});
