import React from "react";
import { View, ViewProps } from "react-native";
import { BottomSheet, BottomSheetProps } from "@rneui/base";
import { useStyles } from "./BottomSheet.styles";

type BottomSheetComponentProps = BottomSheetProps &
  ViewProps & {
    children: React.ReactNode;
    cardStyle?: ViewProps["style"];
  };

const BottomSheetComponent = ({
  children,
  cardStyle,
  ...rest
}: BottomSheetComponentProps) => {
  const styles = useStyles();
  return (
    <BottomSheet {...rest}>
      <View style={[styles.container, cardStyle]}>{children}</View>
    </BottomSheet>
  );
};

export default BottomSheetComponent;
