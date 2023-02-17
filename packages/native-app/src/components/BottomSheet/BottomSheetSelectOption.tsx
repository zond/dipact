import { ButtonProps } from "@rneui/base";
import React from "react";
import { StyleSheet } from "react-native";

import { useTheme } from "../../hooks/useTheme";
import Button from "../Button";

type BottomSheetSelectOptionProps = ButtonProps & {
  title: string;
  selected: boolean;
  onChange: (value: string) => void;
  value: string;
};

const useStyles = () => {
  const theme = useTheme();
  return StyleSheet.create({
    selectButtonContainer: {
      width: "100%",
    },
    selectButton: {
      display: "flex",
      flexDirection: "row-reverse",
      width: "100%",
      justifyContent: "space-between",
      padding: theme.spacing(2),
    },
  });
};

const BottomSheetSelectOption = (props: BottomSheetSelectOptionProps) => {
  const styles = useStyles();
  return (
    <Button
      upperCase={false}
      iconProps={{
        type: "material-community",
        name: props.selected ? "radiobox-marked" : "radiobox-blank",
        size: 20,
      }}
      {...props}
      onPress={() => props.onChange(props.value)}
      containerStyle={[styles.selectButtonContainer, props.containerStyle]}
      buttonStyle={[styles.selectButton, props.buttonStyle]}
    />
  );
};

export default BottomSheetSelectOption;
