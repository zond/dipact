import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import { registerPageView } from "../hooks/useRegisterPageview";
import useSearchParams from "../hooks/useSearchParams";

export const searchKey = "reset-settings-dialog";

export const RESET_SETTINGS_DIALOG_TITLE = "Reset settings";
export const RESET_SETTINGS_DIALOG_PROMPT =
  "Are you sure you want to reset settings? This will restore all settings to the default values.";
export const RESET_BUTTON_LABEL = "Reset settings";
const CANCEL_BUTTON_LABEL = "Cancel";

const ResetSettingsDialog = (): React.ReactElement => {
  const { getParam, removeParam } = useSearchParams();
  const open = Boolean(getParam(searchKey));

  const close = () => {
    removeParam(searchKey);
  };

  useEffect(() => {
    if (open) registerPageView("ResetSettingsDialog");
  }, [open]);

  //   useEffect(() => {
  //     if (renameGameQuery.isSuccess) {
  //       registerEvent("game_list_element_rename");
  //       close();
  //     }
  //   }, [renameGameQuery.isSuccess]);

  const onClickReset = () => {};

  //   const disabled = resetSettingsQuery.isLoading;
  const disabled = false;

  return (
    <Dialog open={open} onClose={close}>
      <DialogTitle>{RESET_SETTINGS_DIALOG_TITLE}</DialogTitle>
      <DialogContent>
        <Typography>{RESET_SETTINGS_DIALOG_PROMPT}</Typography>
        <DialogActions>
          <Button onClick={close}>{CANCEL_BUTTON_LABEL}</Button>
          <Button onClick={onClickReset} disabled={disabled}>
            {RESET_BUTTON_LABEL}
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

export default ResetSettingsDialog;
