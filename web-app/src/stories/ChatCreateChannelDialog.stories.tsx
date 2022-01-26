import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import Component from "../components/Chat/ChatCreateChannelDialog";

export default {
  title: "components/Chat/ChatCreateChannelDialog",
  component: Component,
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <Component {...args} />
);

const defaultArgs = {
  open: true,
  onClose: () => {},
  nations: ["England", "France", "Germany", "Russia"],
  userNation: "England",
  gameId: "1234",
  validationMessage: null,
  createChannel: (nations: string[]) => {},
};

export const Open = Template.bind({});
Open.args = {
  ...defaultArgs,
};
export const Closed = Template.bind({});
Closed.args = {
  ...defaultArgs,
  open: false,
};
export const Loading = Template.bind({});
Loading.args = {
  ...defaultArgs,
};
