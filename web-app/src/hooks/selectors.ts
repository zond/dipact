import * as selectors from "../store/selectors";
import { ColorOverrides, Messaging, User } from "../store/types";

import { useAppSelector } from "./store";

export const useColorOverrides = (): ColorOverrides =>
	useAppSelector(selectors.selectColorOverrides);

export const useHasPlayed = (): boolean =>
	useAppSelector(selectors.selectHasPlayed);

export const useMessaging = (): Messaging =>
	useAppSelector(selectors.selectMessaging);

export const useUser = (): User => useAppSelector(selectors.selectUser);

export const useUserId = (): string | undefined =>
	useAppSelector(selectors.selectUserId);
