import { Typography, Badge, Theme } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import React from "react";
import { Channel } from "../../hooks/types";
import { getNationAvatarGroupFromChannel } from "./utils";

interface StyleProps {
  messagePreviewSentByUser: boolean;
}
const useStyles = makeStyles<Theme, StyleProps>((theme) => ({
  root: {
    display: "flex",
    gap: theme.spacing(1),
  },
  messagePreviewContainer: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },
  messagePreviewTitle: {
    textTransform: "none",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    textAlign: "left",
  },
  messagePreviewText: {
    textTransform: "none",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    width: "100%",
    textAlign: "left",
  },
  messagePreviewLabel: {
    display: "inline",
    fontStyle: ({ messagePreviewSentByUser }) =>
      messagePreviewSentByUser ? "italic" : "inherit",
  },
}));

interface ChatChannelPreviewProps {
  channel: Channel;
}

const withMessagesSince = (component: React.ReactElement, channel: Channel) => (
  <Badge
    badgeContent={channel?.NMessagesSince?.NMessages}
    overlap="circular"
    color="primary"
  >
    {component}
  </Badge>
);

const ChatChannelPreview = ({
  channel,
}: ChatChannelPreviewProps): React.ReactElement => {
  const nationAvatarGroup = getNationAvatarGroupFromChannel(channel);
  const showMessagesSinceBadge =
    channel.member &&
    channel.NMessagesSince &&
    channel.NMessagesSince.NMessages > 0;

  const messagePreviewSentByUser =
    channel.member?.Nation === channel.LatestMessage.Sender;
  const messagePreviewSenderLabel = messagePreviewSentByUser
    ? "You: "
    : `${channel.LatestMessage.Sender}: `;

  const classes = useStyles({ messagePreviewSentByUser });

  return (
    <div className={classes.root}>
      {showMessagesSinceBadge
        ? withMessagesSince(nationAvatarGroup, channel)
        : nationAvatarGroup}
      {channel.NMessages && channel.LatestMessage && (
        <div
          title="Chat channel preview"
          className={classes.messagePreviewContainer}
        >
          <Typography
            component={"h4"}
            variant="body1"
            className={classes.messagePreviewTitle}
          >
            {`${channel.title} (${channel.NMessages})`}
          </Typography>
          <Typography
            component="span"
            variant="body2"
            className={classes.messagePreviewText}
          >
            <Typography variant="body2" title={"sender"} className={classes.messagePreviewLabel}>
              {messagePreviewSenderLabel}
            </Typography>
            {channel.LatestMessage.Body}
          </Typography>
        </div>
      )}
    </div>
  );
};

export default ChatChannelPreview;
