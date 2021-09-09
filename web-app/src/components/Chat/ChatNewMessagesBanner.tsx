import { makeStyles, Typography } from "@material-ui/core";
import React from "react";

const MESSAGE = "New messages";

const useStyles = makeStyles((theme) => ({
  root: {
        justifyContent: "center",
        width: "100%",
        maxWidth: "960px",
        display: "flex",
        background:
          "repeating-linear-gradient(45deg, rgba(255,0,0,.1), rgba(255,0,0,0.1) 10px, rgba(255,0,0,0) 10px, rgba(255,0,0,0) 20px, rgba(0,0,255,0.1) 20px, rgba(0,0,255,0.1) 30px, rgba(255,255,255,0) 30px, rgba(255,255,255,0) 40px)",
        "& > *": {
            color: "#b71c1c",  // TODO remove hard-coding
        }
  },
}));

const ChatNewMessagesBanner = (): React.ReactElement => {
  const classes = useStyles();
  return (
    <div className={classes.root} >
      <Typography
        variant="subtitle2"
        display="block"
      >
        {MESSAGE}
      </Typography>
    </div>
  );
};

export default ChatNewMessagesBanner;
