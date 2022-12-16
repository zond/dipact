import "react-native";
import React from "react";
import { fireEvent, render } from "@testing-library/react-native";

import GameCard from "../GameCard";
import {
  GameDisplay,
  NationAllocation,
  translateKeys as tk,
} from "@diplicity/common";

interface ArrangeOptions {
  props: Parameters<typeof GameCard>[0];
}

let game: GameDisplay;
const name = "Game name";
const id = "id";

const mockNavigate = jest.fn();
jest.mock("../../hooks/useNavigation", () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
}));

describe("GameCard", () => {
  const arrange = (options: ArrangeOptions) => {
    return render(<GameCard {...options.props} />);
  };
  beforeEach(() => {
    game = {
      chatDisabled: false,
      chatLanguage: "en",
      deadlineDisplay: "<2d",
      name,
      rulesSummary: "Classical 2d",
      phaseSummary: "Fall 1906 Movement",
      privateGame: false,
      minQuickness: null,
      minRating: null,
      nationAllocation: NationAllocation.Random,
      id,
    } as GameDisplay;
    jest.clearAllMocks();
  });
  test("Renders without error", () => {
    arrange({ props: { game } });
  });
  test("Pressing game navigates to game detail", () => {
    const { getByText } = arrange({ props: { game } });
    const nameElement = getByText(name);
    fireEvent.press(nameElement);
    expect(mockNavigate).toBeCalledWith("GameDetail", { gameId: id });
  });
  test("Pressing view button navigates to game", () => {
    const { getByLabelText } = arrange({ props: { game } });
    const nameElement = getByLabelText(tk.gameList.gameCard.viewButton.label);
    fireEvent.press(nameElement);
    expect(mockNavigate).toBeCalledWith("Game", { gameId: id });
  });
  test("Private game icon appears when private", () => {
    game.privateGame = true;
    const { getByLabelText } = arrange({ props: { game } });
    expect(
      getByLabelText(tk.gameList.gameCard.privateGameIcon.tooltip)
    ).not.toBeNull();
  });
  test("Private game icon hidden when not private", () => {
    const { queryByLabelText } = arrange({ props: { game } });
    expect(
      queryByLabelText(tk.gameList.gameCard.privateGameIcon.tooltip)
    ).toBeNull();
  });
  test("minReliabilityQuickness icon appears when minReliability", () => {
    game.minQuickness = 10;
    const { getByLabelText } = arrange({ props: { game } });
    expect(
      getByLabelText(
        tk.gameList.gameCard.minQuicknessOrReliabilityRequiredIcon.tooltip
      )
    ).not.toBeNull();
  });
  test("minReliabilityQuickness icon appears when minQuickness", () => {
    game.minQuickness = 10;
    const { getByLabelText } = arrange({ props: { game } });
    expect(
      getByLabelText(
        tk.gameList.gameCard.minQuicknessOrReliabilityRequiredIcon.tooltip
      )
    ).not.toBeNull();
  });
  test("minReliabilityQuickness game icon hidden when not minReliabilityQuickness", () => {
    const { queryByLabelText } = arrange({ props: { game } });
    expect(
      queryByLabelText(
        tk.gameList.gameCard.minQuicknessOrReliabilityRequiredIcon.tooltip
      )
    ).toBeNull();
  });
  test("Preference icon appears when nationAllocation is preference", () => {
    game.nationAllocation = NationAllocation.Preference;
    const { getByLabelText } = arrange({ props: { game } });
    expect(
      getByLabelText(
        tk.gameList.gameCard.preferenceBaseNationAllocationIcon.tooltip
      )
    ).not.toBeNull();
  });
  test("Preference icon hidden when nationAllocation is random", () => {
    const { queryByLabelText } = arrange({ props: { game } });
    expect(
      queryByLabelText(
        tk.gameList.gameCard.preferenceBaseNationAllocationIcon.tooltip
      )
    ).toBeNull();
  });
  test("Min rating icon appears when minRating", () => {
    game.minRating = 10;
    const { getByLabelText } = arrange({ props: { game } });
    expect(
      getByLabelText(tk.gameList.gameCard.minRatingRequiredIcon.tooltip)
    ).not.toBeNull();
  });
  test("Min rating icon hidden when not minRating", () => {
    const { queryByLabelText } = arrange({ props: { game } });
    expect(
      queryByLabelText(tk.gameList.gameCard.minRatingRequiredIcon.tooltip)
    ).toBeNull();
  });
  test("Chat disabled icon appears when chatDisabled", () => {
    game.chatDisabled = true;
    const { getByLabelText } = arrange({ props: { game } });
    expect(
      getByLabelText(tk.gameList.gameCard.chatDisabledIcon.tooltip)
    ).not.toBeNull();
  });
  test("Chat disabled icon hidden when not chatDisabled", () => {
    const { queryByLabelText } = arrange({ props: { game } });
    expect(
      queryByLabelText(tk.gameList.gameCard.chatDisabledIcon.tooltip)
    ).toBeNull();
  });
});
