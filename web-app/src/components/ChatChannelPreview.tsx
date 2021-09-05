import { makeStyles, Typography, Badge } from "@material-ui/core";
import React from "react";
import { variant, member } from "../store/testData";
import { Channel } from "../store/types";
import NationAvatar from "./NationAvatar";
import NationAvatarGroup from "./NationAvatarGroup";

const useStyles = makeStyles((theme) => ({
    messagePreviewContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        marginLeft: "8px",
        minWidth: "0",
    },
    messagePreviewTitle: {
        textTransform: "none",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whitespace: "nowrap",
        width: "100%",
        textAlign: "left",
    },
    messagePreviewText: {
        textTransform: "none",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whitespace: "nowrap",
        width: "100%",
        textAlign: "left",
    },
}))

interface ChatChannelPreviewProps {
    channel: Channel;
}

const withMessagesSince = (component: React.ReactElement, channel: any) => (
    <Badge
        badgeContent={
            channel.Properties.NMessagesSince.NMessages
        }
        overlap="circle"
        color="primary"
    >{component}</Badge>
)

const ChatChannelPreview = ({ channel }: ChatChannelPreviewProps): React.ReactElement => {

    const classes = useStyles();

    const avatars = channel.Members.map((nation) => {
        return <NationAvatar key={nation} nation={nation} variant={variant.Name} />
    });
    const nationAvatarGroup = <NationAvatarGroup avatars={avatars} />;
    const showMessagesSinceBadge = member &&
        channel.NMessagesSince &&
        channel.NMessagesSince.NMessages > 0

    const channelParticipants = "Everyone";
    const channelTitle = `${channelParticipants} (${channel.NMessages})`;

    const messagePreviewSentByUser = member.Nation === channel.LatestMessage.Sender;
    const messagePreviewSenderLabel = messagePreviewSentByUser ? "you: " : `${channel.LatestMessage.Sender}: `

    return (
        <>
            {showMessagesSinceBadge ? withMessagesSince(nationAvatarGroup, channel) : nationAvatarGroup}
            {channel.NMessages &&
                channel.LatestMessage && (
                    <div className={classes.messagePreviewContainer}>
                        <Typography variant="body1" className={classes.messagePreviewTitle}>
                            {channelTitle}
                        </Typography>
                        <Typography variant="body2" className={classes.messagePreviewText}>
                            {messagePreviewSenderLabel} {channel.LatestMessage.Body}
                        </Typography>
                    </div>
                )}
        </>
    );
};

export default ChatChannelPreview;


