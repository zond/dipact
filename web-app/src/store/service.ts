/* eslint-disable no-restricted-globals */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

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
			query: () => "/User",
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
				const transformedResponse = response.Properties.map(
					(variant) => ({ ...variant.Properties, Links: variant.Links })
				).map((variant) => addNationAbbreviationsToVariant(variant));
				return transformedResponse;
			},
		}),
		createGame: builder.mutation<CreateGameResponse, NewGame>({
			query: (data) => ({
				url: "/Game",
				method: "POST",
				body: JSON.stringify(data),
			}),
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
