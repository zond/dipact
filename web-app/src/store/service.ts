import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import actions from "./actions";
import {
  UserRatingHistogramResponse,
  ListVariantsResponse,
  ForumMailResponse,
  UserStatsResponse,
  UserConfigResponse,
  UserBanResponse,
  RootResponse,
} from "./types";
import { addNationAbbreviationsToVariant, sortVariantResponse } from "./utils";

const token =
  "FTiY8bRYSQvCj98tmFuwoeX5nFC-zWpVK6II5sArw06w048LUftiIU5gCZN8p-SIhMMH2mq64gtOI_KXaQN0dlZwWMsxDEIbTxVKVFJmBOTi5GXYt5EeYZnJK0juJWEBcSDKyyqkKHs92jssbPxOoARvcEDJhPgW3xEfR5eFStGtRMKjaY-P0yeKmqMtcufppsHwoQxZdiVAQT0gUSv7FIPGXLODZ5KnJI0XSuv21Y_rMMTwQJM_lhEFGN_paYj87nqSSIpw2HjPhvg0d51bRGPsx20i0L_yUpdpGXbNIH_PcBqynqouiS32UtzRfh5MnJDHJyrpJNys5EYGAvq_YlzxuL2nZXX7XsIaWTl1TwtWlxTAa_hVZrPOhVMVHIPBwUeLZczcZef0vLYj4CxRIZMQsTP27gOYVtsm2UQD72gnby6RuRBz2bXrMWRxRtizKRSYAsZ-uwmSHBWOQaL4ZuTEBxOympaH2m8p9nw2x-T0hYGda2BuAfg6Np8yoQE=";

const hrefURL = new URL(location.href);
const serviceURL =
  localStorage.getItem("serverURL") || "https://diplicity-engine.appspot.com/";

// Define a service using a base URL and expected endpoints
export const diplicityService = createApi({
  reducerPath: "diplicityService",
  baseQuery: fetchBaseQuery({
    baseUrl: serviceURL,
    prepareHeaders: (headers, { getState }) => {
      // const token = (getState() as RootState).auth.token;
      // If we have a token set in state, let's assume that we should be passing it.
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      headers.set("X-Diplicity-API-Level", "8");
      headers.set("X-Diplicity-Client-Name", "dipact@" + hrefURL.host);
      headers.set("Accept", "application/json");
      return headers;
    },
    mode: "cors",
  }),
  endpoints: (builder) => ({
    getRoot: builder.query<RootResponse, undefined>({
      query: () => "/",
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        const user = data.Properties.User;
        if (user) {
          const endpoints = diplicityService.endpoints;
          void dispatch(endpoints.getForumMail.initiate(undefined));
          void dispatch(endpoints.getUserStats.initiate(user.Id));
          void dispatch(endpoints.getUserConfig.initiate(user.Id));
          void dispatch(endpoints.getUserBans.initiate(user.Id));
        }
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
    getUserConfig: builder.query<UserConfigResponse, string>({
      query: (id) => `/User/${id}/UserConfig`,
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        const { meta } = await queryFulfilled;
        if (meta?.response.ok) {
          void dispatch(actions.parseUserConfigColors());
        }
      },
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
    getVariants: builder.query<ListVariantsResponse, undefined>({
      query: () => "/Variants",
      transformResponse: (response: ListVariantsResponse) => {
        // Sort variants and enhance each variant with nationAbbreviations
        sortVariantResponse(response.Properties);
        const variants = response.Properties.map((props) => props.Properties);
        variants.forEach((variant) => addNationAbbreviationsToVariant(variant));
        return response;
      },
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        const { meta } = await queryFulfilled;
        if (meta?.response.ok) {
          void dispatch(actions.parseUserConfigColors());
        }
      },
    }),
  }),
});

export const {
  useGetVariantsQuery,
  useGetRootQuery,
  useGetUserRatingHistogramQuery,
} = diplicityService;
