import React from "react";
import { StyleSheet } from "react-native";
import { FABProps as RNFABProps, FAB as RNFAB } from "@rneui/base";
import { useTheme } from "../hooks/useTheme";
import { IconNames } from "diplicity-common-internal";
import { iconMap } from "../icons/iconMap";
import { FullTheme } from "@rneui/themed";

type FABProps = Omit<RNFABProps, "icon"> & {
  icon?: IconNames;
};

const useStyles = () => {
  const theme = useTheme();
  return StyleSheet.create({
    title: {
      textTransform: "uppercase",
      color: theme.palette.secondary.main,
    },
  });
};

const getIconProps = (theme: FullTheme, icon: IconNames) => {
  return { ...iconMap[icon], color: theme.palette.secondary.main };
};

const FAB = ({ placement = "right", icon, ...props }: FABProps) => {
  const theme = useTheme();
  const styles = useStyles();
  const iconProps = icon ? getIconProps(theme, icon) : undefined;
  return (
    <RNFAB
      icon={{ ...iconProps }}
      {...props}
      color={props.color || theme.palette.primary.main}
      titleStyle={[styles.title, props.titleStyle]}
      placement={placement}
    />
  );
};

export default FAB;
