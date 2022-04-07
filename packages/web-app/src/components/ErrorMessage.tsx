import { DiplicityError } from "@diplicity/common";
import { makeStyles, Typography } from "@material-ui/core";
import React from "react";
import { WarningIcon } from "../icons";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    padding: theme.spacing(1),
    color: theme.palette.error.main,
    "& > div": {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
  },
}));

interface ErrorMessageProps {
  error: DiplicityError;
}

interface ApiErrorWithStatus {
  status: number;
}
interface IMessageMap {
  [key: number]: string;
}

const messageMap: IMessageMap = {
  500: "Internal server error",
  401: "Unauthorized",
};

const ErrorMessage = (props: ErrorMessageProps): React.ReactElement => {
  const error = props.error as ApiErrorWithStatus;
  const message = error.status ? messageMap[error.status] || "" : "";
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <div>
        <WarningIcon />
        {error.status && (
          <Typography role="alert">
            {message} ({error.status})
          </Typography>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;