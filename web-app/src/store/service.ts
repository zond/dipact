/* eslint-disable no-restricted-globals */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Globals from "../Globals";

import { selectToken } from "./selectors";
import { RootState } from "./store";
import {
  UserRatingHistogramResponse,
  ListVariantsResponse,
  ForumMailResponse,
  UserStatsResponse,
  UserConfigResponse,
  UserBanResponse,
  RootResponse,
  Headers,
  NewGame,
  CreateGameResponse,
  Variant,
  UserConfig,
  UpdateUserConfigResponse,
  Message,
  Game,
  GameResponse,
  ListMessagesResponse,
  ListPhaseStatesResponse,
  PhaseState,
  ListPhasesResponse,
  Phase,
  Channel,
  ListChannelsResponse,
  User,
  CreateMessageResponse,
  PhaseStateResponse,
  ListGamesResponse,
  Member,
} from "./types";
import {
  addNationAbbreviationsToVariant,
  sortVariantResponse,
  sortListChannels,
  sortMessages,
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

const hrefURL = new URL(location.href);
export const diplicityServiceURL = "https://diplicity-engine.appspot.com/";
const serviceURL = localStorage.getItem("serverURL") || diplicityServiceURL;

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
      const token = selectToken(getState() as RootState);
      // If we have a token set in state, let's assume that we should be passing it.
      if (token) {
        headers.set(Headers.Authorization, `Bearer ${token}`);
      }
      headers.set(Headers.XDiplicityAPILevel, "8");
      headers.set(Headers.XDiplicityClientName, "dipact@" + hrefURL.host);
      headers.set(Headers.Accept, "application/json");
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
      transformResponse: (response: RootResponse, meta) => {
        return response.Properties?.User || null;
      },
      onQueryStarted: async (arg, { queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          Globals.user = data;
        } catch (err) {}
      },
    }),
    getForumMail: builder.query<ForumMailResponse, undefined>({
      query: () => "/ForumMail",
    }),
    getUserBans: builder.query<UserBanResponse, string>({
      query: (id) => `/User/${id}/Bans`,
      transformResponse: (response: UserBanResponse, meta) => {
        // Bit of a hack to extract the userId from the request to filter bans by userId
        const url = meta?.request?.url;
        if (url) {
          const re = /User\/(?<id>.+)\/Bans/g;
          const match = re.exec(url);
          if (match) {
            response.userId = match.groups?.id;
          }
        }
        return response;
      },
    }),
    getUserConfig: builder.query<UserConfig, string>({
      query: (id) => `/User/${id}/UserConfig`,
      transformResponse: (response: UserConfigResponse) => response.Properties,
      providesTags: [TagType.UserConfig],
    }),
    getUserStats: builder.query<UserStatsResponse, string>({
      query: (id) => `/User/${id}/Stats`,
    }),
    getUserRatingHistogram: builder.query<
      UserRatingHistogramResponse,
      undefined
    >({
      query: () => "/Users/Ratings/Histogram",
    }),
    listVariants: builder.query<Variant[], undefined>({
      query: () => "/Variants",
      transformResponse: (response: ListVariantsResponse) => {
        // Sort variants and enhance each variant with nationAbbreviations
        sortVariantResponse(response.Properties);
        const transformedResponse = response.Properties.map((variant) => ({
          ...variant.Properties,
          Links: variant.Links,
        })).map((variant) => addNationAbbreviationsToVariant(variant));
        return transformedResponse;
      },
    }),
    // TODO test
    listMessages: builder.query<
      Message[],
      { gameId: string; channelId: string }
    >({
      query: ({ gameId, channelId }) =>
        `/Game/${gameId}/Channel/${channelId}/Messages`,
      transformResponse: (response: ListMessagesResponse) => {
        const messages = response.Properties.map(
          (messageResponse) => messageResponse.Properties
        );
        return sortMessages(messages);
      },
      providesTags: [TagType.Messages],
    }),
    listPhases: builder.query<Phase[], string>({
      query: (gameId) => `/Game/${gameId}/Phases`,
      transformResponse: (response: ListPhasesResponse) => {
        return response.Properties.map(
          (phaseResponse) => phaseResponse.Properties
        );
      },
    }),
    listPhaseStates: builder.query<
      PhaseState[],
      { gameId: string; phaseId: string }
    >({
      query: ({ gameId, phaseId }) =>
        `/Game/${gameId}/Phase/${phaseId}/PhaseStates`,
      transformResponse: (response: ListPhaseStatesResponse) => {
        return response.Properties.map(
          (phaseStateResponse) => phaseStateResponse.Properties
        );
      },
      providesTags: [TagType.PhaseState],
    }),
    listGames: builder.query<
      Game[],
      ListGameFilters
    >({
      query: ({ my, status, mastered }) => {
        if (my) {
          if (mastered) {
            return `/My/Mastered/Games/${status}`;
          }
          return `/My/Games/${status}`;
        }
        return `/Games/${status}`;
      },
      transformResponse: (response: ListGamesResponse) => {
        return response.Properties.map(
          (gameResponse) => gameResponse.Properties
        );
      },
      providesTags: [TagType.ListGames],
    }),
    // https://diplicity-engine.appspot.com/Games/Started?limit=64
    listChannels: builder.query<Channel[], string>({
      query: (gameId) => `/Game/${gameId}/Channels`,
      transformResponse: (response: ListChannelsResponse) => {
        const channels = response.Properties.map(
          (channelResponse) => channelResponse.Properties
        );
        return sortListChannels(channels);
      },
    }),
    // TODO test
    getGame: builder.query<Game, string>({
      query: (id) => `/Game/${id}`,
      transformResponse: (response: GameResponse) => {
        return response.Properties;
      },
      providesTags: [TagType.Game],
    }),
    createGame: builder.mutation<CreateGameResponse, NewGame>({
      query: (data) => ({
        url: "/Game",
        method: "POST",
        body: JSON.stringify(data),
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
      transformResponse: (response: CreateMessageResponse) => {
        return response.Properties;
      },
      invalidatesTags: [TagType.Messages],
    }),
    updateUserConfig: builder.mutation<
      UpdateUserConfigResponse,
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
      PhaseStateResponse,
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
      { gameId: string, PhaseOrdinal: number, NextPhaseDeadlineInMinutes: number }
    >({
      query: ({ gameId, PhaseOrdinal, ...data }) => ({
        url: `/Game/${gameId}/Phase/${PhaseOrdinal}/DeadlineAt`,
        method: "POST",
        body: JSON.stringify(data),
      }),
      invalidatesTags: [TagType.ListGames],
    }),
  }),
});
