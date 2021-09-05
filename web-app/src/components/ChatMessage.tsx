import React from "react";
import * as helpers from "../helpers";

import { makeStyles, Theme, Typography } from "@material-ui/core";
import { alpha } from "@material-ui/core/styles";
import { Message } from "../hooks/useChatMessagesList";

interface StyleProps {
  selfish: boolean;
  bright: boolean;
  color: string;
}

interface ChatMessageProps {
  message: Message;
  avatar: React.ReactElement;
}

const useStyles = makeStyles<Theme, StyleProps>((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: ({ color }) => color + "19",
    borderRadius: ({ selfish }) =>
      selfish
        ? theme.spacing(1.5, 0, 1.5, 1.5)
        : theme.spacing(0, 1.5, 1.5, 1.5),
    maxWidth: "calc(100% - 70px)", // TODO remove hardcoding
    border: ({ bright, color }) => (bright ? "1px solid " + color : "none"),
    padding: theme.spacing(1),
  },
  name: {
    fontWeight: theme.typography.fontWeightBold,
  },
  text: {
    whiteSpace: "pre-wrap",
    maxWidth: "100%",
  },
  status: {
    alignSelf: "flex-end",
    color: alpha(theme.palette.text.primary, 0.3),
  },
}));

export const ChatMessage = ({ message }: ChatMessageProps): React.ReactElement => {
  const { Sender: nation, Body, undelivered, CreatedAt, color, selfish } = message;
  const name = "";
  const bright = Boolean((helpers.brightnessByColor(color) || 0) > 128);
  const time = helpers.timeStrToDateTime(CreatedAt);
  const classes = useStyles({ selfish, bright, color });
  return (
      <div className={classes.root}>
        <Typography variant={"subtitle2"} className={classes.name}>
          {name} {nation}
        </Typography>
        <Typography className={classes.text}>
          {helpers.linkify(Body)}
        </Typography>
        <Typography variant={"caption"} className={classes.status}>
          {undelivered ? "Sending..." : time}
        </Typography>
      </div>
  );
};

export default ChatMessage;
