import { User } from "../store/types";
import { useAppSelector } from "./store";

export const useHasPlayed = (): boolean => {
  const joinedGames = useAppSelector(
    (state) =>
      state.userStats.JoinedGames || state.userStats.PrivateStats?.JoinedGames
  );
  return Boolean(joinedGames);
};

export const useUser = (): User => {
  return useAppSelector((state) => state.user);
};
