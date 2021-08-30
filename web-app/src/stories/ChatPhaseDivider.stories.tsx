import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from "../components/ChatPhaseDivider";

export default {
  title: "components/ChatPhaseDivider",
  component: Component,
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <Component {...args} />
);

export const Default = Template.bind({});
Default.args = {
  phase: "Fall 1903, Movement"
};
