import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from "../components/Color";

export default {
	title: "Components/Color",
	component: Component,
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
	<Component {...args} />
);

const defaultArgs = {
	edited: false,
	initialValue: "#F44336",
	onSelect: () => null,
};

export const Default = Template.bind({});
Default.args = { ...defaultArgs };

export const Edited = Template.bind({});
Edited.args = { ...defaultArgs, edited: true };
