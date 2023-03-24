import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  gameAdapter,
  phaseAdapter,
  userStatsAdapter,
  variantAdapter,
} from "../adapters";
import { createGameAdapter } from "../adapters/createGame";
import { userAdapter } from "../adapters/user";
import { authSelectors } from "./auth";

import {
  Headers,
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
  TransformedPhase,
  TransformedUserStats,
  CreateGameFormValues,
} from "./types";
import { sortVariantResponse, sortListChannels, sortMessages } from "./utils";

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

export const service = createApi({
  tagTypes: [
    TagType.UserConfig,
    TagType.Messages,
    TagType.Game,
    TagType.ListGames,
    TagType.PhaseState,
  ],
  reducerPath: "service",
  baseQuery: fetchBaseQuery({
    baseUrl: serviceURL,
    prepareHeaders: (headers, { getState }) => {
      const token = authSelectors.selectToken(getState() as any);
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
    getUserRatingHistogram: builder.query<UserRatingHistogram, undefined>({
      query: () => "/Users/Ratings/Histogram",
      transformResponse: extractProperties,
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
    listPhaseStates: builder.query<
      PhaseState[],
      { gameId: string; phaseId: string }
    >({
      query: ({ gameId, phaseId }) =>
        `/Game/${gameId}/Phase/${phaseId}/PhaseStates`,
      transformResponse: extractPropertiesList,
      providesTags: [TagType.PhaseState],
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
    getGame: builder.query<TransformedGame, string>({
      query: (id) => `/Game/${id}`,
      transformResponse: (response: ApiResponse<Game>) => {
        const extracted = extractProperties(response);
        return gameAdapter(extracted);
      },
      providesTags: [TagType.Game],
    }),
    getRoot: builder.query<TransformedUser, undefined>({
      query: () => "/",
      transformResponse: (response: ApiResponse<{ User: User }>) => {
        const extracted = extractProperties(response);
        return userAdapter(extracted.User);
      },
    }),
    listVariants: builder.query<TransformedVariant[], undefined>({
      query: () => "/Variants",
      transformResponse: (response: ListApiResponse<Variant>) => {
        // TODO move sorting somewhere else?
        sortVariantResponse(response.Properties);
        return extractPropertiesList(response).map(variantAdapter);
      },
    }),
    listPhases: builder.query<TransformedPhase[], string>({
      query: (gameId) => `/Game/${gameId}/Phases`,
      transformResponse: (response: ListApiResponse<Phase>) => {
        return extractPropertiesList(response).map(phaseAdapter);
      },
    }),
    listGames: builder.query<TransformedGame[], ListGameFilters>({
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
      transformResponse: (response: ListApiResponse<Game>) => {
        return extractPropertiesList(response).map(gameAdapter);
      },
      providesTags: [TagType.ListGames],
    }),
    getUserStats: builder.query<TransformedUserStats, string>({
      query: (id) => `/User/${id}/Stats`,
      transformResponse: (response: ApiResponse<UserStats>) => {
        return userStatsAdapter(extractProperties(response));
      },
    }),
    createGame: builder.mutation<TransformedGame, CreateGameFormValues>({
      query: (data) => {
        return {
          url: "/Game",
          method: "POST",
          body: createGameAdapter(data),
        };
      },
      transformResponse: (response: ApiResponse<Game>) => {
        return gameAdapter(extractProperties(response));
      },
    }),
  }),
});

export const endpoints = service.endpoints;
