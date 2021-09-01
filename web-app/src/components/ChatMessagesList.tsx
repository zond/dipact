import { makeStyles } from "@material-ui/core";
import React from "react";
import ChatMessage from "./ChatMessage";
import ChatNewMessagesBanner from "./ChatNewMessagesBanner";
import ChatPhaseDivider from "./ChatPhaseDivider";
import NationAvatar, { withMuted } from "./NationAvatar";
import * as helpers from "../helpers";

interface Message {
  Properties: {
    ID: string;
    Sender: string;
    Body: string;
    CreatedAt: string;
  };
  undelivered: boolean;
  phase: {
    Name: string;
    Properties: {
      PhaseOrdinal: string;
    };
  };
}

interface ChatMessagesListProps {
  messages: Message[];
  userNation: string;
  newAfter: number;
  variant: any;
  gameState: any;
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
  userNation,
  newAfter,
  variant,
  gameState,
}: ChatMessagesListProps): React.ReactElement => {
  const classes = useStyles();

  return (
    <>
      {messages.map((message, index) => {
        const { Properties, undelivered, phase } = message;
        const { ID, Sender, Body, CreatedAt } = Properties;
        const selfish = userNation === Sender;
        const { color, muted } =
          helpers.getNationAvatarProps(Sender, variant, gameState);

        const avatar = (
          <NationAvatar nation={Sender} variant={variant.Name} onClick={() => {}} />
        );
        const wrappedAvatar = muted ? withMuted(avatar) : avatar;
        const previousMessage = messages[index - 1];

        const isFirstMessage = index === 0;
        const isFirstMessageOfPhase =
          phase.Properties.PhaseOrdinal !==
          previousMessage?.phase.Properties.PhaseOrdinal;

        const showChatPhaseDivider =
          message.phase && (isFirstMessage || isFirstMessageOfPhase);

        const isNewMessage =
          message.Properties.CreatedAt &&
          newAfter < Date.parse(CreatedAt) &&
          (isFirstMessage ||
            newAfter >= Date.parse(previousMessage.Properties.CreatedAt));

        return (
          <React.Fragment key={message.Properties.ID}>
            {showChatPhaseDivider && (
              <div className={classes.phaseDividerContainer}>
                <ChatPhaseDivider phase={phase.Name} />
              </div>
            )}
            {isNewMessage && <ChatNewMessagesBanner />}
            <ChatMessage
              key={ID}
              name={""}
              undelivered={undelivered}
              color={color}
              nation={Sender}
              text={Body}
              time={helpers.timeStrToDateTime(CreatedAt)}
              selfish={selfish}
              avatar={wrappedAvatar}
            />
          </React.Fragment>
        );
      })}
    </>
  );
};

export default ChatMessagesList;
