import "react-native";
import React from "react";
import { fireEvent, render } from "@testing-library/react-native";

import GameList from "../GameList/GameList";
import { GameDisplay, GameStatus, useGameList } from "@diplicity/common";
import { Text } from "react-native";
import { act } from "react-test-renderer";
import GameCard from "../GameCard/GameCard";

interface ArrangeOptions {
  props: Parameters<typeof GameList>[0];
  useGameListValues: Partial<ReturnType<typeof useGameList>>;
}

const accordionIconTestID = "RNE__ListItem__Accordion__Icon";

jest.mock("@diplicity/common", () => ({
  ...jest.requireActual("@diplicity/common"),
  useGameList: jest.fn(),
}));

jest.mock("../GameCard");

const id = "id";

let props: Parameters<typeof GameList>[0];
let useGameListValues: Partial<ReturnType<typeof useGameList>>;

describe("GameList", () => {
  const arrange = (options: ArrangeOptions) => {
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
    (GameCard as jest.Mock).mockImplementation(() => <Text>GameCard</Text>);
    arrange({ props, useGameListValues });
  });
  test("Renders games", () => {
    const { getByText } = arrange({ props, useGameListValues });
    expect(getByText("GameCard")).not.toBeNull();
  });
  test("Pressing accordion button toggles expanded", () => {
    const { getByTestId, queryByText } = arrange({ props, useGameListValues });
    const accordionButton = getByTestId(accordionIconTestID);
    act(() => {
      fireEvent.press(accordionButton);
    });
    expect(queryByText("GameCard")).toBeNull();
  });
  test("Renders error if isError", () => {
    useGameListValues.isError = true;
    const { getByText } = arrange({ props, useGameListValues });
    expect(getByText("Error!")).not.toBeNull();
  });
  test("Renders nothing if isLoading", () => {
    useGameListValues.isLoading = true;
    const { queryByText } = arrange({ props, useGameListValues });
    expect(queryByText("GameCard")).toBeNull();
  });
});
