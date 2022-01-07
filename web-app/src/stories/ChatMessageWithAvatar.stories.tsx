import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import * as ChatMessageStories from "./ChatMessage.stories";
import * as NationAvatarStories from "./NationAvatar.stories";
import Component from "../components/Chat/ChatMessageWithAvatar";
import ChatMessage from "../components/Chat/ChatMessage";
import NationAvatar from "../components/NationAvatar";

export default {
  title: "components/ChatMessageWithAvatar",
  component: Component,
} as ComponentMeta<typeof Component>;

type ChatMessageProps = React.ComponentProps<typeof ChatMessage>
const mediumMessageArgs = ChatMessageStories.Medium.args as ChatMessageProps;
const selfishMessageArgs = ChatMessageStories.Selfish.args as ChatMessageProps;

type NationAvatarProps = React.ComponentProps<typeof NationAvatar>
const franceNationAvatarArgs = NationAvatarStories.France.args as NationAvatarProps;

const FranceTemplate: ComponentStory<typeof Component> = (args) => (
  <Component {...args}>
      <ChatMessageStories.Medium {...mediumMessageArgs} />
      <NationAvatarStories.France {...franceNationAvatarArgs} />
  </Component>
);

export const France = FranceTemplate.bind({});
France.args = {
  selfish: true,
}

const NotSelfishTemplate: ComponentStory<typeof Component> = (args) => (
  <Component {...args}>
      <ChatMessageStories.Selfish {...selfishMessageArgs} />
      <NationAvatarStories.France {...franceNationAvatarArgs} />
  </Component>
);

export const Selfish = NotSelfishTemplate.bind({});
Selfish.args = {
  selfish: false,
}