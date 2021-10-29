import React from "react";
import { Card, IconButton, MenuItem, Select } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";

import { NextIcon, PreviousIcon } from "../icons";
import { usePhaseSelector } from "../hooks/usePhaseSelector";
import { useParams } from "react-router-dom";

interface PhaseSelectorUrlParams {
  gameId: string;
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    border: "solid 1px",
    borderColor: theme.palette.grey[500],
    borderRadius: theme.spacing(3),
    padding: 0,
  },
}));

const PhaseSelector = (): React.ReactElement => {
  const classes = useStyles();
  const { gameId } = useParams<PhaseSelectorUrlParams>();
  const {
    phases,
    setPhase,
    setNextPhase,
    setPreviousPhase,
    selectedPhase,
    combinedQueryState: { isLoading, isError },
  } = usePhaseSelector(gameId);

  const handleChange = (
    e: React.ChangeEvent<{ name?: string | undefined; value: unknown }>
  ) => {
    const value = e.target.value as number;
    setPhase(value);
  };

  if (isLoading || isError || !phases || !selectedPhase) return <></>;

  return (
    <Card className={classes.root} title="phase selector">
      <IconButton
        onClick={setPreviousPhase}
        disabled={selectedPhase === 1}
        title="show previous phase"
      >
        <PreviousIcon />
      </IconButton>
      <Select value={selectedPhase} disableUnderline onChange={handleChange}>
        {phases.map((phase) => (
          <MenuItem key={phase[0]} value={phase[0]}>
            {phase[1]}
          </MenuItem>
        ))}
      </Select>
      <IconButton
        onClick={setNextPhase}
        disabled={selectedPhase === phases.length}
        title="show next phase"
      >
        <NextIcon />
      </IconButton>
    </Card>
  );
};

export default PhaseSelector;
