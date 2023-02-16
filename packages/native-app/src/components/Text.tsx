import React from "react";
import {
  TextProps as RNTextProps,
  Text as RNText,
  TextStyle,
} from "react-native";
import { useTheme } from "../hooks/useTheme";

type Variant = "body1" | "body2" | "title" | "sectionTitle";
type Size = "small" | "medium" | "large";

type TextProps = RNTextProps & {
  bold?: boolean;
  variant?: Variant;
  size?: Size;
  children: React.ReactNode;
};

export const Text = ({
  style,
  size,
  variant = "body1",
  bold = false,
  ...props
}: TextProps) => {
  const theme = useTheme();
  const sizeStyles: { [key in Size]: TextStyle } = {
    small: {
      fontSize: 14,
    },
    medium: {
      fontSize: 16,
    },
    large: {
      fontSize: 18,
    },
  } as const;
  const setStyle: TextStyle = {
    fontWeight: bold ? "bold" : "normal",
  };
  const themeProps = theme.components.Text;
  const variantStyle = theme.typography[variant];
  const sizeStyle = size ? sizeStyles[size] : {};
  const mergedStyles = [
    themeProps.style,
    variantStyle,
    setStyle,
    sizeStyle,
    style,
  ];
  return <RNText {...themeProps} style={mergedStyles} {...props} />;
};
