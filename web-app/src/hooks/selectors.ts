import { feedbackSelectors } from "../store/feedback";
import * as selectors from "../store/selectors";
import { RootState } from "../store/store";
import {
  Channel,
  Feedback,
  Messaging,
  MutationStatus,
  User,
  Variant,
} from "../store/types";

import { useAppSelector } from "./store";

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

export const useCreateGameStatus = (): MutationStatus =>
  useAppSelector(selectors.selectCreateGameStatus);

export const useSelectVariant = (variant: string): Variant | null =>
  useAppSelector((state: RootState) => selectors.selectVariant(state, variant));

export const useSelectNationColor = (variant: string, nation: string): string =>
  useAppSelector((state: RootState) =>
    selectors.selectNationColor(state, variant, nation)
  );

export const useSelectNationAbbreviation = (
  variant: string,
  nation: string
): string =>
  useAppSelector((state: RootState) =>
    selectors.selectNationAbbreviation(state, variant, nation)
  );

export const useSelectNationFlagLink = (
  variant: string,
  nation: string
): string | undefined =>
  useAppSelector((state: RootState) =>
    selectors.selectNationFlagLink(state, variant, nation)
  );

export const useSelectChannel = (
  gameId: string,
  channelId: string
): Channel | null =>
  useAppSelector((state: RootState) =>
    selectors.selectChannel(state, gameId, channelId)
  );

export const useSelectIsLoggedIn = (): boolean =>
  useAppSelector((state: RootState) => selectors.selectIsLoggedIn(state));

export const useSelectPhase = (): null | number =>
  useAppSelector((state: RootState) => selectors.selectPhase(state));

export const useSelectVariantUnitSvgs = (
  variant: Variant | null
): { [key: string]: string } => {
  return useAppSelector((state: RootState) =>
    selectors.selectVariantUnitSvgs(state, variant?.Name, variant?.UnitTypes)
  );
};

export const useSelectUser = () => {
  return useAppSelector((state: RootState) =>
    selectors.selectUser(state) || {}
  );
};
