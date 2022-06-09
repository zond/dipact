import React from "react";
import { StyleProp } from "react-native";
import { useTheme } from "../hooks/useTheme";
import { Button as RneButton, IconProps } from "@rneui/base";

const useStyles = (): StyleProp<any> => {
  const theme = useTheme();
  return {
    button: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.main,
    },
    buttonContainer: {
      marginLeft: theme.spacing(1),
    },
    buttonTitle: {
      color: theme.palette.secondary.main,
    },
  };
};

type ButtonProps = Parameters<typeof RneButton>[0] & {
  iconProps?: Partial<IconProps>;
};

const Button = (props: ButtonProps) => {
  const styles = useStyles();
  const theme = useTheme();
  const iconProps = props.iconProps || {};
  const upperCaseTitle = props.title?.toString().toUpperCase();
  return (
    <RneButton
      raised
      icon={{
        size: 15,
        color: theme.palette.secondary.main,
        type: "font-awesome",
        ...iconProps,
      }}
      {...props}
      title={upperCaseTitle}
      containerStyle={[styles.buttonContainer, props.containerStyle]}
      buttonStyle={[styles.button, props.buttonStyle]}
      titleStyle={[styles.buttonTitle, props.titleStyle]}
    />
  );
};

export default Button;
