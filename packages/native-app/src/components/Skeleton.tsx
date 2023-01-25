import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import { Skeleton as RneSkeleton, SkeletonProps } from "@rneui/base";
import { useTheme } from "../hooks/useTheme";

const useStyles = (): StyleProp<ViewStyle> => {
    const theme = useTheme();
    return {
        backgroundColor: theme.palette.border.light,
    }
}

const Skeleton = (props: SkeletonProps) => {
    const skeletonStyles = useStyles();
    const defaultProps: SkeletonProps = { animation: "none", style: skeletonStyles }
    return <RneSkeleton {...defaultProps} {...props} />
}

export default Skeleton;