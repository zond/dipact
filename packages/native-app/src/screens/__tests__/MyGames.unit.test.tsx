import "react-native";
import React from "react";
import { render } from "@testing-library/react-native";

import MyGames from "../MyGames";
import { Text } from "react-native";
import GameList from "../../components/GameList/GameList";
import { GameStatus, translateKeys as tk } from "@diplicity/common";

interface ArrangeOptions {
  props: Parameters<typeof MyGames>[0];
}

jest.mock("../../components/GameList");

let props: Parameters<typeof MyGames>[0];

describe("MyGames", () => {
  const arrange = (options: ArrangeOptions) => {
    return render(<MyGames {...options.props} />);
  };
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test("Renders without error", () => {
    const gameListMock = GameList as jest.Mock;
    gameListMock.mockImplementation(() => <Text>GameCard</Text>);
    arrange({ props });
    expect(gameListMock).toBeCalledTimes(3);
    expect(gameListMock).toBeCalledWith(
      {
        filters: { mastered: false, my: true, status: GameStatus.Started },
        title: tk.gameList.gameStatusLabels.started,
      },
      {}
    );
    expect(gameListMock).toBeCalledWith(
      {
        filters: { mastered: false, my: true, status: GameStatus.Staging },
        title: tk.gameList.gameStatusLabels.staging,
      },
      {}
    );
    expect(gameListMock).toBeCalledWith(
      {
        filters: { mastered: false, my: true, status: GameStatus.Finished },
        title: tk.gameList.gameStatusLabels.finished,
        startClosed: true,
      },
      {}
    );
  });
});
