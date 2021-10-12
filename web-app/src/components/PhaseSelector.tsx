import React from "react";
import { Card, IconButton, MenuItem, Select } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";

import { NextIcon, PreviousIcon } from "../icons";

interface PhaseSelectorProps {
  selectedPhase: number;
  phases: [number, string][];
  onSelectPhase: (phase: number) => void;
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

const PhaseSelector = ({
  phases,
  selectedPhase,
  onSelectPhase,
}: PhaseSelectorProps): React.ReactElement => {
  const classes = useStyles();

  const handleChange = (
    e: React.ChangeEvent<{ name?: string | undefined; value: unknown }>
  ) => {
    const value = e.target.value as number;
    onSelectPhase(value);
  };

  return (
    <Card className={classes.root} title="phase selector">
      <IconButton
        onClick={() => onSelectPhase(selectedPhase - 1)}
        disabled={selectedPhase === 1}
        title="show next phase"
      >
        <PreviousIcon />
      </IconButton>
      <Select value={selectedPhase} disableUnderline onChange={handleChange}>
        {phases.map((phase) => (
          <MenuItem key={phase[0]} value={phase[0]}>{phase[1]}</MenuItem>
        ))}
      </Select>
      <IconButton
        onClick={() => onSelectPhase(selectedPhase + 1)}
        disabled={selectedPhase === phases.length}
        title="show previous phase"
      >
        <NextIcon />
      </IconButton>
    </Card>
  );
};

export default PhaseSelector;
