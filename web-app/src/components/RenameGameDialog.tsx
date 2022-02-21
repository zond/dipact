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
  useGetRootQuery,
  useLazyGetGameQuery,
  useRenameGameMutation,
} from "../hooks/service";
import { registerEvent, registerPageView } from "../hooks/useRegisterPageview";
import useSearchParams from "../hooks/useSearchParams";
import { useTranslation } from "react-i18next";
import { translateKeys as tk } from "@diplicity/common";

export const searchKey = "rename-game-dialog";

const useStyles = makeStyles((theme) => ({
  input: {
    margin: theme.spacing(1, 0),
    width: "100%",
  },
}));

const RenameGameDialog = (): React.ReactElement => {
  const { t } = useTranslation();
  const { getParam, removeParam } = useSearchParams();
  const gameId = getParam(searchKey);
  const open = Boolean(gameId);
  const [name, setName] = useState("");
  const classes = useStyles();

  const [
    getGameTrigger,
  ] = useLazyGetGameQuery();
  const userQuery = useGetRootQuery(undefined);
  const user = userQuery.data;
  const [renameGame, renameGameQuery] = useRenameGameMutation();

  const close = useCallback(() => {
    removeParam(searchKey);
    setName("");
  }, [removeParam]);

  useEffect(() => {
    if (gameId) registerPageView("RenameGameDialog");
    if (gameId) getGameTrigger(gameId);
  }, [gameId, getGameTrigger]);

  useEffect(() => {
    if (renameGameQuery.isSuccess) {
      registerEvent("game_list_element_rename");
    }
  }, [renameGameQuery.isSuccess]);

  const onSelected = () => {
    renameGame({
      gameId: gameId as string,
      userId: user?.Id as string,
      GameAlias: name,
    });
    removeParam(searchKey);
  };

  const disabled = renameGameQuery.isLoading || name.length < 1;

  return (
    <Dialog open={open} onClose={close}>
      <DialogTitle>{t(tk.renameGameDialog.title)}</DialogTitle>
      <DialogContent>
        <TextField
          label={t(tk.renameGameDialog.renameInput.label)}
          className={classes.input}
          inputProps={{ min: 0, max: 60 * 24 * 30 }}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <DialogActions>
          <Button onClick={close}>{t(tk.renameGameDialog.cancelButton.label)}</Button>
          <Button onClick={onSelected} disabled={disabled}>
            {t(tk.renameGameDialog.renameButton.label)}
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

export default RenameGameDialog;
