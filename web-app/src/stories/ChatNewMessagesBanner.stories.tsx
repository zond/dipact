import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from "../components/ChatNewMessagesBanner";

export default {
  title: "components/ChatNewMessagesBanner",
  component: Component,
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = () => (
  <Component />
);

export const Default = Template.bind({});

