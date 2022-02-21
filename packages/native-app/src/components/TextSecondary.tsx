import React from "react";
import { StyleProp, Text, View } from "react-native";
import { useTheme } from "../hooks";

interface ITextProps {
  children: React.ReactNode;
}

const useStyles = (): StyleProp<any> => {
  const theme = useTheme();
  return {
    root: {
      color: theme.palette.text.light,
    },
  };
};

const TextSecondary = ({ children }: ITextProps) => {
  const styles = useStyles();
  return <Text style={styles.root}>{children}</Text>;
};

export default TextSecondary;
