import { diplicityService } from "../store/service";
import { getUpdatedUserConfig } from "../store/utils";
import { SettingsFormSubmitValues, UserConfig } from "../store/types";
import { useMessaging } from "./selectors";

export const {
	useCreateGameMutation,
	useGetRootQuery,
	useGetUserConfigQuery,
	useGetUserRatingHistogramQuery,
	useListVariantsQuery,
	useUpdateUserConfigMutation,
} = diplicityService;

// TODO test
// Custom hook to combine the behaviour of useUpdateUserConfigMutation and useGetUserConfigConfig
export const useSubmitSettingsForm = (
	userId: string
): [
	(data: SettingsFormSubmitValues) => void,
	{
		userConfig: UserConfig | undefined;
		queryIsLoading: boolean;
		mutationIsLoading: boolean;
		isError: boolean;
		isSuccess: boolean;
	}
] => {
	const [
		updateUserConfig,
		{
			isLoading: mutationIsLoading,
			isError: mutationIsError,
			isSuccess: mutationIsSuccess,
		},
	] = useUpdateUserConfigMutation(undefined);

	const {
		data: userConfig,
		isFetching: queryIsLoading,
		isSuccess: queryIsSuccess,
		isError: queryIsError,
	} = useGetUserConfigQuery(userId);

	const messaging = useMessaging();

	const submitSettingsForm = (data: SettingsFormSubmitValues): void => {
		const updatedUserConfig = getUpdatedUserConfig(
			userConfig || {},
			data,
			messaging
		);
		updateUserConfig(updatedUserConfig);
	};
	const isSuccess = queryIsSuccess && mutationIsSuccess;
	const isError = queryIsError || mutationIsError;
	return [
		submitSettingsForm,
		{ userConfig, queryIsLoading, mutationIsLoading, isError, isSuccess },
	];
};
