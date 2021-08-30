import React from "react";
import { Avatar, Badge, makeStyles, Theme } from "@material-ui/core";

import { MuteIcon } from "../icons";

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

const NationAvatar = ({
  color,
  link,
  nation,
  nationAbbreviation,
  onClick,
}: NationAvatarProps): React.ReactElement => {
  const classes = useStyles({ color, nationAbbreviation });

  return (
    <Avatar onClick={onClick} className={classes.avatar} alt={nation} src={link}>
      {nationAbbreviation}
    </Avatar>
  );
};

export default NationAvatar;
