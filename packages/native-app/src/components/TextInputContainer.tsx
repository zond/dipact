import React from "react";
import { StyleProp, Text, View } from "react-native";
import { useTheme } from "../hooks";

const useStyles = (): StyleProp<any> => {
  const theme = useTheme();
  return {
    label: {
      color: theme.palette.text.light,
    },
    helpText: {
      color: theme.palette.text.light,
    },
  };
};

interface TextInputProps {
  label?: string;
  helpText?: string;
  children: React.ReactNode;
}

const TextInputContainer = ({ label, helpText, children }: TextInputProps) => {
  const styles = useStyles();

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      {children}
      {helpText && <Text style={styles.helpText}>{helpText}</Text>}
    </View>
  );
};

export default TextInputContainer;
