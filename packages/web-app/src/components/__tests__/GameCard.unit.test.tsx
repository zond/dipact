import React from "react";

import GameCard from "../GameCard";
import {
  GameDisplay,
  NationAllocation,
  translateKeys as tk,
  useGameCard,
} from "@diplicity/common";
import { act, fireEvent, render, screen } from "@testing-library/react";
import useSearchParams from "../../hooks/useSearchParams";
import PlayerCount from "../PlayerCount";

type UseGameCardValues = ReturnType<typeof useGameCard>;

interface ArrangeOptions {
  props: Parameters<typeof GameCard>[0];
  useGameCardValues: UseGameCardValues;
  accordionOpen?: true;
}

let useGameCardValues: UseGameCardValues;
let game: GameDisplay;
const name = "Game name";
const id = "id";

const mockHistoryPush = jest.fn();
const mockSetParam = jest.fn();
jest.mock("@diplicity/common", () => ({
  ...jest.requireActual("@diplicity/common"),
  useGameCard: jest.fn(),
}));
jest.mock("react-router-dom", () => ({
  useHistory: () => ({
    push: mockHistoryPush,
  }),
  generatePath: () => "gameUrl",
}));
jest.mock("../../hooks/useSearchParams");
jest.mock("../PlayerCount");
const mockUseSearchParams = useSearchParams as jest.Mock;
const mockUseGameCard = useGameCard as jest.Mock;
const mockPlayerCount = PlayerCount as unknown as jest.Mock;
const mockJoinGame = jest.fn();

describe("GameCard", () => {
  const arrange = (options: ArrangeOptions) => {
    mockPlayerCount.mockImplementation(() => <div>PlayerCount</div>);
    mockUseSearchParams.mockImplementation(() => ({
      setParam: mockSetParam,
    }));
    mockUseGameCard.mockImplementation(() => options.useGameCardValues);
    const api = render(<GameCard {...options.props} />);
    if (options.accordionOpen) {
      act(() => {
        fireEvent.click(screen.getByTitle("Expand"));
      });
    }
    return api;
  };
  beforeEach(() => {
    game = {
      chatDisabled: false,
      chatLanguage: "en",
      deadlineDisplay: "<2d",
      failedRequirements: [] as string[],
      name,
      rulesSummary: "Classical 2d",
      phaseSummary: "Fall 1906 Movement",
      players: [{ username: "john" }],
      privateGame: false,
      minQuickness: null,
      minRating: null,
      nationAllocation: NationAllocation.Random,
      id,
      variantNumNations: 7,
    } as GameDisplay;
    useGameCardValues = {
      game,
      isLoading: false,
      joinGame: mockJoinGame,
      deleteGame: jest.fn(),
    };
    jest.clearAllMocks();
  });
  test("Renders without error", () => {
    arrange({ props: { game }, useGameCardValues });
  });
  test("When summary only, pressing game redirects to game", () => {
    arrange({ props: { game, summaryOnly: true }, useGameCardValues });
    const gameButton = screen.getByTitle(game.name);
    fireEvent.click(gameButton);
    expect(mockHistoryPush).toBeCalledWith("gameUrl");
  });
  test("Shows deadlineDisplay if started", () => {
    game.started = true;
    arrange({ props: { game, summaryOnly: true }, useGameCardValues });
    expect(screen.getByText(game.deadlineDisplay)).toBeInTheDocument();
  });
  test("Shows player count if not started", () => {
    game.started = false;
    arrange({ props: { game, summaryOnly: true }, useGameCardValues });
    expect(mockPlayerCount).toBeCalledWith(
      { numPlayers: 1, maxNumPlayers: 7 },
      {}
    );
  });
  test("Private game icon appears when private", () => {
    game.privateGame = true;
    arrange({
      props: { game, summaryOnly: true },
      useGameCardValues,
    });
    expect(
      screen.getByTitle(tk.gameList.gameCard.privateGameIcon.tooltip)
    ).not.toBeNull();
  });
  test("Private game icon hidden when not private", () => {
    arrange({
      props: { game, summaryOnly: true },
      useGameCardValues,
    });
    expect(
      screen.queryByTitle(tk.gameList.gameCard.privateGameIcon.tooltip)
    ).toBeNull();
  });
  test("minReliabilityQuickness icon appears when minReliability", () => {
    game.minQuickness = 10;
    arrange({
      props: { game, summaryOnly: true },
      useGameCardValues,
    });
    expect(
      screen.getByTitle(
        tk.gameList.gameCard.minQuicknessOrReliabilityRequiredIcon.tooltip
      )
    ).not.toBeNull();
  });
  test("minReliabilityQuickness icon appears when minQuickness", () => {
    game.minQuickness = 10;
    arrange({
      props: { game, summaryOnly: true },
      useGameCardValues,
    });
    expect(
      screen.getByTitle(
        tk.gameList.gameCard.minQuicknessOrReliabilityRequiredIcon.tooltip
      )
    ).not.toBeNull();
  });
  test("minReliabilityQuickness game icon hidden when not minReliabilityQuickness", () => {
    arrange({
      props: { game, summaryOnly: true },
      useGameCardValues,
    });
    expect(
      screen.queryByTitle(
        tk.gameList.gameCard.minQuicknessOrReliabilityRequiredIcon.tooltip
      )
    ).toBeNull();
  });
  test("Preference icon appears when nationAllocation is preference", () => {
    game.nationAllocation = NationAllocation.Preference;
    arrange({
      props: { game, summaryOnly: true },
      useGameCardValues,
    });
    expect(
      screen.getByTitle(
        tk.gameList.gameCard.preferenceBaseNationAllocationIcon.tooltip
      )
    ).not.toBeNull();
  });
  test("Preference icon hidden when nationAllocation is random", () => {
    arrange({ props: { game, summaryOnly: true }, useGameCardValues });
    expect(
      screen.queryByTitle(
        tk.gameList.gameCard.preferenceBaseNationAllocationIcon.tooltip
      )
    ).toBeNull();
  });
  test("Min rating icon appears when minRating", () => {
    game.minRating = 10;
    arrange({
      props: { game, summaryOnly: true },
      useGameCardValues,
    });
    expect(
      screen.getByTitle(tk.gameList.gameCard.minRatingRequiredIcon.tooltip)
    ).not.toBeNull();
  });
  test("Min rating icon hidden when not minRating", () => {
    arrange({
      props: { game, summaryOnly: true },
      useGameCardValues,
    });
    expect(
      screen.queryByTitle(tk.gameList.gameCard.minRatingRequiredIcon.tooltip)
    ).toBeNull();
  });
  test("Chat disabled icon appears when chatDisabled", () => {
    game.chatDisabled = true;
    arrange({
      props: { game, summaryOnly: true },
      useGameCardValues,
    });
    expect(
      screen.getByTitle(tk.gameList.gameCard.chatDisabledIcon.tooltip)
    ).not.toBeNull();
  });
  test("Chat disabled icon hidden when not chatDisabled", () => {
    arrange({
      props: { game, summaryOnly: true },
      useGameCardValues,
    });
    expect(
      screen.queryByTitle(tk.gameList.gameCard.chatDisabledIcon.tooltip)
    ).toBeNull();
  });
  test("Click join when preference redirects", () => {
    arrange({
      props: {
        game: { ...game, nationAllocation: NationAllocation.Preference },
      },
      useGameCardValues,
      accordionOpen: true,
    });
    fireEvent.click(
      screen.getByRole("button", {
        name: tk.gameList.gameCard.joinButton.label,
      })
    );
    expect(mockSetParam).toBeCalledWith("nation-preference-dialog", id);
  });
  test("Click join when random calls join", () => {
    arrange({
      props: { game },
      useGameCardValues,
      accordionOpen: true,
    });
    act(() => {
      fireEvent.click(
        screen.getByRole("button", {
          name: tk.gameList.gameCard.joinButton.label,
        })
      );
    });
    expect(mockJoinGame).toBeCalledWith({
      NationPreferences: "",
      GameAlias: "",
    });
  });
  test("Cannot click join if failedRequirements", () => {
    game.failedRequirements = [""];
    arrange({
      props: { game },
      useGameCardValues,
      accordionOpen: true,
    });
    const button = screen.getByRole("button", {
      name: tk.gameList.gameCard.joinButton.label,
    });
    expect(button).toBeDisabled();
  });
  test("Cannot click join if isLoading", () => {
    useGameCardValues.isLoading = true;
    arrange({
      props: { game },
      useGameCardValues,
      accordionOpen: true,
    });
    const button = screen.getByRole("button", {
      name: tk.gameList.gameCard.joinButton.label,
    });
    expect(button).toBeDisabled();
  });
  test("Manage invitations button does not appear if not gameMaster", () => {
    arrange({
      props: { game },
      useGameCardValues,
      accordionOpen: true,
    });
    const button = screen.queryByRole("button", {
      name: tk.gameList.gameCard.manageInvitationsButton.label,
    });
    expect(button).not.toBeInTheDocument();
  });
  test("Click manage invitations causes redirect", () => {
    game.userIsGameMaster = true;
    arrange({
      props: { game },
      useGameCardValues,
      accordionOpen: true,
    });
    const button = screen.getByRole("button", {
      name: tk.gameList.gameCard.manageInvitationsButton.label,
    });
    fireEvent.click(button);
    expect(mockSetParam).toBeCalledWith("manage-invitations-dialog", id);
  });
  test("Rename button does not appear if not member", () => {
    arrange({
      props: { game },
      useGameCardValues,
      accordionOpen: true,
    });
    const button = screen.queryByRole("button", {
      name: tk.gameList.gameCard.renameButton.label,
    });
    expect(button).not.toBeInTheDocument();
  });
  test("Click rename button causes redirect", () => {
    game.userIsMember = true;
    arrange({
      props: { game },
      useGameCardValues,
      accordionOpen: true,
    });
    const button = screen.getByRole("button", {
      name: tk.gameList.gameCard.renameButton.label,
    });
    fireEvent.click(button);
    expect(mockSetParam).toBeCalledWith("rename-game-dialog", id);
  });
  test("Reschedule button does not appear if not game master", () => {
    arrange({
      props: { game },
      useGameCardValues,
      accordionOpen: true,
    });
    const button = screen.queryByRole("button", {
      name: tk.gameList.gameCard.rescheduleButton.label,
    });
    expect(button).not.toBeInTheDocument();
  });
  test("Click reschedule button causes redirect", () => {
    game.userIsGameMaster = true;
    arrange({
      props: { game },
      useGameCardValues,
      accordionOpen: true,
    });
    const button = screen.getByRole("button", {
      name: tk.gameList.gameCard.rescheduleButton.label,
    });
    fireEvent.click(button);
    expect(mockSetParam).toBeCalledWith("reschedule-dialog", id);
  });
});
