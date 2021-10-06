import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from "../components/ErrorMessage";

export default {
  title: "components/ErrorMessage",
  component: Component,
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <Component {...args} />
);

export const InternalServerError = Template.bind({});
InternalServerError.args = {
  error: {
    status: 500,
    data: {},
  },
};
