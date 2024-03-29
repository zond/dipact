import React from "react";
import { FlexAlignType, StyleSheet, View, ViewProps } from "react-native";
import { useTheme } from "../hooks/useTheme";

type Justify =
  | "flex-start"
  | "flex-end"
  | "center"
  | "space-between"
  | "space-around"
  | "space-evenly"
  | undefined;

export interface StackProps extends ViewProps {
  children: React.ReactNode[] | React.ReactNode;
  orientation?: "horizontal" | "vertical";
  align?: FlexAlignType;
  justify?: Justify;
  fillWidth?: boolean;
  fillHeight?: boolean;
  gap?: number;
  flex?: number;
  grow?: boolean;
  wrap?: boolean;
  padding?: number;
}

export interface StackItemProps extends ViewProps {
  children: React.ReactNode;
  grow?: boolean;
}

export const Stack = ({
  children,
  justify,
  align = "center",
  orientation = "horizontal",
  fillHeight = false,
  fillWidth = false,
  grow = false,
  wrap = false,
  ...props
}: StackProps) => {
  const theme = useTheme();
  const horizontal = orientation === "horizontal";
  const styles = StyleSheet.create({
    root: {
      display: "flex",
      flexDirection: horizontal ? "row" : "column",
      alignItems: align,
      justifyContent: justify,
      width: fillWidth ? "100%" : undefined,
      height: fillHeight ? "100%" : undefined,
      padding: theme.spacing(props.padding || 0),
      flexGrow: grow ? 1 : 0,
      flex: props.flex,
      flexWrap: wrap ? "wrap" : "nowrap",
    },
    child: {
      marginRight: horizontal ? theme.spacing(props.gap || 0) : 0,
      marginBottom: horizontal ? 0 : theme.spacing(props.gap || 0),
    },
  });
  const childrenArray = React.Children.toArray(children);
  return (
    <View style={[styles.root, props.style]}>
      {React.Children.map(childrenArray, (c) => {
        if (!React.isValidElement(c)) {
          return null;
        } else {
          const originalStyle = (c.props.style || {}) as React.CSSProperties;
          const el = React.cloneElement(c, {
            ...c.props,
            style: [originalStyle, styles.child],
          });
          return el;
        }
      })}
    </View>
  );
};

export const StackItem = ({ children, grow, ...props }: StackItemProps) => {
  const styles = StyleSheet.create({
    root: {
      display: "flex",
      flexGrow: grow ? 1 : 0,
    },
  });
  return <View style={[styles.root, props.style]}>{children}</View>;
};
