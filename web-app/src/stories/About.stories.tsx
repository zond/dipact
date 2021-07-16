import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from "../pages/About";

export default {
	title: "Pages/About",
	component: Component,
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = () => <Component />;

export const Default = Template.bind({});
