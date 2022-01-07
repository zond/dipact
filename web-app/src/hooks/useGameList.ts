import { useContext, createContext, useEffect, useState } from "react";
import { useGetRootQuery, useListGamesQuery } from "./service";
import { ApiError } from "./types";
import { Game as StoreGame, User } from "../store/types";
import isoCodes from "../utils/isoCodes";
import {
  getPhaseDisplay,
  phaseLengthDisplay,
  timeStrToDate,
} from "../utils/general";
import { ListGameFilters } from "../store/service";
import tk from "../translations/translateKeys";

// TODO move to types
export enum GameStatus {
  Started = "started",
  Staging = "staging",
  Finished = "finished",
}

// TODO move to types
export enum NationAllocation {
  Random = "Random",
  Preference = "Preference",
}

// TODO move to types
export const nationAllocationMap: { [key: number]: NationAllocation } = {
  0: NationAllocation.Random,
  1: NationAllocation.Preference,
};

export const nationAllocationTranslations: { [key: string]: string } = {
  [NationAllocation.Random]: tk.NationAllocationOptionsRandom,
  [NationAllocation.Preference]: tk.NationAllocationOptionsPreference,
}

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
  failedRequirements: string[];
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
  userIsMember: boolean;
  userIsGameMaster: boolean;
  variantNumNations: number;
}

interface IUseGameList {
  games: Game[];
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  isSuccess: boolean;
  error?: ApiError;
}

const transformGame = (game: StoreGame, user: User): Game => {
  const userIsGameMaster = game.GameMaster.Id === user.Id;
  const userIsMember = Boolean(
    game.Members.find((member) => member.User.Id === user.Id)
  );

  return {
    chatDisabled: game.DisablePrivateChat,
    chatLanguage: game.ChatLanguageISO639_1,
    chatLanguageDisplay:
      isoCodes.find((code) => code.code === game.ChatLanguageISO639_1)?.name ||
      "",
    createdAtDisplay: timeStrToDate(game.CreatedAt),
    deadlineDisplay: phaseLengthDisplay(game),
    failedRequirements: game.FailedRequirements || [],
    gameVariant: game.Variant,
    id: game.ID,
    minQuickness: game.MinQuickness,
    minRating: game.MinRating,
    minReliability: game.MinReliability,
    name: game.Desc,
    nationAllocation: nationAllocationMap[game.NationAllocation],
    numUnreadMessages: 0,
    phaseSummary: getPhaseDisplay(game),
    players: game.Members.map((member) => ({
      username: member.User.Name as string,
      image: member.User.Picture as string,
    })),
    privateGame: game.Private,
    rulesSummary: game.Variant + " " + phaseLengthDisplay(game),
    started: game.Started,
    userIsMember,
    userIsGameMaster,
    variantNumNations: 9,
  };
};

const useGameList = (filters: ListGameFilters) => {
  const userQuery = useGetRootQuery(undefined);
  const { isLoading, isError, isSuccess, isFetching, data } = useListGamesQuery(
    filters
  );
  const [games, setGames] = useState<Game[]>([]);

  useEffect(() => {
    if (userQuery.isSuccess && isSuccess && userQuery.data) {
      setGames(
        data?.map((game) => transformGame(game, userQuery.data as User)) || []
      );
    }
  }, [userQuery, data, isSuccess]);
  return {
    isLoading,
    isError,
    isSuccess,
    isFetching,
    games,
  };
};

export const useGameListContext = createContext<null | typeof useGameList>(
  null
);

const createDIContext = <T>() => createContext<null | T>(null);
export const useDIContext = createDIContext<typeof useGameList>();

const useGetHook = () => useContext(useDIContext) || useGameList;
const useDIHook = (filters: ListGameFilters): IUseGameList =>
  useGetHook()(filters);

export default useDIHook;
