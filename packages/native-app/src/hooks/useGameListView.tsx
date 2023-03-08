import {
  diplicityService as service,
  ListGameFilters,
} from "@diplicity/common";
import { combineQueries } from "../utils/query";

const useGameListView = (filters: ListGameFilters) => {
  const listGamesQuery = service.useListGamesV2Query(filters);
  const getRootQuery = service.useGetRootV2Query(undefined);
  return combineQueries({
    games: listGamesQuery,
    user: getRootQuery,
  });
};

export default useGameListView;
