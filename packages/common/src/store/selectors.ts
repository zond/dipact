import { createSelector, Selector } from "@reduxjs/toolkit";
import {
  getNationAbbreviation,
  getNationColor,
  getNationFlagLink,
} from "../utils/general";
import { diplicityService } from "./service";
import { RootState } from "./store";
import {
  Auth,
  Channel,
  ColorOverrides,
  Game,
  Messaging,
  MutationStatus,
  OrderType,
  ProvinceDisplay,
  Query,
  QueryMap,
  User,
  UserConfig,
  UserStats,
  Variant,
} from "./types";

// TODO use memoized selectors

const selectListVariants = (state: RootState) =>
  diplicityService.endpoints.listVariants.select(undefined)(state);

const selectListPhases = (state: RootState, gameId: string) =>
  diplicityService.endpoints.listPhases.select(gameId)(state);

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
  return userStats?.JoinedGames || userStats?.PrivateStats?.JoinedGames;
};

export const selectHasPlayed = (state: RootState): boolean =>
  Boolean(selectJoinedGames(state));

export const selectMessaging = (state: RootState): Messaging => state.messaging;

export const selectIsLoggedIn = (state: RootState): boolean =>
  state.auth.isLoggedIn;

export const selectVariant = (state: RootState, variantName: string) => {
  const { data } = selectListVariants(state);
  return data?.find((variant) => variant.Name === variantName) || undefined;
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

// TODO make generic
// TODO test
export const selectCreateGameStatus = (state: RootState): MutationStatus => {
  const defaultResponse = {
    isLoading: false,
    isError: false,
    isSuccess: false,
  };
  const userId = selectUserId(state);
  if (!userId) return defaultResponse;
  const { mutations } = state.diplicityService;
  const mutation = Object.values(mutations || {})
    .sort(sortMutationsByTimestamp)
    .find((mutation: any) => mutation.endpointName === "createGame");
  return {
    isLoading: mutation?.status === "pending",
    isSuccess: mutation?.status === "fulfilled",
    isError: false, // TODO
  };
};

export const selectUpdateUserConfigStatus = (
  state: RootState
): MutationStatus => {
  const defaultResponse = {
    isLoading: false,
    isError: false,
    isSuccess: false,
  };
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
    isSuccess: mutation?.status === "fulfilled",
    isError: false, // TODO
  };
};

// TODO test
// TODO move
const transformVariant = (variant: Variant) => ({
  nations: variant.Nations,
});

// TODO test
export const selectNationPreferencesDialogView = (
  state: RootState,
  variantName: string
) =>
  createSelector(
    (state: RootState) => selectVariant(state, variantName),
    (variant) => {
      if (!variant) return { nations: [] };
      const { nations } = transformVariant(variant);
      return { nations };
    }
  )(state);

// TODO test
export const selectAuth = (state: RootState): Auth => state.auth;

// TODO test
export const selectToken = (state: RootState) =>
  createSelector(selectAuth, (auth) => auth.token)(state);

const combineQueries = (queryMap: QueryMap): [Query, QueryMap] => {
  const queries = Object.values(queryMap);
  return [
    {
      isError: queries.some((query) => query.isError),
      isLoading: queries.some((query) => query.isLoading),
      isSuccess: queries.every((query) => query.isSuccess),
    },
    queryMap,
  ];
};

export const selectOrdersView = (state: RootState, gameId: string) =>
  createSelector(
    (state: RootState) => selectListVariants(state),
    (state: RootState) => selectListPhases(state, gameId),
    (variantsQuery, phasesQuery) => {
      const combinedQueries = combineQueries({
        variants: variantsQuery,
        phases: phasesQuery,
      });
      return combinedQueries;
    }
  )(state);

// TODO test
export const selectGame = (state: RootState, gameId: string) => {
  const endpoint = diplicityService.endpoints.getGame;
  const selector = endpoint.select(gameId);
  const query = selector(state);
  return query.data;
};

// TODO test
export const selectOptions = (
  state: RootState,
  gameId: string,
  phaseId: number
) => {
  const endpoint = diplicityService.endpoints.listOptions;
  const selector = endpoint.select({ gameId, phaseId: phaseId.toString() });
  const query = selector(state);
  return query.data;
};

// TODO test
export const selectPhaseIdFromGameId = createSelector(selectGame, (game) => {
  if (game && game.NewestPhaseMeta && game.NewestPhaseMeta.length)
    return game.NewestPhaseMeta[0].PhaseOrdinal;
  return undefined;
});

const selectState = (state: RootState): RootState => state;
const selectSecondParam = (_: RootState, second: string) => second;
const selectThirdParam = (_: RootState, _second: any, third: string) => third;
const selectFourthParam = (
  _: RootState,
  _second: any,
  _third: any,
  fourth: string
) => fourth;

// TODO test
const selectOptionsFromGameId = createSelector(
  selectState,
  selectSecondParam,
  selectPhaseIdFromGameId,
  (state, gameId, phaseId) => {
    if (!phaseId) return undefined;
    return selectOptions(state, gameId, phaseId);
  }
);

// // TODO test
// // export const selectSourceProvinces = (state: RootState, gameId: string) => {
// //   createSelector(
// //     (state: RootState) => selectGame(state, gameId),
// //     (game) => game
// //   );
// // };

// TODO test
export const selectVariantFromGameId = createSelector(
  selectState,
  selectGame,
  (state, game) => {
    if (!game) return undefined;
    return selectVariant(state, game.Variant);
  }
);

type ProvinceEntries = { [key: string]: Partial<ProvinceDisplay> };

// TODO test
export const selectProvinceEntries = createSelector(
  selectVariantFromGameId,
  (variant) => {
    if (!variant) return undefined;
    return Object.entries(variant.ProvinceLongNames).reduce<ProvinceEntries>(
      (previous, [id, name]) => {
        previous[id] = { id, name };
        return previous;
      },
      {}
    );
  }
);

// TODO test
export const selectProvince = createSelector(
  selectProvinceEntries,
  selectThirdParam,
  (provinceEntries, provinceId) => {
    if (!provinceEntries) return undefined;
    return provinceEntries[provinceId];
  }
);

// TODO test
export const selectSourceProvinces = createSelector(
  selectProvinceEntries,
  selectOptionsFromGameId,
  (provinceEntries, options) => {
    if (!options || !provinceEntries) return undefined;
    return Object.keys(options).map((id) => provinceEntries[id]);
  }
);

// TODO test
export const selectOrderTypes = createSelector(
  selectOptionsFromGameId,
  selectThirdParam,
  (options, provinceId) => {
    if (!options) return undefined;
    return Object.keys(options[provinceId].Next);
  }
);

// TODO test
export const selectAuxProvinces = createSelector(
  selectProvinceEntries,
  selectOptionsFromGameId,
  (_: RootState, orderType: OrderType.Convoy | OrderType.Support) => orderType,
  selectThirdParam,
  (provinceEntries, options, orderType, sourceId) => {
    if (!options || !provinceEntries) return undefined;
    return Object.keys(
      options[sourceId].Next[orderType].Next[sourceId].Next
    ).map((id) => provinceEntries[id]);
  }
);

// TODO test
export const selectAuxTargetProvince = createSelector(
  selectProvinceEntries,
  selectOptionsFromGameId,
  (_: RootState, orderType: OrderType.Convoy | OrderType.Support) => orderType,
  selectThirdParam,
  selectFourthParam,
  (provinceEntries, options, orderType, sourceId, auxId) => {
    if (!options || !provinceEntries) return undefined;
    return Object.keys(
      options[sourceId].Next[orderType].Next[sourceId].Next[auxId].Next
    ).map((id) => provinceEntries[id]);
  }
);
