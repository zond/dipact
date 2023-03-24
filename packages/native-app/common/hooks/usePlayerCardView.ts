import { service as service } from "../store";
import { skipToken } from "../utils";

const usePlayerCardView = (userId: string | undefined) => {
  // If user ID is not provided, we use the current user's ID.
  const userQuery = service.useGetRootQuery(undefined);
  const id = userId || userQuery.data?.id;
  const userStatsQuery = service.useGetUserStatsQuery(id ?? skipToken);
  return {
    query: userStatsQuery,
  };
};

export default usePlayerCardView;
