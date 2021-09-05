import React from "react";
import { Button, ButtonGroup } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";

import { ExpandIcon } from "../icons";
import NationAvatarGroup from "./NationAvatarGroup";
import { useParams, withRouter } from "react-router-dom";
import NationAvatar from "./NationAvatar";
import ChatMessageInput from "./ChatMessageInput";
import ChatMessagesList from "./ChatMessagesList";
import { useGetGameQuery } from "../hooks/service";

interface ChatChannelUrlParams {
  gameId: string;
  channelId: string;
}

const useStyles = makeStyles((theme) => ({
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
    overflowY: "scroll",
    height: "calc(100% - 56px)",
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
  const { data: game, isLoading } = useGetGameQuery(gameId);
  const members = channelId.split(",");

  if (isLoading) return <></>;

  const close = () => {};

  const avatars = members.map((nation) => {
    return (
      <NationAvatar
        key={nation}
        nation={nation}
        variant={game?.Variant || ""}
      />
    );
  });

  const channelTitle = members.length === 7 ? "Everyone" : members.join(", ");

  return (
    <>
      <ButtonGroup orientation="vertical" className={classes.buttonGroup}>
        <Button onClick={close} className={classes.closeButton}>
          <NationAvatarGroup avatars={avatars} />
          <span className={classes.channelTitle}>{channelTitle}</span>
          <ExpandIcon />
        </Button>
      </ButtonGroup>
      <div className={classes.messagesContainer}>
        <div>
          <ChatMessagesList gameId={gameId} channelId={channelId} />
        </div>
        <div>
          <ChatMessageInput onSendMessage={(message) => {}} />
        </div>
      </div>
    </>
  );
};

export default withRouter(ChatChannel);
