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
	"bBxdcplqeUmM_hsU7_PTdOvqTeqTB_rcN9XoHSrfjHTNzbT8jA8D2zBM7LBLXNyXaqpt-OnuekcRFznuVCdJIpXlj4iroFsM1s8FzqUaIuF6Qx4baBsUrxVJOQC8CsM-nR1jTJ_OW8EH1ziaKe4D8KzNeeqLinyrqXfhvrKE0aPTOaPnnP65LF3x6myerDlVjvlkVigw9yUo4UIgpCwbWsh9Ak9UfBE0oD5hPmy0Qg9jOQpqTb7AASW1NqUfiDpWL2BYTCV6mI0WsEZvDTP0uZOOXiERtYxVLKk6wL_b8Nrx26PcpeBOjpv1OsEkEDgt1Ow47emayPahId5MV4H5sxOCwUxuk3dIN3r_idtI7I4vhEsWSuMMmDkvCNEWKNgvxdClSZfyiZP7SWev4prMHY1RrzUw1Mk9XhbffRB3RYb9pu-szzqpnHXcSQlFtVK8x9yGXWfENLweevpXXVHFO4VRKO95X5nliVU9vuxnx7NaIpRbQFpLdfbo7rSByFk=";

const hrefURL = new URL(location.href);
const serviceURL =
	localStorage.getItem("serverURL") || "https://diplicity-engine.appspot.com/";

// Define a service using a base URL and expected endpoints
export const diplicityService = createApi({
	reducerPath: "diplicityService",
	baseQuery: fetchBaseQuery({
		baseUrl: serviceURL,
		prepareHeaders: (headers) => {
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
				if (user?.Id) {
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
