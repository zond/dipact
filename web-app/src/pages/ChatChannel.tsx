import React from "react";
import { Container, Typography } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';

import { GoBackIcon } from "../icons";
import { generatePath, useParams } from "react-router-dom";
import ChatMessageInput from "../components/Chat/ChatMessageInput";
import ChatMessagesList from "../components/Chat/ChatMessagesList";
import useChatChannel from "../hooks/useChatChannel";
import Loading from "../components/Loading";
import { RouteConfig } from "./RouteConfig";
import { getNationAvatarGroupFromChannel } from "../components/Chat/utils";
import NavItem from "../components/NavItem";
import ErrorMessage from "../components/ErrorMessage";

interface ChatChannelUrlParams {
  gameId: string;
  channelId: string;
}

const useStyles = makeStyles((theme) => ({
  buttonGroup: {
    width: "100%",
  },
  title: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(1),
    gap: theme.spacing(1),
  },
  channelTitle: {
    width: "calc(100% - 96px)",
    textAlign: "left",
    textTransform: "initial",
  },
  messagesContainer: {
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
  const { channel, messages, isLoading, sendMessage, undelivered, isError, error } = useChatChannel()(gameId, channelId);

  const goBackPath = generatePath(RouteConfig.GameChat, { gameId });

  if (isError && error) return <ErrorMessage error={error} />;
  if (isLoading || !channel || !messages) return <Loading />;

  const nationAvatarGroup = getNationAvatarGroupFromChannel(channel);

  return (
    <>
      <Container className={classes.messagesContainer}>
        <div className={classes.title} data-testid="channel-top-bar">
          <NavItem href={goBackPath} edge="start" label="back">
            <GoBackIcon />
          </NavItem>
          {nationAvatarGroup}
          <Typography component={"h2"} className={classes.channelTitle}>
            {channel.title}
          </Typography>
        </div>
        <div>
          <ChatMessagesList messages={messages} newAfter={1} />
        </div>
        {channel.member && (
          <div>
            <ChatMessageInput onSendMessage={sendMessage} undelivered={undelivered} />
          </div>
        )}
      </Container>
    </>
  );
};

export default ChatChannel;
