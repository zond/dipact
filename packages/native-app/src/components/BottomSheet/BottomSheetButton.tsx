import React from "react";
import { StyleSheet } from "react-native";

import { useTheme } from "../../hooks/useTheme";
import Button, { ButtonProps } from "../Button";
import { Stack } from "../Stack";

const useStyles = () => {
  const theme = useTheme();
  return StyleSheet.create({
    buttonStyle: {
      justifyContent: "flex-start",
      paddingVertical: theme.spacing(2),
    },
    containerStyle: {
      flexGrow: 1,
    },
  });
};

const BottomSheetButton = (props: ButtonProps) => {
  const styles = useStyles();
  return (
    <Stack fillWidth>
      <Button
        buttonStyle={styles.buttonStyle}
        containerStyle={styles.containerStyle}
        {...props}
      />
    </Stack>
  );
};

export default BottomSheetButton;
