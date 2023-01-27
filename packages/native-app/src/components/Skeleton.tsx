import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import { Skeleton as RneSkeleton, SkeletonProps } from "@rneui/base";
import { useTheme } from "../hooks/useTheme";

const useStyles = (): StyleProp<ViewStyle> => {
  const theme = useTheme();
  return {
    backgroundColor: theme.palette.border.light,
  };
};

const Skeleton = ({ style, ...props }: SkeletonProps) => {
  const styles = useStyles();
  return <RneSkeleton animation="none" style={[styles, style]} {...props} />;
};

export default Skeleton;
