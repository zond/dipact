import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import Component from "../components/Chat/ChatChannelPreview";
import * as NationAvatarStories from "./NationAvatar.stories";
import { Message } from "@diplicity/common";
import { Channel } from "../hooks/types";

export default {
  title: "components/Chat/ChatChannelPreview",
  component: Component,
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => {
  const style = {
    width: "600px",
    border: "none",
    background: "none",
    display: "flex",
  };
  return (
    <button style={style}>
      <Component {...args} />
    </button>
  );
};

const defaultLatestMessage: Message = {
  ID: "123",
  GameID: "123",
  ChannelMembers: ["England", "France", "Germany"],
  Sender: "England",
  Body: "Hello fellow players.",
  CreatedAt: "",
  Age: 0,
};

const defaultChannel: Channel = {
  GameID: "123",
  Members: ["England", "France", "Germany"],
  id: "England,France,Germany",
  NMessages: 3,
  LatestMessage: {
    ...defaultLatestMessage,
  },
  title: "England, France, Germany",
  nations: [
    {
      name: "England",
      color: NationAvatarStories.England.args?.color as string,
      link: NationAvatarStories.England.args?.link,
      abbreviation: NationAvatarStories.England.args
        ?.nationAbbreviation as string,
    },
    {
      name: "France",
      color: NationAvatarStories.France.args?.color as string,
      link: NationAvatarStories.France.args?.link,
      abbreviation: NationAvatarStories.France.args
        ?.nationAbbreviation as string,
    },
    {
      name: "Germany",
      color: NationAvatarStories.Germany.args?.color as string,
      link: NationAvatarStories.Germany.args?.link,
      abbreviation: NationAvatarStories.Germany.args
        ?.nationAbbreviation as string,
    },
  ],
};

const defaultArgs = {
  channel: { ...defaultChannel },
};

export const Default = Template.bind({});
Default.args = { ...defaultArgs };

export const UserIsSender = Template.bind({});
UserIsSender.args = {
  ...defaultArgs,
  channel: { ...defaultChannel, member: { Nation: "England" } },
};

export const MessagesSince = Template.bind({});
MessagesSince.args = {
  ...defaultArgs,
  channel: { ...defaultChannel, member: { Nation: "England" }, NMessagesSince: { Since: "", NMessages: 2 } },
};

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
