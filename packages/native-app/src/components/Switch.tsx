import React from "react";
import { StyleProp, Switch as RNSwitch, Text, View } from "react-native";
import { useTheme } from "../hooks/useTheme";

const useStyles = (): StyleProp<any> => {
	const theme = useTheme();
	return {
		switchContainer: {
			display: "flex",
			flexDirection: "row",
			alignItems: "center",
		},
		switch: {
			display: "flex",
			alignSelf: "flex-start",
		},
	};
};

interface SwitchProps {
	value: boolean;
	onValueChange: (value: boolean) => void;
	label?: string;
}

const Switch = ({ value, onValueChange, label }: SwitchProps) => {
	const theme = useTheme();
	const styles = useStyles();

	return (
		<View style={styles.switchContainer}>
			<RNSwitch
				testID="switch"
				style={styles.switch}
				trackColor={{
					true: theme.palette.secondary.light,
					false: theme.palette.background.dark,
				}}
				thumbColor={
					value ? theme.palette.secondary.main : theme.palette.paper.main
				}
				onValueChange={onValueChange}
				value={value}
			/>
			<Text>{label}</Text>
		</View>
	);
};

export default Switch;
