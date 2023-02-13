import React from "react";
import { StyleSheet } from "react-native";
import { FABProps as RNFABProps, FAB as RNFAB } from "@rneui/base";
import { useTheme } from "../hooks/useTheme";

type FABProps = RNFABProps;

const useStyles = () => {
  const theme = useTheme();
  return StyleSheet.create({
    title: {
      textTransform: "uppercase",
      color: theme.palette.secondary.main,
    },
  });
};

const FAB = ({ placement = "right", ...props }: FABProps) => {
  const theme = useTheme();
  const styles = useStyles();
  return (
    <RNFAB
      {...props}
      color={props.color || theme.palette.primary.main}
      titleStyle={[styles.title, props.titleStyle]}
      placement={placement}
    />
  );
};

export default FAB;
