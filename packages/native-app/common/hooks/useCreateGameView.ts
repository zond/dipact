import { useContext } from "react";
import { combineQueries, skipToken } from "../utils";
import { DiplicityApiContext } from "../store";

const useCreateGameView = () => {
  const api = useContext(DiplicityApiContext);
  const getUserQuery = api.useGetRootQuery(undefined);
  const listVariantsQuery = api.useListVariantsQuery(undefined);
  const getUserStatsQuery = api.useGetUserStatsQuery(
    getUserQuery.data?.id ?? skipToken
  );
  const createGameMutation = api.useCreateGameMutation();

  return {
    query: combineQueries({
      user: getUserQuery,
      userStats: getUserStatsQuery,
      variants: listVariantsQuery,
    }),
    actions: {
      createGame: createGameMutation,
    },
  };
};

export default useCreateGameView;
