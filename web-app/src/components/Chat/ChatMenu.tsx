import {
  Typography,
  makeStyles,
  Slide,
  ButtonGroup,
  Button,
  Fab,
  AppBar,
  IconButton,
  Toolbar,
  Grid,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { generatePath, useHistory, useParams } from "react-router-dom";
import useChatMenu from "../../hooks/useChatMenu";
import { Channel } from "../../hooks/types";
import { CreateMessageIcon, GoBackIcon } from "../../icons";
import ChatChannelPreview from "./ChatChannelPreview";
import ChatCreateChannelDialog from "./ChatCreateChannelDialog";
import Loading from "../Loading";
import { RouteConfig } from "../../pages/RouteConfig";
import NationAvatarGroup from "../NationAvatarGroup";

interface ChatMenuUrlParams {
  gameId: string;
}

const useStyles = makeStyles((theme) => ({
  appBar: {
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.background.paper,
    "& > div": {
      display: "flex",
      gap: theme.spacing(2),
    },
    "h6": {

    }
  },
  root: {
    position: "relative",
    height: "100%",
    '& a': {
      color: "inherit",
      cursor: "inherit",
      textDecoration: "inherit",
    }
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
  channelList: {
    '& > a > div:hover': {
      backgroundColor: "rgba(0, 0, 0, 0.04)",
    }
  },
  channelPreview: {
    width: "100%",
    borderBottom: "1px solid rgb(40,26,26,0.1)",
    padding: theme.spacing(1),
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

export const CHAT_MENU_TITLE = "Chat";
export const NO_CHANNELS_MESSAGE = "No channels have been created";

const ChatMenu = (): React.ReactElement => {
  const { gameId } = useParams<ChatMenuUrlParams>();
  const { channels, isLoading, variant, userNation } = useChatMenu()(gameId);
  const [createChannelDialogOpen, setCreateChannelDialogOpen] = useState(false);
  const history = useHistory();
  const classes = useStyles();

  const getChannelPath = (channelId: string): string => {
    const urlParams = { gameId, channelId };
    return generatePath(RouteConfig.GameChatChannel, urlParams);
  }
  const showChatChannel = (channelId: string): void => {
    const path = getChannelPath(channelId);
    history.push(path);
  };

  if (isLoading) return <Loading />;

  if (!channels || !variant) return <></>;

  return (
    <>
      <AppBar position="static" className={classes.appBar}>
        <Toolbar variant="dense">
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
          >
            <GoBackIcon />
          </IconButton>
          <Typography variant="h6">
            {CHAT_MENU_TITLE}
          </Typography>
        </Toolbar>
      </AppBar>
      <div className={classes.root}>
        {channels.length ? (
          <Grid className={classes.channelList}>
            {channels.map((channel) => {
              const channelPath = getChannelPath(channel.id);
              return (
                <a key={channel.title} href={channelPath} onClick={(e) => e.preventDefault()}>
                  <div
                    className={classes.channelPreview}
                    onClick={() => showChatChannel(channel.id)}
                  >
                    <ChatChannelPreview channel={channel} />
                  </div>
                </a>
              );
            })}
          </Grid>
        ) : (
          <Typography>{NO_CHANNELS_MESSAGE}</Typography>
        )}
        {userNation && (
          <>
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
              nations={variant.Nations}
              userNation={userNation}
            />
          </>
        )}
      </div>
    </>
  );
};

export default ChatMenu;
