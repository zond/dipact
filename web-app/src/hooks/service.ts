import { diplicityService } from "../store/service";

export const {
	useCreateGameMutation,
	useGetRootQuery,
	useGetUserConfigQuery,
	useGetUserRatingHistogramQuery,
	useListVariantsQuery,
	useUpdateUserConfigMutation,
} = diplicityService;
