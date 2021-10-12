import {
  getNationAbbreviation,
  getNationColor,
  getNationFlagLink,
} from "../utils/general";
import { diplicityService } from "./service";
import { RootState } from "./store";
import {
  Channel,
  ColorOverrides,
  Messaging,
  MutationStatus,
  User,
  UserConfig,
  Variant,
} from "./types";

export const selectColorOverrides = (state: RootState): ColorOverrides =>
  state.colorOverrides;

const selectJoinedGames = (state: RootState): number | undefined =>
  state.userStats.JoinedGames || state.userStats.PrivateStats?.JoinedGames;

export const selectHasPlayed = (state: RootState): boolean =>
  Boolean(selectJoinedGames(state));

export const selectMessaging = (state: RootState): Messaging => state.messaging;

export const selectIsLoggedIn = (state: RootState): boolean =>
  state.auth.isLoggedIn;

export const selectToken = (state: RootState): string | undefined =>
  state.auth.token;

export const selectVariant = (
  state: RootState,
  variantName: string
): Variant | null => {
  return (
    diplicityService.endpoints.listVariants
      .select(undefined)(state)
      .data?.find((variant) => variant.Name === variantName) || null
  );
};

export const selectChannel = (
  state: RootState,
  gameId: string,
  channelId: string
): Channel | null => {
  const names = channelId.split(",");
  const channels = diplicityService.endpoints.listChannels.select(gameId)(state)
    .data;
  if (!channels) return null;
  const sortedNames = names.sort();
  const foundChannel =
    channels.find((channel) => {
      const sortedMembers = channel.Members.slice().sort();
      return JSON.stringify(sortedMembers) === JSON.stringify(sortedNames);
    }) || null;
  return foundChannel;
};

export const selectNationColor = (
  state: RootState,
  variantName: string,
  nation: string
): string => {
  const variant = selectVariant(state, variantName);
  if (!variant) throw Error(`Could not find variant called ${variantName}`);
  return getNationColor(variant, nation);
};

export const selectNationAbbreviation = (
  state: RootState,
  variantName: string,
  nation: string
): string => {
  const variant = selectVariant(state, variantName);
  if (!variant) throw Error(`Could not find variant called ${variantName}`);
  return getNationAbbreviation(variant, nation);
};

export const selectNationFlagLink = (
  state: RootState,
  variantName: string,
  nation: string
): string | undefined => {
  const variant = selectVariant(state, variantName);
  if (!variant) throw Error(`Could not find variant called ${variantName}`);
  return getNationFlagLink(variant, nation);
};

export const selectUser = (state: RootState): User | null | undefined => {
  return diplicityService.endpoints.getRoot.select(undefined)(state).data;
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

// TODO test
export const selectPhase = (state: RootState): null | number => {
  return state.phase;
};
