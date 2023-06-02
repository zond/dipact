import { useContext } from "react";

import { combineQueries } from "../utils/query";
import { DiplicityApiContext } from "../store";

const useVariantInfoView = (gameId: string) => {
  const api = useContext(DiplicityApiContext);
  const getGameQuery = api.useGetGameQuery(gameId);
  const listVariantsQuery = api.useListVariantsQuery(undefined);
  return {
    query: combineQueries({
      game: getGameQuery,
      variants: listVariantsQuery,
    }),
  };
};

export default useVariantInfoView;
