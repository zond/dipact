import {
  Game,
  Member,
  User,
  Channel as StoreChannel,
  Variant,
} from "../store/types";
import {
  getNationAbbreviation,
  getNationColor,
  getNationFlagLink,
} from "../utils/general";
import { Channel } from "./types";

export const EVERYONE = "Everyone";

export const getMember = (game: Game, user: User): Member | undefined => {
  return game.Members.find((m) => m.User.Email === user.Email);
};
export const getChannel = (
  channel: StoreChannel,
  variant: Variant,
  game: Game,
  user: User
): Channel => {
  const { Members } = channel;
  const title =
    Members.length === variant.Nations.length ? EVERYONE : Members.join(", ");
  const nations = Members.map((nation) => {
    const color = getNationColor(variant, nation);
    const abbreviation = getNationAbbreviation(variant, nation);
    const link = getNationFlagLink(variant, nation);
    const name = nation;
    return { name, color, abbreviation, link };
  });
  const member = getMember(game, user);
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
