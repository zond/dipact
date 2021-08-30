import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import * as AvatarStories from './NationAvatar.stories';
import Component from "../components/ChatMessage";
import NationAvatar from "../components/NationAvatar";

export default {
  title: "components/ChatMessage",
  component: Component,
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <Component {...args} />
);

const defaultArgs = {
  selfish: true,
  name: "",
  nation: "France",
  text: "Hello there. This is a message of medium length. Don't you agree?",
  time: "07:11:49 01/08/2021",
  undelivered: false,
	color: "#1ea7fd",
};

export const Short = Template.bind({});
Short.args = {
  ...defaultArgs,
  text: "Hello there",
};

export const Medium = Template.bind({});
Medium.args = {
  ...defaultArgs,
};

export const Long = Template.bind({});
Long.args = {
  ...defaultArgs,
  text: "This is a reminder that the current phase will resolve in 1h0m0s (at 31 Jul 21 12:32 UTC), and you haven't declared that you are ready for the next phase. If you don't declare ready you will lose Quickness score. If you don't declare ready and don't provide any orders you will lose Reliability score, and be evicted from all staging game queues.",
};

export const NoName = Template.bind({});
NoName.args = {
  ...defaultArgs,
  name: "",
};

export const NotSelf = Template.bind({});
NotSelf.args = {
  ...defaultArgs,
  selfish: false,
  nation: "Germany",
};

export const NotDelivered = Template.bind({});
NotDelivered.args = {
  ...defaultArgs,
  undelivered: true,
};

export const DarkColor = Template.bind({});
DarkColor.args = {
  ...defaultArgs,
  color: "#005991",
};

type NationAvatarProps = React.ComponentProps<typeof NationAvatar>
const FranceAvatarArgs = AvatarStories.France.args as NationAvatarProps;
const OttoAvatarArgs = AvatarStories.France.args as NationAvatarProps;

export const WithAvatarFrance = Template.bind({});
WithAvatarFrance.args = {
  ...defaultArgs,
  avatar: <AvatarStories.France {...FranceAvatarArgs} />
};

export const WithAvatarFranceOther = Template.bind({});
WithAvatarFranceOther.args = {
  ...defaultArgs,
  selfish: false,
  avatar: <AvatarStories.France {...FranceAvatarArgs} />
};

export const WithAvatarOtto = Template.bind({});
WithAvatarOtto.args = {
  ...defaultArgs,
  selfish: false,
  avatar: <AvatarStories.Otto {...OttoAvatarArgs} />
};

export const Username = Template.bind({});
Username.args = {
  ...defaultArgs,
  name: "Diplicity",
  selfish: false,
  nation: "",
};
