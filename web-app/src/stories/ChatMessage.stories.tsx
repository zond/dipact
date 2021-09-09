import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from "../components/Chat/ChatMessage";
import { Message } from "../hooks/useChatMessagesList";
import { Phase } from "../store/types";
import { phase } from "../store/testData";

export default {
  title: "components/ChatMessage",
  component: Component,
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <Component {...args} />
);

const defaultPhase: Phase = {
  ...phase
}

const defaultMessage: Message = {
  ID: "123",
  GameID: "123",
  ChannelMembers: [],
  Sender: "England",
  Body: "Hello there. This is a message of medium length. Don't you agree?",
  CreatedAt: "2021-07-31T11:32:12.836819Z",
  Age: 1,
  phase: { ...defaultPhase },
  undelivered: false,
  color: "#80DEEA",
  variant: "Classical",
  selfish: false,
  nationAbbreviation: "Eng",
  link: "https://diplicity-engine.appspot.com/Variant/Classical/Flags/England.svg",
}

const defaultArgs = {
  message: {
    ...defaultMessage
  },
};

export const Short = Template.bind({});
Short.args = {
  ...defaultArgs,
  message: {
    ...defaultMessage,
    Body: "Short message",
  }
};

export const Medium = Template.bind({});
Medium.args = {
  ...defaultArgs,
};

export const Long = Template.bind({});
Long.args = {
  message: {
    ...defaultMessage,
    Body: "This is a reminder that the current phase will resolve in 1h0m0s (at 31 Jul 21 12:32 UTC), and you haven't declared that you are ready for the next phase. If you don't declare ready you will lose Quickness score. If you don't declare ready and don't provide any orders you will lose Reliability score, and be evicted from all staging game queues.",
  }
};
export const Undelivered = Template.bind({});
Undelivered.args = {
  ...defaultArgs,
  message: { 
    ...defaultMessage,
    undelivered: true,
    selfish: true,
  },
};

export const DarkColor = Template.bind({});
DarkColor.args = {
  ...defaultArgs,
  message: {
    ...defaultMessage,
    color: "#005991",
  }
};

export const Selfish = Template.bind({});
Selfish.args = {
  ...defaultArgs,
  message: {
    ...defaultMessage,
    selfish: true,
  }
};

// Long.decorators = [getChatMessageStubDecorator({ color: "#000000"})];