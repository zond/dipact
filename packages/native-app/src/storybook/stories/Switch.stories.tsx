import { action } from "@storybook/addon-actions";
import { text } from "@storybook/addon-knobs";
import { storiesOf } from "@storybook/react-native";
import React from "react";
import { Text, View } from "react-native";
import { ThemeProvider } from "react-native-elements";

import Switch from "../../components/Switch";
import { theme } from "../../theme";
import CenterView from "../CenterView";

const onValueChange = () => {};

storiesOf("components/Switch", module)
	.addDecorator((getStory) => (
		<ThemeProvider theme={theme}>
			<CenterView>{getStory()}</CenterView>
		</ThemeProvider>
	))
	.add("True", () => <Switch onValueChange={onValueChange} value={true} />)
	.add("False", () => <Switch onValueChange={onValueChange} value={false} />)
	.add("True with label", () => (
		<Switch
			onValueChange={onValueChange}
			value={true}
			label="Push notifications"
		/>
	))
	.add("False with label", () => (
		<Switch
			onValueChange={onValueChange}
			value={false}
			label="Push notifications"
		/>
	));
