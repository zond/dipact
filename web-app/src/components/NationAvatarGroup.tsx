import React from "react";
import { makeStyles, Theme } from "@material-ui/core";

interface NationAvatarGroupProps {
  avatars: React.ReactElement[];
}

type StyleProps = {
  diameter: number;
  avatarSize: number;
};

const DIAMETER = 40;

const gridTemplates: { [key: number]: number[] } = {
  1: [1],
  2: [2],
  3: [1, 2],
  4: [2, 2],
  5: [1, 3, 1],
  6: [3, 3],
  7: [2, 3, 2],
  8: [3, 3, 2],
  9: [3, 3, 3],
};
const dividerMap: { [key: number]: number } = {
  1: 1,
  2: 1.5,
  3: 2,
  4: 2,
  5: 3,
};

const getLengthToDiameterDivider = (length: number): number => {
  return dividerMap[length] || dividerMap[5];
};

const getGridTemplate = (length: number): number[] => {
  return gridTemplates[length] || gridTemplates[9];
};

const useStyles = makeStyles<Theme, StyleProps>((theme) => ({
  root: {
    backgroundColor: theme.palette.text.primary,
    width: ({ diameter }) => `${diameter}px`,
    height: ({ diameter }) => `${diameter}px`,
    borderRadius: "100%",
    clipPath: "circle(50% at 50% 50%)",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
    "& > div": {
      display: "flex",
      justifyContent: "center",
      "& > div,span": {
        width: ({ avatarSize }) => `${avatarSize}px`,
        height: ({ avatarSize }) => `${avatarSize}px`,
      },
    },
  },
}));

const NationAvatarGroup = ({
  avatars,
}: NationAvatarGroupProps): React.ReactElement => {
  const gridTemplate = getGridTemplate(avatars.length);
  const diameterDivider = getLengthToDiameterDivider(avatars.length);
  const avatarSize = DIAMETER / diameterDivider;
  const classes = useStyles({ avatarSize, diameter: DIAMETER });
  let count = 0;

  const pickAvatar = (): React.ReactElement => {
    const avatar = avatars[count];
    count += 1;
    return avatar;
  }

  return (
    <div className={classes.root}>
      {gridTemplate.map((num, index) => (
        <div key={index}>{[...Array(num)].map(pickAvatar)}</div>
      ))}
    </div>
  );
};

export default NationAvatarGroup;
