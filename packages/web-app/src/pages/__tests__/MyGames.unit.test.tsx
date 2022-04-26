import React from "react";

import MyGames from "../MyGames";
import GameList from "../../components/GameList.new";
import { GameStatus, translateKeys as tk } from "@diplicity/common";
import { render } from "@testing-library/react";
import MainMenu from "../../components/MainMenu.new";

interface ArrangeOptions {}

jest.mock("../../components/GameList.new");
jest.mock("../../components/MainMenu.new");
const gameListMock = GameList as jest.Mock;
const mainMenuMock = MainMenu as jest.Mock;

describe("MyGames", () => {
  const arrange = (options: ArrangeOptions) => {
    return render(<MyGames />);
  };
  beforeEach(() => {
    jest.clearAllMocks();
    gameListMock.mockImplementation(() => <div>GameCard</div>);
    mainMenuMock.mockImplementation(({ children }) => <div>{children}</div>);
  });
  test("Renders without error", () => {
    arrange({});
    expect(mainMenuMock).toBeCalledTimes(1);
    expect(gameListMock).toBeCalledTimes(3);
    expect(gameListMock).toBeCalledWith(
      {
        filters: { mastered: false, my: true, status: GameStatus.Started },
        title: tk.gameList.gameStatusLabels.started,
        summaryOnly: true,
      },
      {}
    );
    expect(gameListMock).toBeCalledWith(
      {
        filters: { mastered: false, my: true, status: GameStatus.Staging },
        title: tk.gameList.gameStatusLabels.staging,
        summaryOnly: true,
      },
      {}
    );
    expect(gameListMock).toBeCalledWith(
      {
        filters: { mastered: false, my: true, status: GameStatus.Finished },
        title: tk.gameList.gameStatusLabels.finished,
        summaryOnly: true,
        startClosed: true,
      },
      {}
    );
  });
});
