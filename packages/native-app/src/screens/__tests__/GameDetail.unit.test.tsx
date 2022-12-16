import React from "react";
import { act, fireEvent, render } from "@testing-library/react-native";
import {
  GameDisplay,
  NationAllocation,
  translateKeys as tk,
  useGameCard,
} from "@diplicity/common";

import GameDetail from "../GameDetail";

const accordionIconTestID = "RNE__ListItem__Accordion__Icon";

type UseGameCardValues = ReturnType<typeof useGameCard>;

interface ArrangeOptions {
  useGameCardValues: UseGameCardValues;
}
let useGameCardValues: UseGameCardValues;
let game: GameDisplay;
const name = "Game name";
const id = "id";
const username = "username";

jest.mock("@diplicity/common", () => ({
  ...jest.requireActual("@diplicity/common"),
  useGameCard: jest.fn(),
}));
const mockNavigate = jest.fn();
jest.mock("../../hooks/useNavigation", () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
}));
jest.mock("../../hooks/useParams", () => ({
  useParams: () => ({ gameId: id }),
}));

describe("GameDetail", () => {
  const arrange = (options: ArrangeOptions) => {
    const useGameCardMock = useGameCard as jest.Mock;
    useGameCardMock.mockImplementation(() => options.useGameCardValues);
    return render(<GameDetail />);
  };
  beforeEach(() => {
    game = {
      chatDisabled: false,
      chatLanguage: "en",
      deadlineDisplay: "<2d",
      failedRequirements: [] as string[],
      gameVariant: "Classical",
      id,
      minQuickness: null,
      minRating: null,
      name,
      nationAllocation: NationAllocation.Random,
      phaseSummary: "Fall 1906 Movement",
      players: [{ username, image: "" }],
      privateGame: false,
      rulesSummary: "Classical 2d",
    } as GameDisplay;
    useGameCardValues = {
      game,
      isLoading: false,
      joinGame: jest.fn(),
      deleteGame: jest.fn(),
    };
    jest.clearAllMocks();
  });
  test("Renders without error", () => {
    arrange({ useGameCardValues });
  });
  test("Shows loading if isLoading", () => {
    useGameCardValues.isLoading = true;
    const { getByLabelText } = arrange({ useGameCardValues });
    expect(getByLabelText(tk.loading.title)).not.toBeNull();
  });
  test("Pressing view button navigates to game", () => {
    const { getByLabelText } = arrange({ useGameCardValues });
    const nameElement = getByLabelText(tk.gameList.gameCard.viewButton.label);
    fireEvent.press(nameElement);
    expect(mockNavigate).toBeCalledWith("Game", { gameId: id });
  });
  test("Pressing rules accordion button toggles expanded", () => {
    const { getAllByTestId, getByText } = arrange({ useGameCardValues });
    const rulesAccordionButton = getAllByTestId(accordionIconTestID)[0];
    act(() => {
      fireEvent.press(rulesAccordionButton);
    });
    expect(
      getByText(tk.gameList.gameCard.gameVariantRule.label)
    ).not.toBeNull();
  });
  test("Pressing players accordion button toggles expanded", () => {
    const { getAllByTestId, getByText } = arrange({ useGameCardValues });
    const playersAccordionButton = getAllByTestId(accordionIconTestID)[1];
    act(() => {
      fireEvent.press(playersAccordionButton);
    });
    expect(getByText(username)).not.toBeNull();
  });
  test("Hides chat language if not chatLanguageDisplay", () => {
    const { getAllByTestId, queryByText } = arrange({ useGameCardValues });
    const rulesAccordionButton = getAllByTestId(accordionIconTestID)[0];
    act(() => {
      fireEvent.press(rulesAccordionButton);
    });
    expect(queryByText(tk.gameList.gameCard.chatLanguageRule.label)).toBeNull();
  });
  test("Shows chat language if chatLanguageDisplay", () => {
    game.chatLanguageDisplay = "English";
    useGameCardValues.game = game;
    const { getAllByTestId, getByText } = arrange({ useGameCardValues });
    const rulesAccordionButton = getAllByTestId(accordionIconTestID)[0];
    act(() => {
      fireEvent.press(rulesAccordionButton);
    });
    expect(
      getByText(tk.gameList.gameCard.chatLanguageRule.label)
    ).not.toBeNull();
  });
});
