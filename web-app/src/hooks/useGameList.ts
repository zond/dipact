import { useContext, createContext } from "react";
import { useListGamesQuery } from "./service";
import { ApiResponse } from "./types";
import { Game as StoreGame } from "../store/types";
import isoCodes from "../utils/isoCodes";
import { getPhaseDisplay, phaseLengthDisplay, timeStrToDate } from "../utils/general";

export enum GameStatus {
  Started = "started",
  Staging = "staging",
  Finished = "finished",
}

export enum NationAllocation {
  Random = "Random",
  Preference = "Preference",
}

const nationAllocationMap: { [key: number]: NationAllocation } = {
  1: NationAllocation.Random,
};

interface Player {
  username: string;
  image: string;
}

export interface Game {
  chatDisabled: boolean;
  chatLanguage: string;
  chatLanguageDisplay: string;
  createdAtDisplay: string;
  deadlineDisplay: string;
  gameVariant: string;
  id: string;
  minQuickness: number | null;
  minRating: number | null;
  minReliability: number | null;
  name: string;
  nationAllocation: NationAllocation;
  numUnreadMessages: number;
  phaseSummary: string;
  players: Player[];
  privateGame: boolean;
  rulesSummary: string;
  started: boolean;
  variantNumNations: number;
}

interface IUseGameList extends ApiResponse {
  games: Game[];
}

const transformGame = (game: StoreGame): Game => {
  return {
    chatDisabled: true,
    chatLanguage: game.ChatLanguageISO639_1,
    chatLanguageDisplay: isoCodes.find(
      (code) => code.code === game.ChatLanguageISO639_1
    )?.name || "",
    createdAtDisplay: timeStrToDate(game.CreatedAt),
    deadlineDisplay: phaseLengthDisplay(game),
    gameVariant: game.Variant,
    id: game.ID,
    minQuickness: game.MinQuickness,
    minRating: game.MinRating,
    minReliability: game.MinReliability,
    name: game.Desc,
    nationAllocation: nationAllocationMap[game.NationAllocation],
    numUnreadMessages: 0,
    phaseSummary: getPhaseDisplay(game),
    players: game.Members.map((member) => ({ username: member.User.Name as string, image: member.User.Picture as string })),
    privateGame: game.Private,
    rulesSummary: game.Variant + " " + phaseLengthDisplay(game),
    started: game.Started,
    variantNumNations: 9,
  };
};

const useGameList = (my: boolean, gameStatus: GameStatus) => {
  const { isLoading, isError, isSuccess, data } = useListGamesQuery({
    my,
    gameStatus,
  });
  return {
    combinedQueryState: {
      isLoading,
      isError,
      isSuccess,
    },
    games: data?.map(transformGame) || [],
  };
};

export const useGameListContext = createContext<null | typeof useGameList>(
  null
);

const createDIContext = <T>() => createContext<null | T>(null);
export const useDIContext = createDIContext<typeof useGameList>();

const useGetHook = () => useContext(useDIContext) || useGameList;
const useDIHook = (my: boolean, gameStatus: GameStatus): IUseGameList =>
  useGetHook()(my, gameStatus);

export default useDIHook;
