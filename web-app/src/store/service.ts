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
}

const hrefURL = new URL(location.href);
export const diplicityServiceURL = "https://diplicity-engine.appspot.com/";
const serviceURL = localStorage.getItem("serverURL") || diplicityServiceURL;

export const diplicityService = createApi({
  tagTypes: [TagType.UserConfig, TagType.Messages],
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
    getRoot: builder.query<User | null, undefined>({
      query: () => "/User",
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
    }),
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
  }),
});
