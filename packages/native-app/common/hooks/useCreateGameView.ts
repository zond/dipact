import { service as service } from "../store";
import { combineQueries, skipToken } from "../utils";

const useCreateGameView = () => {
  const getUserQuery = service.useGetRootQuery(undefined);
  const listVariantsQuery = service.useListVariantsQuery(undefined);
  const getUserStatsQuery = service.useGetUserStatsQuery(
    getUserQuery.data?.id ?? skipToken
  );
  const createGameMutation = service.useCreateGameMutation();

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
