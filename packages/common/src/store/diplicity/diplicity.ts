import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  createGameAdapter,
  gameAdapter,
  userAdapter,
  userStatsAdapter,
  variantAdapter,
} from "../../adapters";

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
  TransformedUserStats,
  CreateGameFormValues,
} from "../types";
import { sortVariantResponse, sortListChannels, sortMessages } from "../utils";
import { RootState } from "../store";
import {
  CreateDiplicityApiOptions,
  ListGameFilters,
  TagType,
} from "./diplicity.types";
import { extractPropertiesList, extractProperties } from "./diplicity.util";
import { selectAuth } from "../auth";

const baseUrl = "https://diplicity-engine.appspot.com/";

export const createDiplicityApi = ({
  authService,
  telemetryService,
}: CreateDiplicityApiOptions) =>
  createApi({
    tagTypes: [
      TagType.Game,
      TagType.ListGames,
      TagType.Messages,
      TagType.PhaseState,
      TagType.Token,
      TagType.UserConfig,
    ],
    reducerPath: "diplicity",
    baseQuery: fetchBaseQuery({
      baseUrl,
      prepareHeaders: async (headers, { getState, endpoint }) => {
        telemetryService.logInfo(`Preparing headers for endpoint ${endpoint}`);
        const token = selectAuth(getState() as RootState).token;
        if (token) {
          telemetryService.logInfo("Token found, setting header");
          headers.set(Headers.Authorization, `Bearer ${token}`);
        } else {
          telemetryService.logInfo("Token not found");
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
      getToken: builder.query<string, undefined>({
        queryFn: async (_, __, ___, originalBaseQuery) => {
          const storageToken = await authService.getTokenFromStorage();
          if (storageToken) {
            return { data: storageToken };
          }
          const serverAuthCode = await authService.getServerAuthCode();
          const callbackUrl = await authService.getCallbackUrl(serverAuthCode);
          const result = await originalBaseQuery(callbackUrl);
          const redirectUrl = result.meta?.response?.url;
          if (!redirectUrl) {
            throw new Error("Could not get redirect URL from response");
          }
          const token = authService.getTokenFromRedirectUrl(redirectUrl);
          await authService.setTokenInStorage(token);
          return { data: token };
        },
        providesTags: [TagType.Token],
      }),
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
      getGameState: builder.query<
        GameState,
        { gameId: string; userId: string }
      >({
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
      listPhases: builder.query<Phase[], string>({
        query: (gameId) => `/Game/${gameId}/Phases`,
        transformResponse: (response: ListApiResponse<Phase>) => {
          return extractPropertiesList(response);
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
