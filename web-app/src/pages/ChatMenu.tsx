import { Typography, Fab, Container } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import React, { useEffect } from "react";
import {
  generatePath,
  useHistory,
  useParams,
  useLocation,
} from "react-router-dom";
import useChatMenu from "../hooks/useChatMenu";
import { CreateMessageIcon } from "../icons";
import ChatChannelPreview from "../components/Chat/ChatChannelPreview";
import ChatCreateChannelDialog from "../components/Chat/ChatCreateChannelDialog";
import Loading from "../components/Loading";
import { RouteConfig } from "./RouteConfig";
import * as helpers from "../helpers";
import ErrorMessage from "../components/ErrorMessage";

interface ChatMenuUrlParams {
  gameId: string;
}

const useStyles = makeStyles((theme) => ({
  root: {
    "& a": {
      color: "inherit",
      textDecoration: "inherit",
    },
  },
  title: {
    padding: theme.spacing(1),
  },
  channelList: {
    "& > a > div:hover": {
      backgroundColor: theme.palette.background.default,
    },
  },
  channelPreview: {
    width: "100%",
    padding: theme.spacing(1),
  },
  buttonContainer: {
    display: "flex",
    alignItems: "flex-end",
    flexDirection: "column",
  },
  createNewMessageButton: {
    display: "flex",
  },
}));

export const CHAT_MENU_TITLE = "Chat";
export const NO_CHANNELS_MESSAGE = "No channels have been created";

const useSearchParam = (
  paramName: string
): [value: boolean, setParam: () => void, removeParam: () => void] => {
  const history = useHistory();
  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const value = Boolean(searchParams.get(paramName));
  const removeParam = () => {
    searchParams.delete(paramName);
    history.replace({
      search: searchParams.toString(),
    });
  };
  const setParam = () => {
    searchParams.set(paramName, "1");
    history.replace({
      search: searchParams.toString(),
    });
  };
  return [value, setParam, removeParam];
};

const ChatMenu = (): React.ReactElement => {
  const { gameId } = useParams<ChatMenuUrlParams>();
  const {
    channels,
    isLoading,
    isError,
    error,
    variant,
    userNation,
    validationMessage,
    createChannel,
  } = useChatMenu()(gameId);
  const [
    createChannelDialogOpen,
    openCreateChannelDialog,
    closeCreateChannelDialog,
  ] = useSearchParam("createChannelOpen");
  const history = useHistory();
  const classes = useStyles();
  useEffect(() => {
    if (validationMessage) helpers.snackbar(validationMessage);
  }, [validationMessage]);

  const getChannelPath = (channelId: string): string => {
    const urlParams = { gameId, channelId };
    return generatePath(RouteConfig.GameChatChannel, urlParams);
  };

  const showChatChannel = (channelId: string): void => {
    const path = getChannelPath(channelId);
    history.push(path);
  };

  if (isError && error) return <ErrorMessage error={error} />;
  if (isLoading) return <Loading />;

  if (!channels || !variant) return <></>;

  return (
    <>
      <div className={classes.root}>
        <Container className={classes.channelList}>
          {channels.length ? (
            <>
              <Typography className={classes.title}>
                {CHAT_MENU_TITLE}
              </Typography>
              {channels.map((channel) => {
                const channelPath = getChannelPath(channel.id);
                return (
                  <a
                    key={channel.title}
                    href={channelPath}
                    onClick={(e) => e.preventDefault()}
                  >
                    <div
                      className={classes.channelPreview}
                      onClick={() => showChatChannel(channel.id)}
                    >
                      <ChatChannelPreview channel={channel} />
                    </div>
                  </a>
                );
              })}
            </>
          ) : (
            <Typography>{NO_CHANNELS_MESSAGE}</Typography>
          )}
          {userNation && (
            <div className={classes.buttonContainer}>
              <Fab
                title="Create channel"
                className={classes.createNewMessageButton}
                color="secondary"
                aria-label="edit"
                onClick={openCreateChannelDialog}
              >
                <CreateMessageIcon />
              </Fab>
            </div>
          )}
        </Container>
        {userNation && createChannelDialogOpen && (
          <ChatCreateChannelDialog
            createChannel={createChannel}
            open={createChannelDialogOpen}
            onClose={closeCreateChannelDialog}
            nations={variant.Nations}
            userNation={userNation}
          />
        )}
      </div>
    </>
  );
};

export default ChatMenu;
