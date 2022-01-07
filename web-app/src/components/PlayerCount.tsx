import { Typography } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import React from "react";
import { NumMembersIcon } from "../icons";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
}));

interface PlayerCountProps {
  numPlayers: number;
  maxNumPlayers: number;
}

const PlayerCount = ({
  numPlayers,
  maxNumPlayers,
}: PlayerCountProps): React.ReactElement => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <NumMembersIcon />
      <Typography>
        {numPlayers} / {maxNumPlayers}
      </Typography>
    </div>
  );
};

export default PlayerCount;
