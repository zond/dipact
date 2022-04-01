import React from "react";
import {
	KeyboardTypeOptions,
	StyleProp,
	Text,
	TextInput as RNTextInput,
	View,
} from "react-native";
import { useTheme } from "../hooks";

const useStyles = (): StyleProp<any> => {
	const theme = useTheme();
	return {
		container: {
			width: "50%",
		},
		input: {
			borderBottomColor: theme.palette.border.main,
			borderBottomWidth: 1,
            paddingVertical: 0,
		},
		label: {
			color: theme.palette.text.light,
		},
		helpText: {
			color: theme.palette.text.light,
		},
	};
};

interface TextInputProps {
	value: string;
	label?: string;
	helpText?: string;
	keyboardType?: KeyboardTypeOptions;
}

const TextInput = ({
	value,
	label,
	helpText,
	keyboardType,
}: TextInputProps) => {
	const styles = useStyles();

	return (
		<View style={styles.container}>
			{label && <Text style={styles.label}>{label}</Text>}
			<RNTextInput
				style={styles.input}
				value={value}
				keyboardType={keyboardType}
			/>
			{helpText && <Text style={styles.helpText}>{helpText}</Text>}
		</View>
	);
};

export default TextInput;
