import { ApiError } from "../hooks/types";
import {
  getNationAbbreviation,
  getNationColor,
  getNationFlagLink,
} from "../utils/general";
import { diplicityService } from "./service";
import { RootState } from "./store";
import {
  Ban,
  Channel,
  ColorOverrides,
  Game,
  GameState,
  Messaging,
  MutationStatus,
  Player,
  User,
  UserConfig,
  UserStats,
  Variant,
} from "./types";

// TODO use memoized selectors

const getListVariantsSelector = () =>
  diplicityService.endpoints.listVariants.select(undefined);

const getGetRootSelector = () =>
  diplicityService.endpoints.getRoot.select(undefined);

export const selectColorOverrides = (state: RootState): ColorOverrides =>
  state.colorOverrides;

const selectUserStats = (state: RootState): UserStats | undefined => {
  const userId = selectUserId(state);
  if (!userId) return;
  const userStats =
    diplicityService.endpoints.getUserStats.select(userId)(state).data;
  return userStats;
};

const selectJoinedGames = (state: RootState): number | undefined => {
  const userStats = selectUserStats(state);
  console.log(userStats);
  return userStats?.JoinedGames || userStats?.PrivateStats?.JoinedGames;
};

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
): Variant | undefined => {
  const { data } = getListVariantsSelector()(state);
  return data?.find((variant) => variant.Name === variantName);
};

export const selectChannel = (
  state: RootState,
  gameId: string,
  channelId: string
): Channel | null => {
  const names = channelId.split(",");
  const channels =
    diplicityService.endpoints.listChannels.select(gameId)(state).data;
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
  const { data } = getGetRootSelector()(state);
  return data;
};

// TODO test
export const selectUserId = (state: RootState): string | undefined => {
  return selectUser(state)?.Id;
};

// TODO test
export const selectUserPicture = (state: RootState): string | undefined => {
  return selectUser(state)?.Picture;
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

export const selectVariantUnitSvg = (
  state: RootState,
  variantName: string,
  unitType: string
): string | undefined => {
  const endpoint = diplicityService.endpoints.getVariantUnitSVG;
  const selector = endpoint.select({ variantName, unitType });
  const typedState = state as RootState & { [key: string]: any }; // Note, weird TS stuff going on here
  const query = selector(typedState);
  return query.data;
};

export const selectVariantUnitSvgs = (
  state: RootState,
  variantName?: string,
  unitTypes?: string[]
): { [key: string]: string } => {
  if (!variantName || !unitTypes?.length) return {};
  const variantUnitSvgs: { [key: string]: string } = {};
  unitTypes.forEach((unitType) => {
    const svg = selectVariantUnitSvg(state, variantName, unitType);
    if (svg) {
      variantUnitSvgs[unitType] = svg;
    }
  });
  return variantUnitSvgs;
};

// TODO test
export const selectPhase = (state: RootState): null | number => {
  return state.phase;
};

// TODO test
const selectGameQuery = (
  state: RootState,
  gameId: string
) => {
  const endpoint = diplicityService.endpoints.getGame;
  const selector = endpoint.select(gameId);
  return selector(state);
}

// TODO test
export const selectGame = (
  state: RootState,
  gameId: string
): Game | undefined => {
  const query = selectGameQuery(state, gameId);
  return query.data;
};

// TODO test
export const selectGameState = (
  state: RootState,
  gameId: string,
  userId: string
): GameState | undefined => {
  const endpoint = diplicityService.endpoints.getGameState;
  const selector = endpoint.select({ gameId, userId });
  const query = selector(state);
  return query.data;
};

// TODO test
const selectUserBans = (state: RootState, userId: string) => {
  const endpoint = diplicityService.endpoints.listUserBans;
  const selector = endpoint.select(userId);
  const query = selector(state);
  return query.data;
};

const getIsBanned = (bans: Ban[], userId: string): boolean => {
  return bans?.some((ban) => ban.UserIds.includes(userId));
};

const getIsMuted = (gameState: GameState, nation: string): boolean => {
  if (!gameState.Muted) return false;
  return gameState.Muted.some((mutedNation) => mutedNation === nation);
};

// TODO test
export const selectVariantByGameId = (state: RootState, gameId: string): Variant | undefined => {
  const game = selectGame(state, gameId);
  const variant = game?.Variant;
  if (!variant) return;
  return selectVariant(state, variant);
}

// TODO test
export const selectPlayersFromGame = (
  state: RootState,
  gameId: string
): Player[] | undefined => {
  const game = selectGame(state, gameId);
  const currentUserId = selectUserId(state);
  if (!currentUserId || !game) return;
  const gameState = selectGameState(state, gameId, currentUserId);
  const bans = selectUserBans(state, currentUserId);
  if (!bans || !gameState) return;
  return game.Members.map((member) => {
    const user = member.User;
    return {
      id: user.Id as string,
      image: user.Picture as string,
      isMuted: getIsMuted(gameState, member.Nation),
      isCurrentUser: user.Id === currentUserId,
      isBanned: getIsBanned(bans, user.Id as string),
      nation: member.Nation,
      username: user.Name as string,
    };
  });
};

interface IGamePlayerView {
  error: ApiError;
  isError: boolean;
  isLoading: boolean;
  players: Player[];
  variantRules: string;
}

// TODO only view selectors should be exported
export const selectGamePlayersView = (state: RootState, gameId: string): IGamePlayerView => {
  const players = selectPlayersFromGame(state, gameId) || [];
  const variant = selectVariantByGameId(state, gameId);
  const variantRules = variant?.Rules || "";
  const getGameQuery = selectGameQuery(state, gameId);
  const isLoading = getGameQuery.isLoading;
  const isError = getGameQuery.isError;
  const error = getGameQuery.error;
  return {
    error,
    isError,
    isLoading,
    players,
    variantRules,
  }
}
