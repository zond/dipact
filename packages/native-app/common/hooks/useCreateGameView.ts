import { diplicityService as service } from "../store";
import { combineQueries, skipToken } from "../utils";

const useCreateGameView = () => {
  const getUserQuery = service.useGetRootV2Query(undefined);
  const listVariantsQuery = service.useListVariantsV2Query(undefined);
  const getUserStatsQuery = service.useGetUserStatsV2Query(
    getUserQuery.data?.id ?? skipToken
  );
  const createGameMutation = service.useCreateGameV2Mutation();

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
