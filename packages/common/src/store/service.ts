/* eslint-disable no-restricted-globals */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  convertMinutesToLabel,
  getLanguage,
  getNationAllocation,
  timeStrToDate,
} from "../utils/general";

import { selectToken } from "./selectors";
import {
  Headers,
  NewGame,
  Variant,
  UserConfig,
  Message,
  Game,
  PhaseState,
  Phase,
  Channel,
  User,
  Member,
  GameMasterInvitation,
  UserStats,
  GameState,
  Ban,
  UserRatingHistogram,
  Corroboration,
  Options,
  ApiResponse,
  ForumMail,
  ListApiResponse,
  TransformedVariant,
  TransformedUser,
  TransformedGame,
} from "./types";
import {
  addNationAbbreviationsToVariant,
  sortVariantResponse,
  sortListChannels,
  sortMessages,
  createNationAbbreviation,
} from "./utils";

export enum TagType {
  UserConfig = "UserConfig",
  Messages = "Messages",
  PhaseState = "PhaseState",
  Game = "Game",
  ListGames = "ListGames",
}

export interface ListGameFilters {
  my: boolean;
  status: string;
  mastered: boolean;
}

export const diplicityServiceURL = "https://diplicity-engine.appspot.com/";
const serviceURL = diplicityServiceURL;

const extractProperties = <T>(response: ApiResponse<T>) => response.Properties;
const extractPropertiesList = <T>(response: ListApiResponse<T>) => {
  return response.Properties.map((response) => response.Properties);
};

export const diplicityService = createApi({
  tagTypes: [
    TagType.UserConfig,
    TagType.Messages,
    TagType.Game,
    TagType.ListGames,
    TagType.PhaseState,
  ],
  reducerPath: "diplicityService",
  baseQuery: fetchBaseQuery({
    baseUrl: serviceURL,
    prepareHeaders: (headers, { getState }) => {
      const token = selectToken(getState() as any);
      // If we have a token set in state, let's assume that we should be passing it.
      if (token) {
        headers.set(Headers.Authorization, `Bearer ${token}`);
      }
      headers.set(Headers.XDiplicityAPILevel, "8");
      headers.set(Headers.XDiplicityClientName, "dipact@"); // TODO
      headers.set(Headers.Accept, "application/json");
      headers.set(Headers.ContentType, "application/json");
      return headers;
    },
    mode: "cors",
  }),
  endpoints: (builder) => ({
    getVariantSVG: builder.query<string, string>({
      query: (variantName) => ({
        url: `/Variant/${variantName}/Map.svg`,
        responseHandler: (response) => response.text(),
      }),
    }),
    getVariantUnitSVG: builder.query<
      string,
      { variantName: string; unitType: string }
    >({
      query: ({ variantName, unitType }) => ({
        url: `/Variant/${variantName}/Units/${unitType}.svg`,
        responseHandler: (response) => response.text(),
      }),
    }),
    getRoot: builder.query<User | null, undefined>({
      query: () => "/",
      transformResponse: (response: ApiResponse<{ User: User }>) => {
        return extractProperties(response).User;
      },
    }),
    getForumMail: builder.query<ApiResponse<ForumMail>, undefined>({
      query: () => "/ForumMail",
    }),
    listUserBans: builder.query<Ban[], string>({
      query: (id) => `/User/${id}/Bans`,
      transformResponse: extractPropertiesList,
    }),
    getUserConfig: builder.query<UserConfig, string>({
      query: (id) => `/User/${id}/UserConfig`,
      transformResponse: extractProperties,
      providesTags: [TagType.UserConfig],
    }),
    getUserStats: builder.query<UserStats, string>({
      query: (id) => `/User/${id}/Stats`,
      transformResponse: extractProperties,
    }),
    getUserRatingHistogram: builder.query<UserRatingHistogram, undefined>({
      query: () => "/Users/Ratings/Histogram",
      transformResponse: extractProperties,
    }),
    listVariants: builder.query<Variant[], undefined>({
      query: () => "/Variants",
      transformResponse: (response: ListApiResponse<Variant>) => {
        // Sort variants and enhance each variant with nationAbbreviations
        sortVariantResponse(response.Properties);
        return extractPropertiesList(response).map((variant) =>
          addNationAbbreviationsToVariant(variant)
        );
      },
    }),
    // TODO test
    listMessages: builder.query<
      Message[],
      { gameId: string; channelId: string }
    >({
      query: ({ gameId, channelId }) =>
        `/Game/${gameId}/Channel/${channelId}/Messages`,
      transformResponse: (response: ListApiResponse<Message>) => {
        const messages = extractPropertiesList(response);
        return sortMessages(messages);
      },
      providesTags: [TagType.Messages],
    }),
    listPhases: builder.query<Phase[], string>({
      query: (gameId) => `/Game/${gameId}/Phases`,
      transformResponse: extractPropertiesList,
    }),
    listPhaseStates: builder.query<
      PhaseState[],
      { gameId: string; phaseId: string }
    >({
      query: ({ gameId, phaseId }) =>
        `/Game/${gameId}/Phase/${phaseId}/PhaseStates`,
      transformResponse: extractPropertiesList,
      providesTags: [TagType.PhaseState],
    }),
    listGames: builder.query<Game[], ListGameFilters>({
      query: ({ my, status, mastered }) => {
        const titleStatus = status.charAt(0).toUpperCase() + status.slice(1);
        if (my) {
          if (mastered) {
            return `/Games/Mastered/${titleStatus}`;
          }
          return `/Games/My/${titleStatus}`;
        }
        return `/Games/${titleStatus}`;
      },
      transformResponse: extractPropertiesList,
      providesTags: [TagType.ListGames],
    }),
    getGameState: builder.query<GameState, { gameId: string; userId: string }>({
      query: ({ gameId, userId }) => `/Game/${gameId}/GameStates/${userId}`,
      transformResponse: extractProperties,
      providesTags: [TagType.ListGames],
    }),
    listGameStates: builder.query<GameState[], string>({
      query: (gameId) => `/Game/${gameId}/GameStates`,
      transformResponse: extractPropertiesList,
      providesTags: [TagType.ListGames],
    }),
    listChannels: builder.query<Channel[], string>({
      query: (gameId) => `/Game/${gameId}/Channels`,
      transformResponse: (response: ListApiResponse<Channel>) => {
        const channels = extractPropertiesList(response);
        return sortListChannels(channels);
      },
    }),
    listOrders: builder.query<
      Corroboration,
      { gameId: string; phaseId: string }
    >({
      query: ({ gameId, phaseId }) =>
        `/Game/${gameId}/Phase/${phaseId}/Corroborate`,
      transformResponse: extractProperties,
    }),
    listOptions: builder.query<Options, { gameId: string; phaseId: string }>({
      query: ({ gameId, phaseId }) =>
        `/Game/${gameId}/Phase/${phaseId}/Options`,
      transformResponse: extractProperties,
    }),
    getGame: builder.query<Game, string>({
      query: (id) => `/Game/${id}`,
      transformResponse: extractProperties,
      providesTags: [TagType.Game],
    }),
    createGame: builder.mutation<ApiResponse<Game>, NewGame>({
      query: (data) => ({
        url: "/Game",
        method: "POST",
        body: data,
      }),
    }),
    createOrder: builder.mutation<
      ApiResponse<Corroboration>,
      { Parts: string[]; gameId: string; phaseId: string }
    >({
      query: ({ gameId, phaseId, ...data }) => ({
        url: `/Game/${gameId}/Phase/${phaseId}/CreateAndCorroborate`,
        method: "POST",
        body: data,
      }),
    }),
    createMessage: builder.mutation<
      Message,
      Pick<Message, "Body" | "ChannelMembers"> & { gameId: string }
    >({
      query: ({ gameId, ...data }) => ({
        url: `/Game/${gameId}/Messages`,
        method: "POST",
        body: JSON.stringify(data),
      }),
      transformResponse: extractProperties,
      invalidatesTags: [TagType.Messages],
    }),
    updateUserConfig: builder.mutation<
      ApiResponse<UserConfig>,
      Partial<UserConfig> & Pick<UserConfig, "UserId">
    >({
      query: ({ UserId, ...patch }) => ({
        url: `/User/${UserId}/UserConfig`,
        method: "PUT",
        body: { UserId, ...patch },
      }),
      invalidatesTags: [TagType.UserConfig],
    }),
    updatePhaseState: builder.mutation<
      ApiResponse<PhaseState>,
      Partial<PhaseState> &
        Pick<PhaseState, "GameID"> &
        Pick<PhaseState, "PhaseOrdinal">
    >({
      query: ({ GameID, PhaseOrdinal, ...patch }) => {
        return {
          url: `/Game/${GameID}/Phase/${PhaseOrdinal}/PhaseState`,
          method: "PUT",
          body: { GameID, PhaseOrdinal, ...patch },
        };
      },
      invalidatesTags: [TagType.Game, TagType.PhaseState],
    }),
    joinGame: builder.mutation<
      undefined,
      Pick<Member, "NationPreferences" | "GameAlias"> & { gameId: string }
    >({
      query: ({ gameId, ...data }) => ({
        url: `/Game/${gameId}/Member`,
        method: "POST",
        body: JSON.stringify(data),
      }),
      invalidatesTags: [TagType.ListGames],
    }),
    rescheduleGame: builder.mutation<
      undefined,
      {
        gameId: string;
        PhaseOrdinal: number;
        NextPhaseDeadlineInMinutes: number;
      }
    >({
      query: ({ gameId, PhaseOrdinal, ...data }) => ({
        url: `/Game/${gameId}/Phase/${PhaseOrdinal}/DeadlineAt`,
        method: "POST",
        body: JSON.stringify(data),
      }),
      invalidatesTags: [TagType.ListGames],
    }),
    unInvite: builder.mutation<undefined, { gameId: string; email: string }>({
      query: ({ gameId, email }) => ({
        url: `/Game/${gameId}/${email}`,
        method: "DELETE",
      }),
      invalidatesTags: [TagType.ListGames],
    }),
    invite: builder.mutation<
      undefined,
      GameMasterInvitation & { gameId: string }
    >({
      query: ({ gameId, ...data }) => ({
        url: `/Game/${gameId}`,
        method: "POST",
        body: JSON.stringify(data),
      }),
      invalidatesTags: [TagType.ListGames],
    }),
    renameGame: builder.mutation<
      undefined,
      { gameId: string; userId: string; GameAlias: string }
    >({
      query: ({ gameId, userId, ...data }) => ({
        url: `/Game/${gameId}/Member/${userId}`,
        method: "PUT",
        body: JSON.stringify(data),
      }),
      invalidatesTags: [TagType.ListGames],
    }),
    deleteGame: builder.mutation<undefined, string>({
      query: (gameId) => ({
        url: `/Game/${gameId}`,
        method: "DELETE",
      }),
      invalidatesTags: [TagType.ListGames],
    }),
    getGameV2: builder.query<TransformedGame, string>({
      query: (id) => `/Game/${id}`,
      transformResponse: (response: ApiResponse<Game>) => {
        const extracted = extractProperties(response);
        return transformGame(extracted);
      },
      providesTags: [TagType.Game],
    }),
    getRootV2: builder.query<TransformedUser, undefined>({
      query: () => "/",
      transformResponse: (response: ApiResponse<{ User: User }>) => {
        const extracted = extractProperties(response);
        return transformUser(extracted.User);
      },
    }),
    listVariantsV2: builder.query<TransformedVariant[], undefined>({
      query: () => "/Variants",
      transformResponse: (response: ListApiResponse<Variant>) => {
        // TODO move sorting somewhere else?
        sortVariantResponse(response.Properties);
        return extractPropertiesList(response).map(transformVariant);
      },
    }),
  }),
});

const transformVariant = (variant: Variant): TransformedVariant => {
  const nationAbbreviations: { [key: string]: string } = {};
  variant.Nations.forEach((nation) => {
    nationAbbreviations[nation] = createNationAbbreviation(
      nation,
      variant.Nations
    );
  });
  return {
    createdBy: variant.CreatedBy,
    description: variant.Description,
    graph: variant.Graph,
    map: variant.Start.Map,
    name: variant.Name,
    nations: variant.Nations,
    nationAbbreviations: variant.nationAbbreviations,
    nationColors: variant.NationColors,
    orderTypes: variant.OrderTypes,
    phaseTypes: variant.PhaseTypes,
    provinceLongNames: variant.ProvinceLongNames,
    rules: variant.Rules,
    seasons: variant.Season,
    startSCs: variant.Start.SCs,
    startSeason: variant.Start.Season,
    startUnits: variant.Start.Units,
    startType: variant.Start.Type,
    startYear: variant.Start.Year,
    unitTypes: variant.UnitTypes,
  };
};

const transformUser = (user: User): TransformedUser => {
  return {
    id: user.Id,
    src: user.Picture,
    username: user.Name,
  };
};

const transformGame = (game: Game): TransformedGame => {
  return {
    anonymous: game.Anonymous,
    chatLanguage: getLanguage(game.ChatLanguageISO639_1)?.name || "English",
    closed: game.Closed,
    conferenceChatEnabled: !game.DisableConferenceChat,
    endYear: game.LastYear,
    createdAt: "", // timeStrToDate(game.CreatedAt),
    finished: game.Finished,
    finishedAt: "", // timeStrToDate(game.FinishedAt),
    groupChatEnabled: !game.DisableGroupChat,
    gameMaster: transformUser(game.GameMaster),
    id: game.ID,
    members: game.Members,
    name: game.Desc,
    nationAllocation: getNationAllocation(game.NationAllocation),
    newestPhaseMeta: game.NewestPhaseMeta,
    numMembers: game.NMembers,
    phaseLength: convertMinutesToLabel(game.PhaseLengthMinutes),
    nonMovementPhaseLength: convertMinutesToLabel(
      game.NonMovementPhaseLengthMinutes
    ),
    playerIdentity: game.Anonymous ? "anonymous" : "public",
    private: game.Private,
    privateChatEnabled: !game.DisablePrivateChat,
    started: game.Started,
    startedAt: timeStrToDate(game.StartedAt),
    variant: game.Variant,
    visibility: game.Private ? "private" : "public",
  };
};

export const endpoints = diplicityService.endpoints;
