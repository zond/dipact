import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  makeStyles,
  Typography,
} from "@material-ui/core";

import * as helpers from "../helpers";
import useRegisterPageView from "../hooks/useRegisterPageview";
import useSearchParams from "../hooks/useSearchParams";

const DISCORD_URL = "https://discord.com/invite/bu3JxYc";
const FORUM_URL = "https://groups.google.com/g/diplicity-talk";

const PROMPT_1 = "If you find a bug, please report it on our Chat or Forum:";
const PROMPT_2 =
  "Below are error codes you can report to the developers. Click on one to copy it to Clipboard.";
const SNACKBAR_MESSAGE = "Error copied to clipboard";
const ERRORS_LIST_HEADER = "Bug report info";
const NO_ERRORS_FOUND_MESSAGE = "No errors found";
const CLOSE_DIALOG_PROMPT = "Close";

const useStyles = makeStyles((theme) => ({
  dialogAction: {
    backgroundColor: theme.palette.background.paper,
    position: "sticky",
    bottom: "0px",
  },
  paper: {
    margin: theme.spacing(0.25),
    width: "100%",
  },
}));

const ErrorsDialog = () => {
  useRegisterPageView("ErrorsDialog");
  const classes = useStyles();
  const [errors, setErrors] = useState<any[]>([]);
  useEffect(() => {
    const localStorageErrors = JSON.parse(
      localStorage.getItem("errors") || "[]"
    );
    setErrors(localStorageErrors);
  }, []);
  const { removeParam } = useSearchParams();
  const onClickClose = () => removeParam("error-log");

  return (
    <Dialog
      classes={{ paper: classes.paper }}
      open={true}
      onClose={onClickClose}
    >
      <DialogTitle>{ERRORS_LIST_HEADER}</DialogTitle>
      <DialogContent>
        <Typography>{PROMPT_1}</Typography>
        <Typography>
          <a href={DISCORD_URL}>{DISCORD_URL}</a>
        </Typography>
        <Typography>
          <a href={FORUM_URL}>{FORUM_URL}</a>
        </Typography>
        <Typography>{PROMPT_2}</Typography>
        {errors.length > 0 ? (
          <List>
            {errors.map((error, idx) => {
              return (
                <ListItem key={idx}>
                  <Button
                    style={{ textTransform: "none" }}
                    variant="outlined"
                    onClick={(_) => {
                      helpers.copyToClipboard(JSON.stringify(error)).then(
                        (_) => {
                          helpers.snackbar(SNACKBAR_MESSAGE);
                        },
                        (err) => {
                          console.log(err);
                        }
                      );
                    }}
                  >
                    {error.message}
                  </Button>
                </ListItem>
              );
            })}
          </List>
        ) : (
          <Typography>{NO_ERRORS_FOUND_MESSAGE}</Typography>
        )}
        <DialogActions className={classes.dialogAction}>
          <Button onClick={onClickClose} color="primary">
            {CLOSE_DIALOG_PROMPT}
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

const initialValues = { open: () => {}, close: () => {} };

export const ErrorDialogContext = React.createContext<ErrorDialogOptions>(
  initialValues
);

interface ErrorDialogContextWrapperProps {
  children: React.ReactNode;
}

interface ErrorDialogOptions {
  open: () => void;
  close: () => void;
}

const ErrorDialogWrapper = ({
  children,
}: ErrorDialogContextWrapperProps): React.ReactElement => {
  const { getParam } = useSearchParams();
  const open = getParam("error-log");

  return (
    <>
      {open && <ErrorsDialog />}
      {children}
    </>
  );
};

export default ErrorDialogWrapper;
