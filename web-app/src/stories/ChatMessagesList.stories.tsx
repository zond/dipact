import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import Component from "../components/ChatMessagesList";
import { ChatMessagesListStub as Stub, EnhancedMessage } from "../hooks/useChatMessagesList";

export default {
  title: "components/ChatMessagesList",
  component: Component,
} as ComponentMeta<typeof Component>;

type StubbedComponentProps = Parameters<typeof Component>[0] & {
  Context: React.Context<any>;
  stubbedValues: any;
};

const StubbedComponent = ({
  Context,
  stubbedValues,
  ...args
}: StubbedComponentProps) => {
  return (
    <Stub.Provider value={() => stubbedValues}>
      <Component {...args} />
    </Stub.Provider>
  );
};

const Template: ComponentStory<typeof StubbedComponent> = (args) => {
  return <StubbedComponent {...args} />;
};

const defaultStubbedValues = {
  isLoading: false,
  messages: [],
  variant: "Classical",
};

const defaultArgs = {
  gameId: "1234",
  channelId: "1234",
  newAfter: 1,
  stubbedValues: {
    ...defaultStubbedValues,
  },
};

const message: EnhancedMessage = {
    ID: "1",
    GameID: "1234",
    ChannelMembers: ["France", "England"],
    Sender: "France",
    Body: "Hello there. This is a message of medium length. Don't you agree?",
    time: "07:11:49 01/08/2021",
    phase: {
        Season: "Spring",
        Type: "Movement",
        Year: 1901,
    },
    undelivered: false,
}

export const Loading = Template.bind({});

export const NoMessages = Template.bind({});

export const OneMessage = Template.bind({});
OneMessage.args = {
  ...defaultArgs,
  stubbedValues: {
    ...defaultStubbedValues,
    messages: [message]
  }
};

export const MultipleMessages = Template.bind({});

export const UndeliveredMessage = Template.bind({});
