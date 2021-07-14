import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from "../components/IroColorPicker";

export default {
	title: "Components/IroColorPicker",
	component: Component,
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
	<Component {...args} />
);

export const Default = Template.bind({});
Default.args = {
	onColorChange: (color) => console.log(color),
};
