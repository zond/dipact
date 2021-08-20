import React from "react";
import { StyleProp, StyleSheet, Text, View } from "react-native";
import { Button, Text as Header } from "react-native-elements";
// @ts-ignore TODO fix
import { copy } from "@diplicity/common";

import { useTheme } from "../hooks";
import Switch from "../components/Switch";
import TextInput from "../components/TextInput";

const useStyles = (): StyleProp<any> => {
	const theme = useTheme();
	return {

	};
};

const About = () => {
	const styles = useStyles();

	return (
		<View>
            <Header>{copy.about_title_1}</Header>
			<Text>{copy.about_section_1_para_1}</Text>
			<Text>{copy.about_section_1_para_2}</Text>
			<Text>{copy.about_section_1_para_3}</Text>
		</View>
	);
};

export default About;
