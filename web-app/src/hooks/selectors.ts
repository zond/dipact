import { feedbackSelectors } from "../store/feedback";
import * as selectors from "../store/selectors";
import { ColorOverrides, Feedback, Messaging, MutationStatus, User } from "../store/types";

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
