/* eslint-disable jest/no-identical-title */
import "react-native";
import React from "react";
import { fireEvent, render, within } from "@testing-library/react-native";

import GameCard from "../GameCard/GameCard";
import {
  GameDisplay,
  GameDisplayActionNames,
  NationAllocation,
  translateKeys as tk,
} from "@diplicity/common";
import { ReactTestInstance } from "react-test-renderer";

const mockNavigate = jest.fn();
jest.mock("../../hooks/useNavigation", () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
}));

const mockDispatch = jest.fn();
jest.mock("react-redux", () => ({
  useDispatch: () => mockDispatch,
}));

const isOrNot = (value: any) => (value ? "is" : "is not");

const player: GameDisplay["players"][0] = {
  username: "username",
  image: "image",
};

let screen: ReturnType<typeof render>;

const defaultGameProps = {
  actions: new Set<GameDisplayActionNames>(),
  chatDisabled: false,
  chatLanguage: "en",
  chatLanguageDisplay: "English",
  confirmationStatus: "confirmed" as GameDisplay["confirmationStatus"],
  createdAtDisplay: "",
  deadlineDisplay: "",
  failedRequirements: [],
  gameVariant: "Classical",
  id: "game-id",
  minQuickness: 1,
  minRating: 1,
  minReliability: 1,
  name: "Game Name",
  nationAllocation: NationAllocation.Random,
  numUnreadMessages: 0,
  phaseSummary: "",
  players: [],
  privateGame: false,
  rulesSummary: "Classical 1d",
  status: "staging" as GameDisplay["status"],
  userIsGameMaster: false,
  userIsMember: false,
  variantNumNations: 7,
};

const getModalFromTestId = (id: string) => {
  const modal = screen.getByTestId(id);
  const parent = modal.parent as ReactTestInstance;
  return parent.parent as ReactTestInstance;
};

describe.each`
  game                                                                                                                                              | showActions | testName
  ${{ ...defaultGameProps, privateGame: true, status: "staging", players: [player], userIsMember: true } as GameDisplay}                            | ${false}    | ${"Given that user is a member of the game, actions are not shown, the game is: staging, private"}
  ${{ ...defaultGameProps, privateGame: false, status: "staging", players: [player], userIsMember: true } as GameDisplay}                           | ${false}    | ${"Given that user is a member of the game, actions are not shown, the game is: staging, public"}
  ${{ ...defaultGameProps, privateGame: false, status: "started", players: [player], userIsMember: true } as GameDisplay}                           | ${false}    | ${"Given that user is a member of the game, actions are not shown, the game is: started, public"}
  ${{ ...defaultGameProps, privateGame: true, status: "staging", players: [], userIsMember: false } as GameDisplay}                                 | ${false}    | ${"Given that user is not a member of the game, actions are not shown, the game is: staging, private"}
  ${{ ...defaultGameProps, privateGame: false, status: "staging", players: [], userIsMember: false } as GameDisplay}                                | ${false}    | ${"Given that user is not a member of the game, actions are not shown, the game is: staging, public"}
  ${{ ...defaultGameProps, privateGame: false, status: "started", players: [], userIsMember: false } as GameDisplay}                                | ${false}    | ${"Given that user is not a member of the game, actions are not shown, the game is: started, public"}
  ${{ ...defaultGameProps, privateGame: false, status: "staging", players: [], userIsMember: false } as GameDisplay}                                | ${true}     | ${"Given that user is not a member of the game, actions shown, the game is: staging, public"}
  ${{ ...defaultGameProps, privateGame: false, status: "staging", players: [], userIsMember: false, confirmationStatus: undefined } as GameDisplay} | ${true}     | ${"Given that user is not a member of the game, actions shown, confirmationStatus is undefined"}
`(
  "$testName",
  ({ game, showActions }: { game: GameDisplay; showActions: boolean }) => {
    const { status, players, privateGame } = game;
    const user = players[0];
    const started = status === "started";
    const staging = status === "staging";
    const expectedPlayerCountLabel = `${game.players.length}/${game.variantNumNations}`;
    beforeEach(() => {
      screen = render(<GameCard game={game} showActions={showActions} />);
    });
    describe("When the GameCard is rendered", () => {
      test(`The private icon ${isOrNot(privateGame)} displayed`, () => {
        expect(Boolean(screen.queryByTestId("private-icon"))).toBe(
          Boolean(privateGame)
        );
      });
      test("The game name is displayed", () => {
        expect(screen.getByText(game.name)).toBeDefined();
      });
      test(`The player count ${isOrNot(staging)} displayed`, () => {
        expect(Boolean(screen.queryByText(expectedPlayerCountLabel))).toBe(
          Boolean(staging)
        );
      });
      test("The rules summary is displayed", () => {
        expect(screen.getByLabelText("Rules summary")).toBeDefined();
      });
      test(`The phase summary ${isOrNot(started)} displayed`, () => {
        expect(Boolean(screen.queryByLabelText("Phase summary"))).toBe(started);
      });
      test(`The player avatar ${isOrNot(user)} displayed`, () => {
        expect(Boolean(screen.queryByTestId("RNE__Avatar__Image"))).toBe(
          Boolean(user)
        );
      });
      test("The more button is displayed", () => {
        expect(screen.getByLabelText("More button")).toBeDefined();
      });
      test("More menu is not displayed", () => {
        const moreMenu = getModalFromTestId("game-card-more-menu");
        expect(moreMenu.props).toHaveProperty("visible", false);
      });
    });
    describe("When the more button is pressed", () => {
      beforeEach(() => {
        fireEvent.press(screen.getByLabelText("More button"));
      });
      test("More menu is displayed", () => {
        const moreMenu = getModalFromTestId("game-card-more-menu");
        expect(moreMenu.props).toHaveProperty("visible", true);
      });
    });
    describe("When the more button is pressed and the backdrop is pressed", () => {
      beforeEach(() => {
        fireEvent.press(screen.getByLabelText("More button"));
        fireEvent.press(screen.getByTestId("RNE__Overlay__backdrop"));
      });
      test("More menu is displayed", () => {
        const moreMenu = getModalFromTestId("game-card-more-menu");
        expect(moreMenu.props).toHaveProperty("visible", false);
      });
    });
  }
);

describe("Given that there are more players than numAvatarsToDisplay", () => {
  beforeEach(() => {
    screen = render(
      <GameCard
        game={{ ...defaultGameProps, players: [player] }}
        numAvatarsToDisplay={0}
      />
    );
  });
  describe("When the GameCard is rendered", () => {
    test("The overspill icon is visible", () => {
      expect(screen.getByTestId("avatar-overspill-icon")).toBeDefined();
    });
  });
});

describe("Given that there are fewer players than numAvatarsToDisplay", () => {
  beforeEach(() => {
    screen = render(
      <GameCard
        game={{ ...defaultGameProps, players: [player] }}
        numAvatarsToDisplay={2}
      />
    );
  });
  describe("When the GameCard is rendered", () => {
    test("The overspill icon is not visible", () => {
      expect(screen.queryByTestId("avatar-overspill-icon")).toBeNull();
    });
  });
});

describe.each`
  testName                             | game                                                           | showChatDisabledIcon
  ${"Given that chat is disabled"}     | ${{ ...defaultGameProps, chatDisabled: true } as GameDisplay}  | ${true}
  ${"Given that chat is not disabled"} | ${{ ...defaultGameProps, chatDisabled: false } as GameDisplay} | ${false}
`(
  "$testName",
  ({
    game,
    showChatDisabledIcon,
  }: {
    game: GameDisplay;
    showChatDisabledIcon: boolean;
  }) => {
    describe("When the GameCard is rendered", () => {
      beforeEach(() => {
        screen = render(<GameCard game={game} />);
      });
      test(`The chat disabled icon ${isOrNot(
        showChatDisabledIcon
      )} visible`, () => {
        expect(
          Boolean(
            screen.queryByLabelText(
              tk.gameList.gameCard.chatDisabledIcon.tooltip
            )
          )
        ).toBe(showChatDisabledIcon);
      });
    });
  }
);

describe.each`
  testName                                        | game                                                                                     | showPreferenceIcon
  ${"Given that nation allocation is preference"} | ${{ ...defaultGameProps, nationAllocation: NationAllocation.Preference } as GameDisplay} | ${true}
  ${"Given that nation allocation is random"}     | ${{ ...defaultGameProps, nationAllocation: NationAllocation.Random } as GameDisplay}     | ${false}
`(
  "$testName",
  ({
    game,
    showPreferenceIcon,
  }: {
    game: GameDisplay;
    showPreferenceIcon: boolean;
  }) => {
    describe("When the GameCard is rendered", () => {
      beforeEach(() => {
        screen = render(<GameCard game={game} />);
      });
      test(`The nation preference icon ${isOrNot(
        showPreferenceIcon
      )} visible`, () => {
        expect(
          Boolean(
            screen.queryByLabelText(
              tk.gameList.gameCard.preferenceBaseNationAllocationIcon.tooltip
            )
          )
        ).toBe(showPreferenceIcon);
      });
    });
  }
);

describe.each`
  game                                                                                                | showActions | testName
  ${{ ...defaultGameProps, actions: new Set([]) } as GameDisplay}                                     | ${true}     | ${"Given that actions are shown and actions=[]"}
  ${{ ...defaultGameProps, actions: new Set(["gameInfo", "share", "join", "leave"]) } as GameDisplay} | ${true}     | ${"Given that actions are shown and actions=[gameInfo, share, join, leave]"}
`(
  "$testName",
  ({ game, showActions }: { game: GameDisplay; showActions: boolean }) => {
    beforeEach(() => {
      screen = render(<GameCard game={game} showActions={showActions} />);
    });
    describe(`When the GameCard is rendered with ${[
      game.actions,
    ].toString()}`, () => {
      test.each`
        name             | label             | shown
        ${"gameInfo"}    | ${"GAME INFO"}    | ${game.actions.has("gameInfo")}
        ${"variantInfo"} | ${"VARIANT INFO"} | ${false}
        ${"playerInfo"}  | ${"PLAYER INFO"}  | ${false}
        ${"share"}       | ${"SHARE"}        | ${game.actions.has("share")}
        ${"join"}        | ${"JOIN"}         | ${game.actions.has("join")}
        ${"leave"}       | ${"LEAVE"}        | ${game.actions.has("leave")}
      `("The $name action is shown: $shown in actions", ({ label, shown }) => {
        const actionsElement = screen.getByTestId("game-card-actions");
        expect(Boolean(within(actionsElement).queryByText(label))).toBe(
          Boolean(shown)
        );
      });
    });
  }
);

describe.each`
  game                                                                                                                             | showActions | testName
  ${{ ...defaultGameProps, actions: new Set([]) } as GameDisplay}                                                                  | ${false}    | ${"Given that actions are not shown and actions=[]"}
  ${{ ...defaultGameProps, actions: new Set(["gameInfo", "share", "join", "variantInfo", "playerInfo", "leave"]) } as GameDisplay} | ${false}    | ${"Given that actions are not shown and actions=[gameInfo, share, join, leave]"}
`(
  "$testName",
  ({ game, showActions }: { game: GameDisplay; showActions: boolean }) => {
    beforeEach(() => {
      mockNavigate.mockClear();
      screen = render(<GameCard game={game} showActions={showActions} />);
    });
    describe(`When the GameCard is rendered with ${[
      game.actions,
    ].toString()}`, () => {
      test.each`
        name             | label             | shown
        ${"gameInfo"}    | ${"GAME INFO"}    | ${game.actions.has("gameInfo")}
        ${"variantInfo"} | ${"VARIANT INFO"} | ${game.actions.has("variantInfo")}
        ${"playerInfo"}  | ${"PLAYER INFO"}  | ${game.actions.has("playerInfo")}
        ${"share"}       | ${"SHARE"}        | ${game.actions.has("share")}
        ${"join"}        | ${"JOIN"}         | ${game.actions.has("join")}
        ${"leave"}       | ${"LEAVE"}        | ${game.actions.has("leave")}
      `(
        "The $name action is shown: $shown in the more menu",
        ({ label, shown }) => {
          const moreMenu = screen.getByTestId("game-card-more-menu");
          expect(Boolean(within(moreMenu).queryByText(label))).toBe(
            Boolean(shown)
          );
        }
      );
    });
  }
);

describe.each`
  game                                                                                                                             | testName
  ${{ ...defaultGameProps, actions: new Set(["gameInfo", "share", "join", "variantInfo", "playerInfo", "leave"]) } as GameDisplay} | ${"Given that the game card is rendered with all actions"}
`("$testName", ({ game }: { game: GameDisplay }) => {
  beforeEach(() => {
    mockNavigate.mockClear();
    screen = render(<GameCard game={game} />);
  });
  describe("When the leave button is pressed", () => {
    beforeEach(() => {
      fireEvent.press(screen.getByText("LEAVE"));
    });
    test("The leave game action is dispatched", () => {
      expect(mockDispatch).toHaveBeenCalledWith({
        type: "LEAVE_GAME",
        gameId: game.id,
      });
    });
  });
  describe("When the join button is pressed", () => {
    beforeEach(() => {
      fireEvent.press(screen.getByText("JOIN"));
    });
    test("The join game action is dispatched", () => {
      expect(mockDispatch).toHaveBeenCalledWith({
        type: "JOIN_GAME",
        gameId: game.id,
      });
    });
  });
  describe("When the share button is pressed", () => {
    beforeEach(() => {
      fireEvent.press(screen.getByText("SHARE"));
    });
    test("The share action is dispatched", () => {
      expect(mockDispatch).toHaveBeenCalledWith({
        type: "SHARE",
        gameId: game.id,
      });
    });
  });
  describe("When the gameInfo button is pressed", () => {
    beforeEach(() => {
      fireEvent.press(screen.getByText("GAME INFO"));
    });
    test("GameDetail page is opened on the GameInfo tab", () => {
      expect(mockNavigate).toHaveBeenCalledWith("GameDetail", {
        gameId: game.id,
        tab: "GameInfo",
      });
    });
  });
  describe("When the variantInfo button is pressed", () => {
    beforeEach(() => {
      fireEvent.press(screen.getByText("VARIANT INFO"));
    });
    test("GameDetail page is opened on the VariantInfo tab", () => {
      expect(mockNavigate).toHaveBeenCalledWith("GameDetail", {
        gameId: game.id,
        tab: "VariantInfo",
      });
    });
  });
  describe("When the playerInfo button is pressed", () => {
    beforeEach(() => {
      fireEvent.press(screen.getByText("PLAYER INFO"));
    });
    test("GameDetail page is opened on the PlayerInfo tab", () => {
      expect(mockNavigate).toHaveBeenCalledWith("GameDetail", {
        gameId: game.id,
        tab: "PlayerInfo",
      });
    });
  });
});

describe.each`
  game                                                          | testName                             | expectedScreen
  ${{ ...defaultGameProps, status: "staging" } as GameDisplay}  | ${"Given that the game is staging"}  | ${"GameDetail"}
  ${{ ...defaultGameProps, status: "started" } as GameDisplay}  | ${"Given that the game is started"}  | ${"Game"}
  ${{ ...defaultGameProps, status: "finished" } as GameDisplay} | ${"Given that the game is finished"} | ${"Game"}
`(
  "$testName",
  ({
    game,
    expectedScreen,
  }: {
    game: GameDisplay;
    expectedScreen: "GameDetail" | "Game";
  }) => {
    beforeEach(() => {
      mockNavigate.mockClear();
      screen = render(<GameCard game={game} />);
    });
    describe("When the game card is pressed", () => {
      beforeEach(() => {
        fireEvent.press(screen.getByTestId("game-card"));
      });
      test(`${expectedScreen} screen is opened`, () => {
        if (expectedScreen === "GameDetail") {
          expect(mockNavigate).not.toHaveBeenCalledWith("Game", {
            gameId: game.id,
          });
          expect(mockNavigate).toHaveBeenCalledWith("GameDetail", {
            gameId: game.id,
            tab: "",
          });
        } else {
          expect(mockNavigate).toHaveBeenCalledWith("Game", {
            gameId: game.id,
          });
          expect(mockNavigate).not.toHaveBeenCalledWith("GameDetail", {
            gameId: game.id,
            tab: "",
          });
        }
      });
    });
  }
);
