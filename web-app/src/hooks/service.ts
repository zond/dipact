import { diplicityService } from "../store/service";

export const {
	useCreateGameMutation,
	useGetRootQuery,
	useGetGameQuery,
	useGetUserConfigQuery,
	useGetUserRatingHistogramQuery,
	useListChannelsQuery,
	useListMessagesQuery,
	useListPhasesQuery,
	useListVariantsQuery,
	useUpdateUserConfigMutation,
} = diplicityService;
