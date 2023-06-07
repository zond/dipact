import React from "react";
import { Skeleton as RneSkeleton, SkeletonProps } from "@rneui/base";
import { useStyles } from "./Skeleton.styles";

const Skeleton = ({ style, ...props }: SkeletonProps) => {
  const styles = useStyles();
  return <RneSkeleton animation="none" style={[styles, style]} {...props} />;
};

export default Skeleton;
