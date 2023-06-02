import { useContext } from "react";
import { DiplicityApiContext } from "../store/diplicity/diplicity.provider";

const useGameInfoView = (gameId: string) => {
  const { useGetGameQuery } = useContext(DiplicityApiContext);
  const getGameQuery = useGetGameQuery(gameId);
  return {
    query: getGameQuery,
  };
};

export default useGameInfoView;
