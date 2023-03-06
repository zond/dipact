import { diplicityService as service } from "@diplicity/common";

export const useGameInfoView = (gameId: string) => {
  const getGameQuery = service.useGetGameV2Query(gameId);
  return {
    query: getGameQuery,
  };
};
