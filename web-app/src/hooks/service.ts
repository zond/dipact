import { diplicityService } from "../store/service";

export const {
	useCreateGameMutation,
	useGetRootQuery,
	useGetGameQuery,
	useGetUserConfigQuery,
	useGetUserRatingHistogramQuery,
	useListMessagesQuery,
	useListVariantsQuery,
	useUpdateUserConfigMutation,
} = diplicityService;
