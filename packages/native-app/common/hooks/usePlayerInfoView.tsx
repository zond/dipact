import { useContext } from "react";

import { DiplicityApiContext } from "../store";

const usePlayerInfoView = (gameId: string) => {
  const api = useContext(DiplicityApiContext);
  const getGameQuery = api.useGetGameQuery(gameId);
  return {
    query: getGameQuery,
  };
};

export default usePlayerInfoView;
