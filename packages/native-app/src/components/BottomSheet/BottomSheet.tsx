import React from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import { BottomSheet, BottomSheetProps } from "@rneui/base";
import { useTheme } from "../../hooks/useTheme";

const useStyles = () => {
  const theme = useTheme();
  return StyleSheet.create({
    container: {
      backgroundColor: theme.palette.paper.main,
    },
  });
};

type BottomSheetComponentProps = BottomSheetProps &
  ViewProps & {
    children: React.ReactNode;
  };

const BottomSheetComponent = ({
  children,
  ...rest
}: BottomSheetComponentProps) => {
  const styles = useStyles();
  return (
    <BottomSheet {...rest}>
      <View style={styles.container}>{children}</View>
    </BottomSheet>
  );
};

export default BottomSheetComponent;
