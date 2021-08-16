import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from "../pages/Settings";
import { Scenarios, createSettingsFormDI } from "../pages/Settings.scenarios";
import { MemoryRouter } from "react-router-dom";

export default {
	title: "Pages/Settings",
	component: Component,
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
	<MemoryRouter>
		<Component {...args} />
	</MemoryRouter>
);

export const NotLoaded = Template.bind({});
export const IsLoading = Template.bind({});
export const Loaded = Template.bind({});
export const TokenEnabled = Template.bind({});
export const Unedited = Template.bind({});
export const EditedColor = Template.bind({});
export const Error = Template.bind({});
NotLoaded.args = {
	useSettingsFormDI: createSettingsFormDI(Scenarios.NotLoaded),
};
IsLoading.args = {
	useSettingsFormDI: createSettingsFormDI(Scenarios.IsLoading),
};
Loaded.args = {
	useSettingsFormDI: createSettingsFormDI(Scenarios.Loaded),
};
TokenEnabled.args = {
	useSettingsFormDI: createSettingsFormDI(Scenarios.TokenEnabled),
};
Unedited.args = {
	useSettingsFormDI: createSettingsFormDI(Scenarios.Unedited),
};
EditedColor.args = {
	useSettingsFormDI: createSettingsFormDI(Scenarios.EditedColor),
};
Error.args = {
	useSettingsFormDI: createSettingsFormDI(Scenarios.Error),
};
