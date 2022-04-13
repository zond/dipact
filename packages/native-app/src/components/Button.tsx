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
  return (
    <RneButton
      raised
      containerStyle={styles.buttonContainer}
      buttonStyle={styles.button}
      titleStyle={styles.buttonTitle}
      icon={{
        size: 15,
        color: theme.palette.secondary.main,
        type: "font-awesome",
        ...iconProps,
      }}
      {...props}
    />
  );
};

export default Button;
