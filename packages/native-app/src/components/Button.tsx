import React from "react";
import { StyleSheet, StyleProp } from "react-native";

import { useTheme } from "../hooks/useTheme";
import { Button as RneButton, IconProps } from "@rneui/base";

const useStyles = (): StyleProp<any> => {
  return {
    button: {
      backgroundColor: "transparent",
    },
  };
};

export type ButtonProps = Parameters<typeof RneButton>[0] & {
  iconProps?: Partial<IconProps>;
  upperCase?: boolean;
  key?: string;
};

const Button = ({
  upperCase = true,
  iconProps = {},
  ...props
}: ButtonProps) => {
  const themeTitleStyle = useTheme().components.Button.titleStyle;
  const styles = useStyles();
  return (
    <RneButton
      icon={{
        size: 15,
        type: "font-awesome",
        ...iconProps,
      }}
      {...props}
      title={upperCase ? props.title?.toString().toUpperCase() : props.title}
      containerStyle={[styles.buttonContainer, props.containerStyle]}
      buttonStyle={[styles.button, props.buttonStyle]}
      titleStyle={[themeTitleStyle, props.titleStyle]}
    />
  );
};

export const MoreButton = ({
  buttonStyle,
  iconProps,
  raised = false,
  ...props
}: ButtonProps) => {
  const theme = useTheme();
  const defaultIconProps = {
    type: "material-ui",
    name: "more-horiz",
    color: theme.palette.text.light,
    size: 20,
  };
  const styles = StyleSheet.create({
    button: {
      backgroundColor: "transparent",
    },
  });

  return (
    <Button
      iconProps={{ ...defaultIconProps, ...iconProps }}
      raised={raised}
      buttonStyle={[styles.button, buttonStyle]}
      accessibilityLabel={"more options"}
      {...props}
    />
  );
};

export default Button;
