import Globals from "../Globals";
import { diplicityService } from "./service";
import { RootState } from "./store";
import {
	ColorOverrides,
	Messaging,
	MutationStatus,
	User,
	UserConfig,
	Variant,
} from "./types";

const DiplicitySender = "Diplicity";
const OttoURL = "https://diplicity-engine.appspot.com/img/otto.png";

export const selectColorOverrides = (state: RootState): ColorOverrides =>
	state.colorOverrides;

const selectJoinedGames = (state: RootState): number | undefined =>
	state.userStats.JoinedGames || state.userStats.PrivateStats?.JoinedGames;

export const selectHasPlayed = (state: RootState): boolean =>
	Boolean(selectJoinedGames(state));

export const selectMessaging = (state: RootState): Messaging => state.messaging;

export const selectToken = (state: RootState): string | undefined =>
	state.auth.token;

// TODO test
export const selectVariant = (state: RootState, variantName: string): Variant | null | undefined => {
	return diplicityService.endpoints.listVariants.select(undefined)(state).data?.find((variant) => variant.Name === variantName);
};

// TODO test
export const selectNationColor = (state: RootState, variantName: string, nationName: string): string => {
	const colorOverrides = Globals.colorOverrides as ColorOverrides;
	const variantColorOverrides = colorOverrides.variants[variantName];
	if (variantColorOverrides) {
		const nationColorOverride = variantColorOverrides[nationName];
		if (nationColorOverride) return nationColorOverride
	}
	const variant = selectVariant(state, variantName);
	const nationColors = variant?.NationColors;
	const nationColor = nationColors ? nationColors[nationName]: null;
	if (nationColor) return nationColor
	const nationNotInVariant = !variant?.Nations.includes(nationName);
	if (nationNotInVariant) {
		if (nationName === "Neutral") {
			return "#d0d0d0";
		}
		if (nationName === "Diplicity") {
			return "#000000";
		}
		throw Error(`Cannot find nation color for ${nationName} in variant ${variantName}`);
	}
	const index = variant?.Nations.indexOf(nationName);
	if (typeof index !== "undefined") return Globals.contrastColors[index];
	throw Error(`Cannot find nation color for ${nationName} in variant ${variantName}`);
}

// TODO test
export const selectNationAbbreviation = (state: RootState, variantName: string, nationName: string): string => {
	const variant = selectVariant(state, variantName);
	const nationAbbreviations = variant?.nationAbbreviations;
	if (!nationAbbreviations) return "";
	return nationAbbreviations[nationName] || "";
}

// TODO test
export const selectNationFlagLink = (state: RootState, variantName: string, nationName: string): string | undefined => {
	const variant = selectVariant(state, variantName);
	const links = variant?.Links;
	const linkObject = links ? links.find((link) => link.Rel === `flag-${nationName}`) : null;
    return nationName === DiplicitySender ? OttoURL : linkObject ? linkObject.URL : undefined;
}

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
