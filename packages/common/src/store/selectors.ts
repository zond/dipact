import { createSelector } from "@reduxjs/toolkit";
import {
  getNation,
  getNationAbbreviation,
  getNationColor,
  getNationFlagLink,
} from "../utils/general";
import { updateMap } from "../utils/map";
import { endpoints } from "./service";
import { RootState } from "./store";
import {
  Auth,
  Channel,
  ColorOverrides,
  CreateOrderDisplay,
  CreateOrderStep,
  MapState,
  Messaging,
  MutationStatus,
  OrderType,
  PlayerDisplay,
  Query,
  QueryMap,
  ReliabilityLabel,
  User,
  UserConfig,
  UserStats,
  Variant,
} from "./types";

// TODO use memoized selectors

const selectListVariants = (state: RootState) =>
  endpoints.listVariants.select(undefined)(state);

const selectListPhases = (state: RootState, gameId: string) =>
  endpoints.listPhases.select(gameId)(state);

const getGetRootSelector = () => endpoints.getRoot.select(undefined);

export const selectColorOverrides = (state: RootState): ColorOverrides =>
  state.colorOverrides;

const selectUserStats = (state: RootState): UserStats | undefined => {
  const userId = selectUserId(state);
  if (!userId) return;
  const userStats = endpoints.getUserStats.select(userId)(state).data;
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
  const channels = endpoints.listChannels.select(gameId)(state).data;
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
  return endpoints.getUserConfig.select(userId)(state).data;
};

const sortMutationsByTimestamp = (x: any, y: any) => {
  return y.startedTimeStamp - x.startedTimeStamp;
};

export const selectVariantUnitSvg = (
  state: RootState,
  variantName: string,
  unitType: string
): string | undefined => {
  const endpoint = endpoints.getVariantUnitSVG;
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
// TODO rename
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

const combineQueries = (
  queryMap: QueryMap
): [Omit<Query<any>, "data">, QueryMap] => {
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

export const selectGame = (state: RootState) => {
  const { newestPhaseId, gameId } = state.game;
  if (!newestPhaseId || !gameId) {
    throw Error("Called selectGame before gameId and newestPhaseId were set!");
  }
  return { gameId, newestPhaseId };
};

const selectGameId = (state: RootState) => {
  const { gameId } = state.game;
  return gameId;
};

// TODO test
export const selectGameObject = (state: RootState) => {
  const gameId = selectGameId(state);
  if (!gameId) return;
  const endpoint = endpoints.getGame;
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
  const endpoint = endpoints.listOptions;
  const selector = endpoint.select({ gameId, phaseId: phaseId.toString() });
  const query = selector(state);
  return query.data;
};

const selectState = (state: RootState): RootState => state;
const selectSecondParam = (_: RootState, second: string) => second;
// const selectThirdParam = (_: RootState, _second: any, third: string) => third;
// const selectFourthParam = (
//   _: RootState,
//   _second: any,
//   _third: any,
//   fourth: string
// ) => fourth;

// TODO test
export const selectPhaseIdFromGameId = (state: RootState) => {
  const game = selectGameObject(state);
  if (game && game.NewestPhaseMeta && game.NewestPhaseMeta.length)
    return game.NewestPhaseMeta[0].PhaseOrdinal;
  return undefined;
};

export const selectNewestPhaseId = (state: RootState) => {
  const game = selectGameObject(state);
  if (game && game.NewestPhaseMeta && game.NewestPhaseMeta.length)
    return game.NewestPhaseMeta[0].PhaseOrdinal;
  return undefined;
};

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
export const selectVariantFromGameId = (state: RootState) => {
  const game = selectGameObject(state);
  if (!game) return undefined;
  return selectVariant(state, game.Variant);
};

type ProvinceEntries = {
  [key: string]: {
    name: string;
    id: string;
  };
};

// TODO test
export const selectProvinceEntries = (
  state: RootState,
  variantName: string
) => {
  const variant = selectVariant(state, variantName);
  if (!variant) return undefined;
  return Object.entries(variant.ProvinceLongNames).reduce<
    Partial<ProvinceEntries>
  >((previous, [id, name]) => {
    previous[id] = { id, name };
    return previous;
  }, {});
};

// TODO test
export const selectSourceProvinces = (state: RootState) => {
  const game = selectGameObject(state);
  if (!game) return undefined;
  const variant = selectVariant(state, game.Variant);
  if (!variant) return undefined;
  const provinceEntries = selectProvinceEntries(state, variant.Name);
  const options = selectOptionsFromGameId(state, game.ID);
  if (!options || !provinceEntries) return undefined;
  return Object.keys(options).map((id) => provinceEntries[id]);
};

export const selectOrderTypes = (state: RootState, source: string) => {
  const game = selectGameObject(state);
  if (!game) return undefined;
  const options = selectOptionsFromGameId(state, game.ID);
  if (!options) return undefined;
  return Object.keys(options[source].Next);
};

export const selectAuxProvinces = (
  state: RootState,
  source: string,
  orderType: string
) => {
  const game = selectGameObject(state);
  if (!game) return undefined;
  const variant = selectVariant(state, game.Variant);
  if (!variant) return undefined;
  const provinceEntries = selectProvinceEntries(state, variant.Name);
  const options = selectOptionsFromGameId(state, game.ID);
  if (!options || !provinceEntries) return undefined;
  return Object.keys(options[source].Next[orderType].Next[source].Next).map(
    (id) => provinceEntries[id]
  );
};

export const selectTargetProvinces = (
  state: RootState,
  source: string,
  orderType: string
) => {
  const game = selectGameObject(state);
  if (!game) return undefined;
  const variant = selectVariant(state, game.Variant);
  if (!variant) return undefined;
  const provinceEntries = selectProvinceEntries(state, variant.Name);
  const options = selectOptionsFromGameId(state, game.ID);
  if (!options || !provinceEntries) return undefined;
  return Object.keys(options[source].Next[orderType].Next[source].Next).map(
    (id) => provinceEntries[id]
  );
};

export const selectAuxTargetProvinces = (
  state: RootState,
  source: string,
  orderType: string,
  aux: string
) => {
  const game = selectGameObject(state);
  if (!game) return undefined;
  const variant = selectVariant(state, game.Variant);
  if (!variant) return undefined;
  const provinceEntries = selectProvinceEntries(state, variant.Name);
  const options = selectOptionsFromGameId(state, game.ID);
  if (!options || !provinceEntries) return undefined;
  return Object.keys(
    options[source].Next[orderType].Next[source].Next[aux].Next
  ).map((id) => provinceEntries[id]);
};

export const selectCreateOrder = (state: RootState) => {
  return state.createOrder;
};

const mapProvinceDisplaysToOptions = (
  provinces: ({ name: string; id: string } | undefined)[] | undefined
): { value: string; label: string }[] => {
  if (!provinces) return [];
  return provinces
    .filter((p) => p)
    .map((province: { id: string; name: string }) => ({
      value: province.id,
      label: province.name,
    }));
};

const mapOrderTypesToOptions = (
  orderTypes: string[] | undefined
): { value: string; label: string }[] => {
  if (!orderTypes) return [];
  return orderTypes.map((orderType) => ({
    value: orderType,
    label: orderType,
  }));
};

export const selectCreateOrderOptions = (state: RootState) => {
  const step = selectCreateOrderStep(state);
  const createOrder = selectCreateOrder(state);
  switch (step) {
    case CreateOrderStep.SelectSource:
      return mapProvinceDisplaysToOptions(selectSourceProvinces(state));
    case CreateOrderStep.SelectType:
      return mapOrderTypesToOptions(
        selectOrderTypes(state, createOrder.source as string)
      );
    case CreateOrderStep.SelectAux:
      return mapProvinceDisplaysToOptions(
        selectAuxProvinces(
          state,
          createOrder.source as string,
          createOrder.type as OrderType
        )
      );
    case CreateOrderStep.SelectTarget:
      return mapProvinceDisplaysToOptions(
        selectTargetProvinces(
          state,
          createOrder.source as string,
          createOrder.type as OrderType
        )
      );
    case CreateOrderStep.SelectAuxTarget:
      return mapProvinceDisplaysToOptions(
        selectAuxTargetProvinces(
          state,
          createOrder.source as string,
          createOrder.type as OrderType,
          createOrder.aux as string
        )
      );
    default:
      return undefined;
  }
};

export const selectCreateOrderStep = (state: RootState): CreateOrderStep => {
  const { source, type, target, aux } = selectCreateOrder(state);
  if (!source) return CreateOrderStep.SelectSource;
  if (source && !type) return CreateOrderStep.SelectType;
  if (source && type && !target && type === OrderType.Move)
    return CreateOrderStep.SelectTarget;
  if (
    source &&
    type &&
    !aux &&
    [OrderType.Convoy, OrderType.Support].includes(type)
  )
    return CreateOrderStep.SelectAux;
  if (
    source &&
    type &&
    aux &&
    !target &&
    [OrderType.Convoy, OrderType.Support].includes(type)
  )
    return CreateOrderStep.SelectAuxTarget;
  return CreateOrderStep.Complete;
};

const selectProvinceName = (state: RootState, id: string) => {
  const game = selectGameObject(state);
  if (!game) return undefined;
  const variant = selectVariant(state, game.Variant);
  if (!variant) return undefined;
  const provinceEntries = selectProvinceEntries(state, variant.Name);
  if (!provinceEntries) return undefined;
  return provinceEntries[id]?.name;
};

export const selectCreateOrderDisplay = (
  state: RootState
): CreateOrderDisplay => {
  const { source, aux, target, type } = selectCreateOrder(state);
  const sourceDisplay = source ? selectProvinceName(state, source) : undefined;
  const auxDisplay = aux ? selectProvinceName(state, aux) : undefined;
  const targetDisplay = target ? selectProvinceName(state, target) : undefined;
  return {
    source: sourceDisplay,
    target: targetDisplay,
    aux: auxDisplay,
    type,
  };
};

export const selectCreateOrderIsComplete = (state: RootState): boolean => {
  const { type, target } = selectCreateOrder(state);
  if (target || type === OrderType.Hold) return true;
  return false;
};
export const selectCreateOrderParts = (state: RootState): string[] => {
  const { source, type, target, aux } = selectCreateOrder(state);
  const parts = [];
  if (source) parts.push(source);
  if (type) parts.push(type);
  if (aux) parts.push(aux);
  if (target) parts.push(target);
  return parts;
};

const selectPhaseObject = (state: RootState, phaseId: number) => {
  const gameId = selectGameId(state);
  if (!gameId) return undefined;
  const phases = selectListPhases(state, gameId).data;
  if (!phases) return undefined;
  return phases.find((p) => p.PhaseOrdinal === phaseId);
};

const selectMapState = (state: RootState) => {
  const phaseId = selectPhase(state);
  if (!phaseId) return undefined;
  const phase = selectPhaseObject(state, phaseId);
  const variant = selectVariantFromGameId(state);
  if (!phase || !variant) return undefined;

  const provinces: MapState["provinces"] = phase.SCs.map(
    ({ Province, Owner }) => ({
      id: Province,
      fill: getNation(Owner, variant).color,
      highlight: false,
    })
  );
  const units: MapState["units"] = phase.Units.map(({ Province, Unit }) => ({
    province: Province,
    fill: getNation(Unit.Nation, variant).color,
    type: Unit.Type,
  }));

  const mapState: MapState = {
    provinces,
    units,
    orders: [],
  };
  return mapState;
};

export const selectMapSvgQuery = (state: RootState) => {
  const variant = selectVariantFromGameId(state);
  const mapState = selectMapState(state);
  if (!variant || !mapState)
    return {
      isLoading: true,
      isError: false,
      data: undefined,
    };
  const variantSvgQuery = endpoints.getVariantSVG.select(variant.Name)(state);
  const armySvgQuery = endpoints.getVariantUnitSVG.select({
    variantName: variant?.Name,
    unitType: "Army",
  })(state);
  const fleetSvgQuery = endpoints.getVariantUnitSVG.select({
    variantName: variant?.Name,
    unitType: "Fleet",
  })(state);

  const isLoading =
    variantSvgQuery.isLoading ||
    armySvgQuery.isLoading ||
    fleetSvgQuery.isLoading;
  const isError =
    variantSvgQuery.isError || armySvgQuery.isError || fleetSvgQuery.isError;

  if (!variantSvgQuery.data || !armySvgQuery.data || !fleetSvgQuery.data)
    return {
      isLoading,
      isError,
      data: undefined,
    };

  const data = updateMap(
    variantSvgQuery.data,
    armySvgQuery.data,
    fleetSvgQuery.data,
    mapState
  );
  return {
    isLoading,
    isError,
    data,
  };
};

export const selectMapView = (state: RootState) => {
  const { data, isLoading, isError } = selectMapSvgQuery(state);
  return {
    data,
    isLoading,
    isError,
  };
};

const selectUserStatsQuery = (state: RootState, id: string) => {
  return endpoints.getUserStats.select(id)(state);
};

const getReliabilityLabel = (reliability: number): ReliabilityLabel => {
  if (reliability > 0.5) return "commited";
  if (reliability < -0.5) return "disengaged";
  return "uncommited";
};

const createPlayerDisplay = (stats: UserStats): PlayerDisplay => ({
  id: stats.User.Id,
  username: stats.User.Name,
  src: stats.User.Picture,
  stats: {
    reliabilityRating: stats.Reliability,
    reliabilityLabel: getReliabilityLabel(stats.Reliability),
    numPlayedGames: stats.StartedGames,
    numWonGames: stats.SoloGames,
    numDrawnGames: stats.DIASGames,
    numAbandonedGames: stats.DroppedGames,
  },
});

export const selectPlayerDisplay = (
  state: RootState,
  id: string
): Query<PlayerDisplay> => {
  const stats = selectUserStatsQuery(state, id);
  return {
    isLoading: stats.isLoading,
    isError: stats.isError,
    isSuccess: stats.isSuccess,
    data: stats.data ? createPlayerDisplay(stats.data) : null,
  };
};
