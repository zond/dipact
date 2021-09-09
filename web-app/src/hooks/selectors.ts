import { feedbackSelectors } from "../store/feedback";
import * as selectors from "../store/selectors";
import { RootState } from "../store/store";
import { Channel, ColorOverrides, Feedback, Messaging, MutationStatus, User, Variant } from "../store/types";

import { useAppSelector } from "./store";

export const useColorOverrides = (): ColorOverrides =>
	useAppSelector(selectors.selectColorOverrides);

export const useFeedback = (): Feedback[] =>
	useAppSelector(feedbackSelectors.selectAll);

export const useHasPlayed = (): boolean =>
	useAppSelector(selectors.selectHasPlayed);

export const useMessaging = (): Messaging =>
	useAppSelector(selectors.selectMessaging);

export const useUser = (): User | undefined | null =>
	useAppSelector(selectors.selectUser);

export const useUserId = (): string | undefined =>
	useAppSelector(selectors.selectUserId);

export const useUpdateUserConfigStatus = (): MutationStatus =>
	useAppSelector(selectors.selectUpdateUserConfigStatus);

export const useSelectVariant = (variant: string): Variant | null =>
	useAppSelector((state: RootState) => selectors.selectVariant(state, variant));

export const useSelectNationColor = (variant: string, nation: string): string =>
	useAppSelector((state: RootState) => selectors.selectNationColor(state, variant, nation));

export const useSelectNationAbbreviation = (variant: string, nation: string): string =>
	useAppSelector((state: RootState) => selectors.selectNationAbbreviation(state, variant, nation));

export const useSelectNationFlagLink = (variant: string, nation: string): string | undefined =>
	useAppSelector((state: RootState) => selectors.selectNationFlagLink(state, variant, nation));

export const useSelectChannel = (gameId: string, channelId: string): Channel | null =>
	useAppSelector((state: RootState) => selectors.selectChannel(state, gameId, channelId));