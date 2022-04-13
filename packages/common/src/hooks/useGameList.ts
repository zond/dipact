import { GameDisplay } from "../store/types";
import { ListGameFilters } from "../store/service";
import { useListGamesQuery } from "./service";

interface IUseGameList {
  games: GameDisplay[];
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  isSuccess: boolean;
  error?: any;
}

const useGameList = (filters: ListGameFilters): IUseGameList => {
  const { data: games, ...query } = useListGamesQuery(filters);
  return {
    games,
    ...query,
  };
};

export default useGameList;
