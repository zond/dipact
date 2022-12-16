import React from "react";
import {
  Card,
  IconButton,
  MenuItem,
  Select,
  makeStyles,
  FormControl,
  InputLabel,
} from "@material-ui/core";

import { NextIcon, PreviousIcon } from "../icons";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { translateKeys as tk, usePhaseSelector } from "@diplicity/common";

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
  const { t } = useTranslation();
  const classes = useStyles();
  const { gameId } = useParams<PhaseSelectorUrlParams>();
  const {
    phases,
    setPhase,
    setNextPhase,
    setPreviousPhase,
    selectedPhase,
    isLoading,
    isError,
  } = usePhaseSelector(gameId);

  const handleChange = (
    e: React.ChangeEvent<{
      name?: string | undefined;
      value: unknown;
    }>
  ) => {
    const value = e.target.value;
    setPhase(value as number);
  };

  if (isLoading || isError || !phases || !selectedPhase) return <></>;

  return (
    <Card className={classes.root} title={t(tk.phaseSelector.title)}>
      <IconButton
        onClick={setPreviousPhase}
        disabled={selectedPhase === 1}
        title={t(tk.phaseSelector.previousButton.title)}
      >
        <PreviousIcon />
      </IconButton>
      <FormControl variant="standard">
        <InputLabel id="phase-select">
          Phase
        </InputLabel>
        <Select
          labelId="phase-select"
          value={selectedPhase}
          onChange={handleChange}
        >
          {phases.map((phase) => (
            <MenuItem key={phase[0]} value={phase[0]}>
              {phase[1]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <IconButton
        onClick={setNextPhase}
        disabled={selectedPhase === phases.length}
        title={t(tk.phaseSelector.nextButton.title)}
      >
        <NextIcon />
      </IconButton>
    </Card>
  );
};

export default PhaseSelector;
