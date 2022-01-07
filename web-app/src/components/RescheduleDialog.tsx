import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import React, { useCallback, useEffect, useState } from "react";
import {
  useLazyGetGameQuery,
  useRescheduleGameMutation,
} from "../hooks/service";
import { registerEvent, registerPageView } from "../hooks/useRegisterPageview";
import useSearchParams from "../hooks/useSearchParams";

export const searchKey = "reschedule-dialog";

const useStyles = makeStyles((theme) => ({
  input: {
    margin: theme.spacing(1, 0),
    width: "100%",
  },
}));

const RESCHEDULE_DIALOG_TITLE = "Reschedule game";
const RESCHEDULE_DEADLINE_INPUT_LABEL = "New next deadline in minutes";
const RESCHEDULE_BUTTON_LABEL = "Reschedule";
const CANCEL_BUTTON_LABEL = "Cancel";

const RescheduleDialog = (): React.ReactElement => {
  const { getParam, removeParam } = useSearchParams();
  const gameId = getParam(searchKey);
  const open = Boolean(gameId);
  const [minutes, setMinutes] = useState(60);
  const classes = useStyles();

  const [
    getGameTrigger,
    { data: game }
  ] = useLazyGetGameQuery();
  const [
    rescheduleGame,
    { isLoading, isSuccess },
  ] = useRescheduleGameMutation();

  const close = useCallback(() => {
    removeParam(searchKey);
  }, [removeParam]);

  useEffect(() => {
    if (gameId) registerPageView("RescheduleDialog");
    if (gameId) getGameTrigger(gameId);
  }, [gameId, getGameTrigger]);

  useEffect(() => {
    if (isSuccess) {
      registerEvent("game_list_element_reschedule");
      close();
    }
  }, [close, isSuccess]);

  const onSelected = () => {
    rescheduleGame({
      gameId: gameId as string,
      PhaseOrdinal: game?.NewestPhaseMeta?.[0].PhaseOrdinal as number,
      NextPhaseDeadlineInMinutes: minutes,
    });
  };

  return (
    <Dialog open={open} onClose={close}>
      <DialogTitle>{RESCHEDULE_DIALOG_TITLE}</DialogTitle>
      <DialogContent>
        <TextField
          label={RESCHEDULE_DEADLINE_INPUT_LABEL}
          className={classes.input}
          type="number"
          inputProps={{ min: 0, max: 60 * 24 * 30 }}
          value={minutes}
          onChange={(e) => setMinutes(parseInt(e.target.value))}
        />
        <DialogActions>
          <Button onClick={close}>{CANCEL_BUTTON_LABEL}</Button>
          <Button onClick={onSelected} disabled={isLoading}>
            {RESCHEDULE_BUTTON_LABEL}
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

export default RescheduleDialog;
