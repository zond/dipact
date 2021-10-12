import {
  Game,
  Member,
  User,
  Channel as StoreChannel,
  Variant,
  Phase,
} from "../store/types";
import {
  getNationAbbreviation,
  getNationColor,
  getNationFlagLink,
} from "../utils/general";
import { ApiError, Channel } from "./types";

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
): ApiError => {
  const errors: ApiError[] = [];
  errorsOrUndefined.forEach((error) => {
    if (error) errors.push(error);
  });
  return errors.reduce(
    (mergedErrors, error) => {
      const newError = {
        status: error?.status || mergedErrors.status,
        data: error?.data || mergedErrors.data,
      };
      return newError as ApiError;
    },
    { status: null, data: {} } as ApiError
  );
};

// TODO test
export const getPhaseName = (phase: Phase) => {
  return phase.Season + " " + phase.Year + ", " + phase.Type;
};