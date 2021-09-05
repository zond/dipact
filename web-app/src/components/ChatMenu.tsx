import {
  Typography,
  makeStyles,
  Slide,
  ButtonGroup,
  Button,
  Fab,
} from "@material-ui/core";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useListChannelsQuery } from "../hooks/service";
import { CreateMessageIcon } from "../icons";
import { Channel } from "../store/types";
import ChatChannel from "./ChatChannel";
import ChatChannelPreview from "./ChatChannelPreview";
import ChatCreateChannelDialog from "./ChatCreateChannelDialog";
import Loading from "./Loading";

interface ChatMenuProps {
  channels: Channel[] | undefined;
  isLoading: boolean;
}

interface ChatMenuUrlParams {
  gameId: string;
}

const useStyles = makeStyles((theme) => ({
  root: {
    position: "relative",
    height: "100%",
  },
  chatChannelContainer: {
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    background: theme.palette.background.paper,
    position: "absolute",
    zIndex: 1200,
  },
  buttonGroup: {
    width: "100%",
    height: "100%",
    transform: "translateZ(0)",
    webkittransform: "translateZ(0)",
  },
  button: {
    width: "100%",
    justifyContent: "left",
    paddingTop: "12px",
    paddingBottom: "12px",
    border: "none",
    borderBottom: "1px solid rgb(40,26,26,0.1)",
    borderRadius: "0px",
  },
  createNewMessageButton: {
    margin: "0px",
    top: "auto",
    right: "20px",
    bottom: "20px",
    left: "auto",
    position: "fixed",
    display: "flex",
  },
}));

export const ChatMenu = ({
  channels,
  isLoading,
}: ChatMenuProps): React.ReactElement => {
  const { gameId } = useParams<ChatMenuUrlParams>();
  const [createChannelDialogOpen, setCreateChannelDialogOpen] = useState(false);
  const classes = useStyles();

  if (isLoading || !channels) return <Loading />;

  return (
    <div className={classes.root}>
      <Slide
        direction="up"
        // in={!!this.state.activechannel}
        mountOnEnter
        unmountOnExit
      >
        <div className={classes.chatChannelContainer}>
          <ChatChannel />
        </div>
      </Slide>
      {!channels.length && <Typography>no chat channels currently.</Typography>}
      <ButtonGroup orientation="vertical" className={classes.buttonGroup}>
        {channels.map((channel) => {
          return (
            <Button
              className={classes.button}
              // onClick={() => openchannel(channel)}
              key={channel.Members.join(",")}
            >
              <ChatChannelPreview channel={channel} />
            </Button>
          );
        })}
      </ButtonGroup>
      <Fab
        className={classes.createNewMessageButton}
        color="secondary"
        aria-label="edit"
        onClick={() => setCreateChannelDialogOpen(true)}
      >
        <CreateMessageIcon />
      </Fab>
      <ChatCreateChannelDialog
        open={createChannelDialogOpen}
        gameId={gameId}
        onClose={() => setCreateChannelDialogOpen(false)}
        nations={["France", "England", "Germany"]}
        userNation={"England"}
      />
    </div>
  );
};

const ChatMenuContainer = (): React.ReactElement => {
  const { gameId } = useParams<ChatMenuUrlParams>();
  const { data: channels, isLoading } = useListChannelsQuery(gameId);

  return <ChatMenu channels={channels} isLoading={isLoading} />;
};

export default ChatMenuContainer;
