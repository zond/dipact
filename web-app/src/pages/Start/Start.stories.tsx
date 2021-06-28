import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from "./Start";

export default {
  title: "Page/Start",
  component: Component,
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = () => <Component />;

export const Default = Template.bind({});
Default.args = {};
