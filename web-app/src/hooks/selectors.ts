import { RootState } from "../store/store";
import { ColorOverrides, User, UserConfig, Variant } from "../store/types";
import { useAppSelector } from "./store";

// TODO test
export const useColorOverrides = (): ColorOverrides => {
	return useAppSelector((state: RootState) => state.colorOverrides);
};

export const useHasPlayed = (): boolean => {
	const joinedGames = useAppSelector(
		(state: RootState) =>
			state.userStats.JoinedGames || state.userStats.PrivateStats?.JoinedGames
	);
	return Boolean(joinedGames);
};

export const useUser = (): User => {
	return useAppSelector((state: RootState) => state.user);
};

export const useUserConfig = (): UserConfig => {
	return useAppSelector((state: RootState) => state.userConfig);
};

// TODO test
export const useSelectVariantByName = (
	variantName: string
): Variant | undefined => {
	return useAppSelector((state: RootState) => {
		return state.variants.entities.find(
			(variant) => variant.Name === variantName
		);
	});
};

// TODO test
export const useVariants = (): Variant[] => {
	return useAppSelector((state: RootState) => state.variants.entities);
};
