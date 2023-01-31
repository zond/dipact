import React from "react";
import { StyleSheet, StyleProp } from "react-native";

import { useTheme } from "../hooks/useTheme";
import { Button as RneButton, IconProps } from "@rneui/base";

const useStyles = (): StyleProp<any> => {
  const theme = useTheme();
  return {
    button: {
      backgroundColor: "transparent",
    },
    buttonTitle: {
      color: theme.palette.text.main,
    },
  };
};

type ButtonProps = Parameters<typeof RneButton>[0] & {
  iconProps?: Partial<IconProps>;
  upperCase?: boolean;
};

const Button = ({
  upperCase = true,
  iconProps = {},
  ...props
}: ButtonProps) => {
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
      titleStyle={[styles.buttonTitle, props.titleStyle]}
    />
  );
};

export const MoreButton = ({
  buttonStyle,
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
      iconProps={{ ...defaultIconProps, ...props.iconProps }}
      raised={raised}
      buttonStyle={[styles.button, buttonStyle]} // TODO componentize
      accessibilityLabel={"more options"}
      {...props}
    />
  );
};

export default Button;
