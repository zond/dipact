import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from "../components/Chat/ChatMessageInput";

export default {
  title: "components/ChatMessageInput",
  component: Component,
  argTypes: {
    onSendMessage: { action: "clicked" },
    onChange: { action: "type" },
  },
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <Component {...args} />
);

export const Default = Template.bind({});

const WideTemplate: ComponentStory<typeof Component> = (args) => (
  <div style={{ width: "500px" }}>
    <Component {...args} />
  </div>
);

export const Wide = WideTemplate.bind({});
