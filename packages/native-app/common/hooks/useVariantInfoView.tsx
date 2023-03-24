import { service as service } from "..";

import { combineQueries } from "../utils/query";

const useVariantInfoView = (gameId: string) => {
  const getGameQuery = service.useGetGameQuery(gameId);
  const listVariantsQuery = service.useListVariantsQuery(undefined);
  return {
    query: combineQueries({
      game: getGameQuery,
      variants: listVariantsQuery,
    }),
  };
};

export default useVariantInfoView;
