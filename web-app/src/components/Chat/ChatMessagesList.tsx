import { makeStyles } from "@material-ui/core";
import React from "react";
import ChatMessage from "./ChatMessage";
import ChatNewMessagesBanner from "./ChatNewMessagesBanner";
import ChatPhaseDivider from "./ChatPhaseDivider";
import NationAvatar, { withMuted } from "../NationAvatar";
import { getPhaseName } from "../../utils/general";
import ChatMessageWithAvatar from "./ChatMessageWithAvatar";
import { Message } from "../../hooks/types";

interface ChatMessagesListProps {
  messages: Message[];
  newAfter: number;
}

const useStyles = makeStyles((theme) => ({
  phaseDividerContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));

const ChatMessagesList = ({
  messages,
  newAfter,
}: ChatMessagesListProps): React.ReactElement => {
  const classes = useStyles();

  return (
    <>
      {messages.map((message, index) => {
        const {
          ID,
          Sender,
          CreatedAt,
          phase,
          color,
          nationAbbreviation,
          link,
          selfish,
        } = message;

        // TODO
        const muted = false;

        const avatar = (
          <NationAvatar
            nation={Sender}
            color={color}
            nationAbbreviation={nationAbbreviation}
            link={link}
            onClick={() => {}}
          />
        );
        const wrappedAvatar = muted ? withMuted(avatar) : avatar;
        const previousMessage = messages[index - 1];

        const isFirstMessage = index === 0;
        const isFirstMessageOfPhase =
          phase.PhaseOrdinal !== previousMessage?.phase.PhaseOrdinal;

        const showChatPhaseDivider =
          message.phase && (isFirstMessage || isFirstMessageOfPhase);

        const isNewMessage =
          message.CreatedAt &&
          newAfter < Date.parse(CreatedAt) &&
          (isFirstMessage || newAfter >= Date.parse(previousMessage.CreatedAt));

        return (
          <React.Fragment key={message.ID}>
            {showChatPhaseDivider && (
              <div className={classes.phaseDividerContainer}>
                <ChatPhaseDivider phase={getPhaseName(phase)} />
              </div>
            )}
            {isNewMessage && <ChatNewMessagesBanner />}
            <ChatMessageWithAvatar selfish={selfish}>
              {wrappedAvatar}
              <ChatMessage key={ID} message={message} avatar={wrappedAvatar} />
            </ChatMessageWithAvatar>
          </React.Fragment>
        );
      })}
    </>
  );
};
export default ChatMessagesList;
