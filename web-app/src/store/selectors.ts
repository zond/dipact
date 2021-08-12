import { diplicityService } from "./service";
import { RootState } from "./store";
import {
	ColorOverrides,
	Messaging,
	MutationStatus,
	User,
	UserConfig,
} from "./types";

export const selectColorOverrides = (state: RootState): ColorOverrides =>
	state.colorOverrides;

const selectJoinedGames = (state: RootState): number | undefined =>
	state.userStats.JoinedGames || state.userStats.PrivateStats?.JoinedGames;

export const selectHasPlayed = (state: RootState): boolean =>
	Boolean(selectJoinedGames(state));

export const selectMessaging = (state: RootState): Messaging => state.messaging;

export const selectToken = (state: RootState): string | undefined =>
	state.auth.token;

export const selectUser = (state: RootState): User | null | undefined => {
	return diplicityService.endpoints.getRoot.select(undefined)(state).data
		?.Properties?.User;
};

// TODO test
export const selectUserId = (state: RootState): string | undefined => {
	return selectUser(state)?.Id;
};

export const selectUserConfig = (state: RootState): UserConfig | undefined => {
	const userId = selectUserId(state);
	if (!userId) return;
	return diplicityService.endpoints.getUserConfig.select(userId)(state).data;
};

const sortMutationsByTimestamp = (x: any, y: any) => {
	return y.startedTimeStamp - x.startedTimeStamp;
};

export const selectUpdateUserConfigStatus = (
	state: RootState
): MutationStatus => {
	const defaultResponse = { isLoading: false, isError: false };
	const userId = selectUserId(state);
	if (!userId) return defaultResponse;
	const { mutations } = state.diplicityService;
	const mutation = Object.values(mutations || {})
		.sort(sortMutationsByTimestamp)
		.find(
			(mutation: any) =>
				mutation.originalArgs.UserId === userId &&
				mutation.endpointName === "updateUserConfig"
		);
	return {
		isLoading: mutation?.status === "pending",
		isError: false, // TODO
	};
};
