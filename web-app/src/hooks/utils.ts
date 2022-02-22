import {
  Game,
  Member,
  User,
  Channel as StoreChannel,
  Variant,
  Phase,
} from "@diplicity/common";
import {
  getNationAbbreviation,
  getNationColor,
  getNationFlagLink,
} from "../utils/general";
import { ApiError, Channel, CombinedQuery, CombinedQueryState, DiplicityError } from "./types";

export const EVERYONE = "Everyone";

export const getMember = (game: Game, user: User): Member | undefined => {
  return game.Members.find((m) => m.User.Email === user.Email);
};

export const getNation = (nation: string, variant: Variant) => {
  const color = getNationColor(variant, nation);
  const abbreviation = getNationAbbreviation(variant, nation);
  const link = getNationFlagLink(variant, nation);
  const name = nation;
  return { name, color, abbreviation, link };
};

export const getChannel = (
  channel: StoreChannel,
  variant: Variant,
  game: Game,
  user: User
): Channel => {
  const { Members } = channel;
  const nations = Members.map((nation) => getNation(nation, variant));
  const member = getMember(game, user);
  const title =
    Members.length === variant.Nations.length
      ? EVERYONE
      : Members.filter((nation) => nation !== member?.Nation).join(", ");
  const id = Members.join(",");
  return {
    ...channel,
    title,
    nations,
    member,
    id,
  };
};

// Puts "Everyone" channel at the top. Main sorting is done in store/service
export const sortChannels = (channels: Channel[]): Channel[] =>
  channels.sort((a, b) =>
    a.title === EVERYONE ? -1 : b.title === EVERYONE ? 1 : 0
  );

export const mergeErrors = (
  ...errorsOrUndefined: (ApiError | undefined)[]
): DiplicityError => {
  const errors: DiplicityError[] = [];
  errorsOrUndefined.forEach((error) => {
    if (error) errors.push(error as DiplicityError);
  });
  return errors.reduce(
    (mergedErrors, e) => {
      const error = e as ApiError & { status: number, data: any }
      const newError = {
        status: error?.status || mergedErrors.status,
        data: error?.data || mergedErrors.data,
      };
      return newError as ApiError & { status: number, data: any };
    },
    { status: 0, data: {} } as DiplicityError
  );
};

// TODO test
export const getPhaseName = (phase: Phase) => {
  return phase.Season + " " + phase.Year + ", " + phase.Type;
};

const getAnyIsLoading = (combinedQueryState: CombinedQuery) =>
  Object.values(combinedQueryState).some((queryState) => queryState.isLoading);

const getAnyIsError = (combinedQueryState: CombinedQuery) =>
  Object.values(combinedQueryState).some((queryState) => queryState.isError);

const getAllIsSuccess = (combinedQueryState: CombinedQuery) =>
  Object.values(combinedQueryState).every((queryState) => queryState.isSuccess);

export const getCombinedQueryState = (combinedQueryState: CombinedQuery): CombinedQueryState => ({
  isLoading: getAnyIsLoading(combinedQueryState),
  isError: getAnyIsError(combinedQueryState),
  isSuccess: getAllIsSuccess(combinedQueryState),
  error: mergeErrors(
    ...Object.values(combinedQueryState).map((queryState) => queryState.error)
  ),
});
