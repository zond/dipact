import React from "react";
import { StyleProp } from "react-native";
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

const Button = ({ upperCase = true, iconProps = {}, ...props }: ButtonProps) => {
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

export default Button;
