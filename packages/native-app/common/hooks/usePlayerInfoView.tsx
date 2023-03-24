import { service as service } from "..";

const usePlayerInfoView = (gameId: string) => {
  const getGameQuery = service.useGetGameQuery(gameId);
  return {
    query: getGameQuery,
  };
};

export default usePlayerInfoView;
