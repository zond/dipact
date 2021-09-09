import { Channel } from "../../hooks/types";
import { EVERYONE } from "../../hooks/utils";
import NationAvatar, { getEveryoneAvatarProps } from "../NationAvatar";
import NationAvatarGroup from "../NationAvatarGroup";

export const getNationAvatarGroupFromChannel = (channel: Channel) => {
  const avatars =
    channel.title === EVERYONE
      ? [<NationAvatar {...getEveryoneAvatarProps()} />]
      : channel.nations.map(({ name, color, link, abbreviation }) => {
          return (
            <NationAvatar
              key={name}
              nation={name}
              color={color}
              link={link}
              nationAbbreviation={abbreviation}
            />
          );
        });
  return <NationAvatarGroup avatars={avatars} />;
}