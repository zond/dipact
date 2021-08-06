import { RootState } from "./store";
import { ColorOverrides, Messaging, User } from "./types";

export const selectColorOverrides = (state: RootState): ColorOverrides =>
	state.colorOverrides;

const selectJoinedGames = (state: RootState): number | undefined =>
	state.userStats.JoinedGames || state.userStats.PrivateStats?.JoinedGames;

export const selectHasPlayed = (state: RootState): boolean =>
	Boolean(selectJoinedGames(state));

export const selectMessaging = (state: RootState): Messaging =>
	state.messaging;

export const selectToken = (state: RootState): string | undefined =>
	state.auth.token;

export const selectUser = (state: RootState): User => state.user;

export const selectUserId = (state: RootState): string | undefined => state.user.Id;
