import "react-native";
import React from "react";
import { fireEvent, render } from "@testing-library/react-native";

import GameCard from "../GameCard/GameCard";
import {
  GameDisplay,
  NationAllocation,
  PlayerDisplay,
  translateKeys as tk,
} from "@diplicity/common";
import { ThemeProvider } from "@rneui/themed";
import { theme } from "../../theme";
import { BottomSheetContent } from "../BottomSheetWrapper";

const mockNavigate = jest.fn();
jest.mock("../../hooks/useNavigation", () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
}));

const mockDispatch = jest.fn();
jest.mock("react-redux", () => ({
  useDispatch: () => mockDispatch,
}));
const mockSetBottomSheet = jest.fn();
const mockWithCloseBottomSheet = jest.fn();
jest.mock("../BottomSheetWrapper", () => ({
  ...jest.requireActual("../BottomSheetWrapper"),
  useBottomSheet: () => [mockSetBottomSheet, mockWithCloseBottomSheet],
}));

const isOrNot = (value: any) => (value ? "is" : "is not");

const player: GameDisplay["players"][0] = {
  username: "username",
  image: "image",
};

let screen: ReturnType<typeof render>;

const defaultGameProps = {
  chatDisabled: false,
  chatLanguage: "en",
  chatLanguageDisplay: "English",
  confirmationStatus: "confirmed",
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
  status: "staging",
  userIsGameMaster: false,
  userIsMember: false,
  variantNumNations: 7,
};

describe.each`
  game                                                                                                                                                                                           | showActions | testName
  ${{ ...defaultGameProps, privateGame: true, status: "staging", players: [player], name: "Game Name", variantNumNations: 7, rulesSummary: "Classical 1d", userIsMember: true } as GameDisplay}  | ${false}    | ${"Given that user is a member of the game, actions are not shown, the game is: staging, private"}
  ${{ ...defaultGameProps, privateGame: false, status: "staging", players: [player], name: "Game Name", variantNumNations: 7, rulesSummary: "Classical 1d", userIsMember: true } as GameDisplay} | ${false}    | ${"Given that user is a member of the game, actions are not shown, the game is: staging, public"}
  ${{ ...defaultGameProps, privateGame: false, status: "started", players: [player], name: "Game Name", variantNumNations: 7, rulesSummary: "Classical 1d", userIsMember: true } as GameDisplay} | ${false}    | ${"Given that user is a member of the game, actions are not shown, the game is: started, public"}
  ${{ ...defaultGameProps, privateGame: true, status: "staging", players: [], name: "Game Name", variantNumNations: 7, rulesSummary: "Classical 1d", userIsMember: false } as GameDisplay}       | ${false}    | ${"Given that user is not a member of the game, actions are not shown, the game is: staging, private"}
  ${{ ...defaultGameProps, privateGame: false, status: "staging", players: [], name: "Game Name", variantNumNations: 7, rulesSummary: "Classical 1d", userIsMember: false } as GameDisplay}      | ${false}    | ${"Given that user is not a member of the game, actions are not shown, the game is: staging, public"}
  ${{ ...defaultGameProps, privateGame: false, status: "started", players: [], name: "Game Name", variantNumNations: 7, rulesSummary: "Classical 1d", userIsMember: false } as GameDisplay}      | ${false}    | ${"Given that user is not a member of the game, actions are not shown, the game is: started, public"}
  ${{ ...defaultGameProps, privateGame: false, status: "staging", players: [], name: "Game Name", variantNumNations: 7, rulesSummary: "Classical 1d", userIsMember: false } as GameDisplay}      | ${true}     | ${"Given that user is not a member of the game, actions shown, the game is: staging, public"}
`(
  "$testName",
  ({ game, showActions }: { game: GameDisplay; showActions: boolean }) => {
    const { status, players, privateGame } = game;
    const user = players[0];
    const started = status === "started";
    const staging = status === "staging";
    const expectedPlayerCountLabel = `${game.players.length}/${game.variantNumNations}`;
    beforeEach(() => {
      mockSetBottomSheet.mockClear();
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
      test(`The share button ${isOrNot(showActions)} displayed`, () => {
        expect(Boolean(screen.queryByText("SHARE"))).toBe(Boolean(showActions));
      });
    });
    describe("When the more button is pressed", () => {
      beforeEach(() => {
        fireEvent.press(screen.getByLabelText("More button"));
      });
      test("The bottom sheet is opened", () => {
        expect(mockSetBottomSheet).toHaveBeenCalled();
      });
    });
  }
);

// const expectBottomSheetWithElement = (args: {
//   elementType: string;
//   key: string;
// }) =>
//   expect.objectContaining({
//     sections: expect.arrayContaining([
//       expect.objectContaining({
//         elements: expect.arrayContaining([
//           expect.objectContaining({ ...args }),
//         ]),
//       }),
//     ]),
//   });

describe("Given that the user is a member of the game and the game is staging", () => {
  const game = {
    ...defaultGameProps,
    userIsMember: true,
    status: "staging",
  } as GameDisplay;
  beforeEach(() => {
    mockSetBottomSheet.mockClear();
    screen = render(<GameCard game={game} />);
  });
  describe("When the more button is pressed", () => {
    beforeEach(() => {
      fireEvent.press(screen.getByLabelText("More button"));
    });
    test("The bottom sheet is opened", () => {
      expect(mockSetBottomSheet).toHaveBeenCalled();
    });
  });
});

const pressBottomSheetButton = (key: string) => {
  const bottomSheetProps = mockSetBottomSheet.mock
    .calls[0][0] as BottomSheetContent;
  const element =
    bottomSheetProps.sections[0].elements.find(
      (element) => element.key === key
    ) ||
    bottomSheetProps.sections[1].elements.find(
      (element) => element.key === key
    );
  if (element && element.onPress) {
    element.onPress({} as any);
  }
};

describe("Given that the user is not a member and the more button has been pressed", () => {
  const game = {
    ...defaultGameProps,
    userIsMember: false,
    status: "staging",
  } as GameDisplay;
  beforeEach(() => {
    mockSetBottomSheet.mockClear();
    screen = render(<GameCard game={game} />);
    fireEvent.press(screen.getByLabelText("More button"));
  });
  describe("When the join button is pressed", () => {
    beforeEach(() => {
      pressBottomSheetButton("join");
    });
    test("The joinGame action is dispatched", () => {
      expect(mockDispatch).toHaveBeenCalledWith({
        type: "JOIN_GAME",
        gameId: game.id,
      });
    });
  });
  describe("When the share button is pressed", () => {
    beforeEach(() => {
      pressBottomSheetButton("share");
    });
    test("The share action is dispatched", () => {
      expect(mockDispatch).toHaveBeenCalledWith({
        type: "SHARE",
        gameId: game.id,
      });
    });
  });
});

describe("Given that the user is a member and the more button has been pressed", () => {
  const game = {
    ...defaultGameProps,
    userIsMember: true,
    status: "staging",
  } as GameDisplay;
  beforeEach(() => {
    mockSetBottomSheet.mockClear();
    screen = render(<GameCard game={game} />);
    fireEvent.press(screen.getByLabelText("More button"));
  });
  describe("When the leave button is pressed", () => {
    beforeEach(() => {
      pressBottomSheetButton("leave");
    });
    test("The leaveGame action is dispatched", () => {
      expect(mockDispatch).toHaveBeenCalledWith({
        type: "LEAVE_GAME",
        gameId: game.id,
      });
    });
  });
});
