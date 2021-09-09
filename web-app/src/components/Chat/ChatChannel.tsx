import React from "react";
import {
  AppBar,
  Button,
  ButtonGroup,
  IconButton,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core";

import { ExpandIcon, GoBackIcon } from "../../icons";
import NationAvatarGroup from "../NationAvatarGroup";
import { generatePath, useHistory, useParams } from "react-router-dom";
import NationAvatar from "../NationAvatar";
import ChatMessageInput from "./ChatMessageInput";
import ChatMessagesList from "./ChatMessagesList";
import useChatChannel from "../../hooks/useChatChannel";
import Loading from "../Loading";
import { RouteConfig } from "../../pages/RouteConfig";
import { getNationAvatarGroupFromChannel } from "./utils";

interface ChatChannelUrlParams {
  gameId: string;
  channelId: string;
}

const useStyles = makeStyles((theme) => ({
  appBar: {
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.background.paper,
    "& > div": {
      display: "flex",
      gap: theme.spacing(2),
    },
    "& a": {
      color: theme.palette.text.primary,
    }
  },
  buttonGroup: {
    width: "100%",
  },
  closeButton: {
    display: "flex",
    justifyContent: "space-between",
    borderTopLeftRadius: "0px",
    borderTopRightRadius: "0px",
    marginTop: "-1px",
  },
  channelTitle: {
    width: "calc(100% - 96px)",
    textAlign: "left",
    textTransform: "initial",
  },
  messagesContainer: {
    maxWidth: "962px",
    margin: "auto",
    width: "100%",
    overflowX: "hidden",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
}));

const ChatChannel = (): React.ReactElement => {
  const classes = useStyles();
  const { gameId, channelId } = useParams<ChatChannelUrlParams>();
  const { channel, messages, isLoading } = useChatChannel()(gameId, channelId);
  const history = useHistory();

  const goBackPath = generatePath(RouteConfig.GameChat, { gameId });
  const goBack = () => {
    history.push(goBackPath);
  };

  if (isLoading || !channel || !messages) return <Loading />;

  const nationAvatarGroup = getNationAvatarGroupFromChannel(channel);

  return (
    <>
      <AppBar position="static" className={classes.appBar}>
        <Toolbar variant="dense">
          <a href={goBackPath} onClick={(e) => e.preventDefault()}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={goBack}
            >
              <GoBackIcon />
            </IconButton>
          </a>
          {nationAvatarGroup}
          <Typography component={"h2"} className={classes.channelTitle}>
            {channel.title}
          </Typography>
        </Toolbar>
      </AppBar>
      <div className={classes.messagesContainer}>
        <div>
          <ChatMessagesList messages={messages} newAfter={1} />
        </div>
        <div>
          <ChatMessageInput onSendMessage={(message) => {}} />
        </div>
      </div>
    </>
  );
};

export default ChatChannel;
