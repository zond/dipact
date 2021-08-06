/* eslint-disable no-restricted-globals */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import * as actions from "./actions";
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
} from "./types";
import { addNationAbbreviationsToVariant, sortVariantResponse } from "./utils";

export enum TagType {
	UserConfig = "UserConfig",
}

const hrefURL = new URL(location.href);
export const diplicityServiceURL = "https://diplicity-engine.appspot.com/";
const serviceURL = localStorage.getItem("serverURL") || diplicityServiceURL;

export const diplicityService = createApi({
	tagTypes: [TagType.UserConfig],
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
		getRoot: builder.query<RootResponse, undefined>({
			query: () => "/",
			// async onQueryStarted(_, { dispatch, queryFulfilled }) {
			// 	const { data } = await queryFulfilled;
			// 	const user = data.Properties.User;
			// 	if (user?.Id) {
			// 		const endpoints = diplicityService.endpoints;
			// 		void dispatch(endpoints.getForumMail.initiate(undefined));
			// 		void dispatch(endpoints.getUserStats.initiate(user.Id));
			// 		void dispatch(endpoints.getUserConfig.initiate(user.Id));
			// 		void dispatch(endpoints.getUserBans.initiate(user.Id));
			// 	}
			// },
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
			async onQueryStarted(_, { dispatch, queryFulfilled }) {
				const { meta } = await queryFulfilled;
				if (meta?.response.ok) {
					void dispatch(actions.parseUserConfigColors());
				}
			},
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
				const transformedResponse = response.Properties.map(
					(variant) => variant.Properties
				).map((variant) => addNationAbbreviationsToVariant(variant));
				return transformedResponse;
			},
		}),
		createGame: builder.mutation<CreateGameResponse, NewGame>({
			query: (body) => ({
				url: "/Game",
				method: "POST",
				body,
			}),
			// invalidatesTags: ["Post"],
		}),
		updateUserConfig: builder.mutation<
			CreateGameResponse,
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
