import { diplicityService as service } from "..";

import { combineQueries } from "../utils/query";

const useVariantInfoView = (gameId: string) => {
  const getGameQuery = service.useGetGameV2Query(gameId);
  const listVariantsQuery = service.useListVariantsV2Query(undefined);
  return {
    query: combineQueries({
      game: getGameQuery,
      variants: listVariantsQuery,
    }),
  };
};

export default useVariantInfoView;
