import React from "react";
import { StyleProp, StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-elements";
import { useTheme } from "../hooks";
import Switch from "../components/Switch";
import TextInput from "../components/TextInput";

const values = {
	enableEmailNotifications: false,
	enablePushNotifications: true,
	phaseDeadline: "60",
};

const onValueChange = () => {};

const useStyles = (): StyleProp<any> => {
	const theme = useTheme();
	return {
		formContainer: {
			margin: theme.spacing(1),
		},
		formLabel: {
			color: theme.palette.text.light,
		},
		formSection: {
			marginTop: theme.spacing(1),
			marginBottom: theme.spacing(1),
		},
		buttonContainer: {
			display: "flex",
			flexDirection: "row",
			justifyContent: "space-between",
			margin: theme.spacing(1),
		},
		buttonText: {
			color: theme.palette.secondary.main,
		},
	};
};

const Settings = () => {
	const styles = useStyles();

	return (
		<View style={styles.formContainer}>
			<View style={styles.formSection}>
				<Text style={styles.formLabel}>Notifications</Text>
				<Switch
					value={values.enablePushNotifications}
					label="Push notifications"
					onValueChange={onValueChange}
				/>
				<Switch
					value={values.enableEmailNotifications}
					label="Email notifications"
					onValueChange={onValueChange}
				/>
			</View>
			<TextInput
				label="Phase deadline reminder"
				value={values.phaseDeadline}
				helpText="In minutes. 0 = off"
				keyboardType="numeric"
			/>
			<View style={styles.buttonContainer}>
				<Button title="Reset settings" onPress={() => {}} type="clear" />
				<Button
					title="Save changes"
					onPress={() => {}}
					titleStyle={styles.buttonText}
				/>
			</View>
		</View>
	);
};

export default Settings;
