import { service as service, ListGameFilters } from "..";
import { combineQueries } from "../utils/query";

const useGameListView = (filters: ListGameFilters) => {
  const listGamesQuery = service.useListGamesQuery(filters);
  const getRootQuery = service.useGetRootQuery(undefined);
  return combineQueries({
    games: listGamesQuery,
    user: getRootQuery,
  });
};

export default useGameListView;
