import { CircularProgress, makeStyles, Theme } from "@material-ui/core";
import React from "react";
import { useTranslation } from "react-i18next";
import { translateKeys as tk } from "@diplicity/common";

const useStyles = makeStyles<Theme, StyleProps>((theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    padding: ({ space }) => theme.spacing(space, 0),
  },
}));

interface LoadingProps {
  space: number;
}

const defaultProps = {
  space: 1,
};

type StyleProps = LoadingProps;

const Loading = ({ space }: LoadingProps): React.ReactElement => {
  const classes = useStyles({ space });
  const { t } = useTranslation();
  return (
    <div className={classes.root}>
      <CircularProgress title={t(tk.loading.title)} />
    </div>
  );
};

Loading.defaultProps = defaultProps;

export default Loading;
