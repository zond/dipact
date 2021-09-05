import { makeStyles, CircularProgress, Theme } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles<Theme, StyleProps>((theme) => ({
    root: {
		display: "flex",
        justifyContent: "center",
        padding: ({ space }) => theme.spacing(space, 0),
    },
}))

interface LoadingProps {
    space: number;
}

const defaultProps = {
  space: 1,
};

type StyleProps = LoadingProps;

const Loading = ({ space }: LoadingProps): React.ReactElement => {
    const classes = useStyles({ space });
  return (
    <div className={classes.root}>
	    <CircularProgress />
    </div>
  );
};

Loading.defaultProps = defaultProps;

export default Loading;

