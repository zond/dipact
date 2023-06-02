import { useContext } from "react";
import { DiplicityApiContext, ListGameFilters } from "../store";
import { combineQueries } from "../utils/query";

const useGameListView = (filters: ListGameFilters) => {
  const api = useContext(DiplicityApiContext);
  const listGamesQuery = api.useListGamesQuery(filters);
  const getRootQuery = api.useGetRootQuery(undefined);
  return combineQueries({
    games: listGamesQuery,
    user: getRootQuery,
  });
};

export default useGameListView;
