import React from "react";
import { Avatar, Badge, makeStyles, Theme } from "@material-ui/core";

import { MuteIcon } from "../icons";
import {
  useSelectNationColor,
  useSelectNationAbbreviation,
  useSelectNationFlagLink,
} from "../hooks/selectors";

interface NationAvatarProps {
  color: string;
  link?: string;
  nation: string;
  nationAbbreviation: string;
  onClick: () => void;
}

type StyleProps = Pick<NationAvatarProps, "color" | "nationAbbreviation">;

const useStyles = makeStyles<Theme, StyleProps>((theme) => ({
  avatar: {
    backgroundColor: ({ color }) => color,
    color: ({ color }) => theme.palette.getContrastText(color),
    fontSize: ({ nationAbbreviation }) =>
      nationAbbreviation.length > 3 ? "smaller" : "small",
  },
}));

export const withMuted = (WrappedComponent: React.ReactElement) => (
  <Badge badgeContent={<MuteIcon />} overlap="circular">
    {WrappedComponent}
  </Badge>
);

export const NationAvatar = ({
  color,
  link,
  nation,
  nationAbbreviation,
  onClick,
}: NationAvatarProps): React.ReactElement => {
  const classes = useStyles({ color, nationAbbreviation });

  return (
    <Avatar
      onClick={onClick}
      className={classes.avatar}
      alt={nation}
      src={link}
    >
      {nationAbbreviation}
    </Avatar>
  );
};

interface NationContainerProps {
  nation: string;
  variant: string;
  onClick: () => void;
}

const NationAvatarContainer = ({
  nation,
  variant,
  onClick,
}: NationContainerProps) => {
  const color = useSelectNationColor(variant, nation);
  const nationAbbreviation = useSelectNationAbbreviation(variant, nation);
  const link = useSelectNationFlagLink(variant, nation);

  // TODO add muted when gamestate in store

  return (
    <NationAvatar
      nation={nation}
      color={color}
      nationAbbreviation={nationAbbreviation}
      link={link}
      onClick={onClick}
    />
  );
};

export default NationAvatarContainer;
