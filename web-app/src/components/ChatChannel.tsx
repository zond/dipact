/* eslint-disable no-restricted-globals */
import React from "react";
import { Button, ButtonGroup } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";

import { ExpandIcon } from "../icons";
import NationAvatarGroup from "./NationAvatarGroup";
import {
  RouteComponentProps,
  useParams,
  withRouter,
} from "react-router-dom";
import NationAvatar from "./NationAvatar";
import ChatMessageInput from "./ChatMessageInput";
import ChatMessagesList from "./ChatMessagesList";
import { useGetGameQuery, useListMessagesQuery } from "../hooks/service";

interface StyleProps {
  selfish: boolean;
  bright: boolean;
  color: string;
}

interface ChatMessageProps extends RouteComponentProps {}

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

const renderBatchSize = 50;

const ChatChannel = ({}: ChatMessageProps): React.ReactElement => {
  const classes = useStyles();

  const { gameId, channelId } = useParams<ChatChannelUrlParams>();
  const members = channelId.split(",");

  const { isLoading, data: game } = useGetGameQuery(gameId);
  const { isLoading: messagesLoading, data: messages } = useListMessagesQuery({
    gameId,
    channelId,
  });

  const variantName = game?.Variant;

  if (isLoading) return <div>Loading...</div>;
  if (!messages) return <div>Loading...</div>;

  const close = () => {};

  const avatars = members.map((nation) => {
    return (
      <NationAvatar
        key={nation}
        nation={nation}
        variant={variantName as string}
        onClick={() => {}}
      />
    );
  });

  const channelTitle = members.length === 7 ? "Everyone" : members.join(", ");

  return (
    <div>
      <ButtonGroup orientation="vertical" className={classes.buttonGroup}>
        <Button onClick={close} className={classes.closeButton}>
          <span style={{ display: "flex" }}>
            <NationAvatarGroup avatars={avatars} />
          </span>
          <span className={classes.channelTitle}>{channelTitle}</span>
          <ExpandIcon />
        </Button>
      </ButtonGroup>
      <div className={classes.messagesContainer}>
        <div>
          <ChatMessagesList
            messages={messages}
            userNation={""}
            newAfter={1}
            variant={variantName as string}
            gameState={{}}
          />
        </div>
        <div>
          <ChatMessageInput onSendMessage={(message) => {}} />
        </div>
      </div>
    </div>
  );
};

export default withRouter(ChatChannel);
