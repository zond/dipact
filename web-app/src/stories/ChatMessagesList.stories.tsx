import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import Component from "../components/Chat/ChatMessagesList";
import * as ChatMessageStories from "./ChatMessage.stories";
import { Message } from "../hooks/useChatMessagesList";

export default {
  title: "components/ChatMessagesList",
  component: Component,
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => {
  return <Component {...args} />;
};

const defaultStubbedValues = {
  isError: false,
  isLoading: false,
  messages: [],
};

const defaultArgs = {
  gameId: "1234",
  channelId: "1234",
  newAfter: 1,
  stubbedValues: {
    ...defaultStubbedValues,
  },
};

// export const Loading = Template.bind({});
// Loading.args = { ...defaultArgs };
// Loading.decorators = [getChatMessagesListDecorator({
//     ...defaultStubbedValues,
//     isLoading: true,
// })];

// export const NoMessages = Template.bind({});
// NoMessages.args = {
//   ...defaultArgs,
// }
// NoMessages.decorators = [getChatMessagesListDecorator({
//     ...defaultStubbedValues,
// })];

// export const OneMessage = Template.bind({});
// OneMessage.args = { ...defaultArgs };
// OneMessage.decorators = [getChatMessagesListDecorator({
//     ...defaultStubbedValues,
//     messages: [
//       ChatMessageStories.Medium.args?.message as Message,
//     ]
// })];

// export const MultipleMessages = Template.bind({});
// MultipleMessages.args = { ...defaultArgs };
// MultipleMessages.decorators = [getChatMessagesListDecorator({
//     ...defaultStubbedValues,
//     messages: [
//       { ...ChatMessageStories.Medium.args?.message as Message, ID: "234" },
//       { ...ChatMessageStories.Short.args?.message as Message, ID: "345" },
//       { ...ChatMessageStories.Selfish.args?.message as Message, ID: "456" },
//       { ...ChatMessageStories.Undelivered.args?.message as Message, ID: "567" },
//     ]
// })];

// export const MultiplePhases = Template.bind({});

// export const NewMessages = Template.bind({});

// export const UndeliveredMessage = Template.bind({});
