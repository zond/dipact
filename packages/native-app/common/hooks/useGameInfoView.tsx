import { service as service } from "..";

const useGameInfoView = (gameId: string) => {
  const getGameQuery = service.useGetGameQuery(gameId);
  return {
    query: getGameQuery,
  };
};

export default useGameInfoView;
