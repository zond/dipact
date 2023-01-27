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
  const variantStyles: { [key in Variant]: TextStyle } = {
    body1: {
      fontSize: 16,
    },
    body2: {
      color: theme.palette.text.light,
      fontSize: 14,
    },
    title: {
      fontSize: 18,
    },
    sectionTitle: {
      fontSize: 14,
      textTransform: "uppercase",
    },
  } as const;
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
  const variantStyle = variantStyles[variant];
  const sizeStyle = size ? sizeStyles[size] : {};
  const mergedStyles = [variantStyle, setStyle, sizeStyle, style];
  return <RNText style={mergedStyles} {...props} />;
};
