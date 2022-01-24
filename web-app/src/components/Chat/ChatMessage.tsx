import React from "react";
import * as helpers from "../../helpers";

import { Theme, Typography } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import { alpha } from "@mui/material/styles";
import { Message } from "../../hooks/useChatMessagesList";

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
    padding: theme.spacing(1),
    backgroundColor: ({ color }) => color + "19",
    borderRadius: ({ selfish }) =>
      selfish
        ? theme.spacing(1.5, 0, 1.5, 1.5)
        : theme.spacing(0, 1.5, 1.5, 1.5),
    border: ({ bright, color }) => (bright ? "1px solid " + color : "none"),
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

export const ChatMessage = ({
  message,
}: ChatMessageProps): React.ReactElement => {
  const {
    Sender: nation,
    Body,
    undelivered,
    CreatedAt,
    color,
    selfish,
  } = message;
  const name = "";
  const bright = Boolean((helpers.brightnessByColor(color) || 0) > 128);
  const time = helpers.timeStrToDateTime(CreatedAt);
  const classes = useStyles({ selfish, bright, color });
  return (
    <div className={classes.root} data-testid="message">
      <Typography
        variant={"subtitle2"}
        className={classes.name + " message-sender"}
      >
        {name} {nation}
      </Typography>
      <Typography className={classes.text + " message-text"}>
        {helpers.linkify(Body)}
      </Typography>
      <Typography
        variant={"caption"}
        className={classes.status + " message-status"}
      >
        {undelivered ? "Sending..." : time}
      </Typography>
    </div>
  );
};

export default ChatMessage;
