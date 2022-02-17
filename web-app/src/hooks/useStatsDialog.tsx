import { createContext, useContext, useEffect } from "react";
import { PageName } from "../store/ui";
import {
  useLazyGetUserStatsQuery,
  useLazyGetRootQuery,
  useLazyGetGameQuery,
  useLazyGetGameStateQuery,
  useLazyListUserBansQuery,
  useDeleteBanMutation,
  useCreateBanMutation,
} from "./service";
import { useLazyPageLoad } from "./usePageLoad";
import { ApiError } from "./types";
import { mergeErrors } from "./utils";

export interface IUseStatsDialog {
  banIsLoading: boolean;
  isBanned?: boolean;
  isCurrentUser?: boolean;
  isLoading: boolean;
  isMuted?: boolean;
  error: ApiError | null;
  isError: boolean;
  hated?: number;
  hater?: number;
  nation?: string;
  ranking?: number;
  rating?: number;
  ratingPercentile?: number;
  reliability?: number;
  quickness?: number;
  showIsMuted: boolean;
  toggleBanned: () => void;
  toggleMuted: () => void;
  username?: string;
  joinedGames?: number;
  startedGames?: number;
  finishedGames?: number;
  abandonedGames?: number;
  soloWins?: number;
  draws?: number;
  eliminations?: number;
}

export const useStatsDialog = (
  userId?: string,
  gameId?: string
): IUseStatsDialog => {
  const pageLoadTrigger = useLazyPageLoad(PageName.StatsDialog);
  const [getUserStatsTrigger, getUserStatsQuery] = useLazyGetUserStatsQuery();
  const [getUserTrigger, getUserQuery] = useLazyGetRootQuery();
  const [getGameTrigger, getGameQuery] = useLazyGetGameQuery();
  const [getGameStateTrigger, getGameStateQuery] = useLazyGetGameStateQuery();
  const [getUserBansTrigger, getUserBansQuery] = useLazyListUserBansQuery();
  const [deleteBan, deleteBanQuery] = useDeleteBanMutation();
  const [createBan, createBanQuery] = useCreateBanMutation();

  const isLoading =
    getUserBansQuery.isLoading ||
    getUserQuery.isLoading ||
    getUserStatsQuery.isLoading ||
    getGameQuery.isLoading ||
    getGameStateQuery.isLoading;

  const isError =
    getUserBansQuery.isError ||
    getUserQuery.isError ||
    getUserStatsQuery.isError ||
    getGameQuery.isError ||
    getGameStateQuery.isError;

  const banIsLoading = deleteBanQuery.isLoading || createBanQuery.isLoading;

  const error = isError
    ? mergeErrors(
        getUserBansQuery.error as ApiError,
        getUserQuery.error as ApiError,
        getUserStatsQuery.error as ApiError,
        getGameQuery.error as ApiError,
        getGameStateQuery.error as ApiError
      )
    : null;

  const userStats = getUserStatsQuery.data;
  const user = userStats?.User;
  const currentUser = getUserQuery.data;
  const currentUserId = currentUser?.Id;
  const currentUserBans = getUserBansQuery.data;

  useEffect(() => {
    if (userId) {
      pageLoadTrigger();
      getUserStatsTrigger(userId);
      getUserTrigger(undefined);
      if (gameId) {
        getGameTrigger(gameId);
        getGameStateTrigger({ gameId, userId });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, gameId]);

  useEffect(() => {
    if (currentUserId) getUserBansTrigger(currentUserId);
  }, [getUserBansTrigger, currentUserId]);

  const game = getGameQuery.data;

  const nation = getGameQuery.data?.Members.find(
    (member) => member.User?.Id === user?.Id
  )?.Nation;
  const isMuted = Boolean(
    nation && getGameStateQuery.data?.Muted?.includes(nation)
  );
  const higherRatedCount = userStats?.TrueSkill?.HigherRatedCount;
  const ranking = higherRatedCount ? higherRatedCount + 1 : undefined;
  const ratingPercentile = 10;
  const showIsMuted = Boolean(game);
  const isCurrentUser = user?.Id === currentUser?.Id;
  const isBanned =
    (currentUserBans?.some((ban) => ban.UserIds.includes(user?.Id || "")) &&
      !isCurrentUser) ||
    false;
  const rating = userStats?.TrueSkill?.Rating;
  const reliability = userStats?.Reliability;
  const quickness = userStats?.Quickness;
  const hated = userStats?.Hated;
  const hater = userStats?.Hater;
  const username = user?.Name;
  const joinedGames = userStats?.JoinedGames;
  const startedGames = userStats?.StartedGames;
  const finishedGames = userStats?.FinishedGames;
  const abandonedGames = userStats?.DroppedGames;
  const soloWins = userStats?.SoloGames;
  const draws = userStats?.DIASGames;
  const eliminations = userStats?.EliminatedGames;

  // TODO feedback
  const toggleBanned = () => {
    const currentUserId = currentUser?.Id;
    const bannedUserId = user?.Id;
    if (currentUserId && bannedUserId) {
      if (isBanned) {
        deleteBan({ userId: currentUserId, bannedUserId });
      } else {
        createBan({ userId: currentUserId, bannedUserId })
      }
    }
  };

  // TODO implement
  const toggleMuted = () => {};

  return {
    abandonedGames,
    banIsLoading,
    draws,
    eliminations,
    finishedGames,
    error,
    hated,
    hater,
    isBanned,
    isCurrentUser,
    isError,
    isLoading,
    isMuted,
    joinedGames,
    nation,
    quickness,
    ranking,
    rating,
    ratingPercentile,
    reliability,
    showIsMuted,
    soloWins,
    startedGames,
    toggleBanned,
    toggleMuted,
    username,
  };
};

// Create DI context
const createDIContext = <T,>() => createContext<null | T>(null);
export const useDIContext = createDIContext<typeof useStatsDialog>();

// Create function to represent real or DI'd hook
const useGetHook = () => useContext(useDIContext) || useStatsDialog;
const useDIHook = (userId?: string, gameId?: string): IUseStatsDialog => {
  return useGetHook()(userId, gameId);
};

// Export as default, your component can't tell the difference
export default useDIHook;

export const statsDialogDecorator = (values: IUseStatsDialog) => {
  return (Component: () => JSX.Element) => (
    <useDIContext.Provider value={() => values}>
      <Component />
    </useDIContext.Provider>
  );
};
