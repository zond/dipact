import { diplicityService as service } from "..";

const usePlayerInfoView = (gameId: string) => {
  const getGameQuery = service.useGetGameV2Query(gameId);
  return {
    query: getGameQuery,
  };
};

export default usePlayerInfoView;
