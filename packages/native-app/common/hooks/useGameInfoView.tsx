import { diplicityService as service } from "..";

const useGameInfoView = (gameId: string) => {
  const getGameQuery = service.useGetGameV2Query(gameId);
  return {
    query: getGameQuery,
  };
};

export default useGameInfoView;
