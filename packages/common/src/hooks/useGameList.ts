import { useContext, createContext, useEffect, useState } from "react";
import { diplicityService } from "../store/service";
import { Game as StoreGame, User, GameDisplay } from "../store/types";
import { ListGameFilters } from "../store/service";
import {
  getPhaseDisplay,
  nationAllocationMap,
  phaseLengthDisplay,
  timeStrToDate,
} from "../utils/general";
import isoCodes from "../utils/isoCodes";

interface IUseGameList {
  games: GameDisplay[];
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  isSuccess: boolean;
  error?: any;
}

const transformGame = (game: StoreGame, user: User): GameDisplay => {
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
  const userQuery = diplicityService.useGetRootQuery(undefined);
  const { isLoading, isError, isSuccess, isFetching, data } =
    diplicityService.useListGamesQuery(filters);
  const [games, setGames] = useState<GameDisplay[]>([]);

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
