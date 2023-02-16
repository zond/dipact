import React from "react";
import { StyleSheet } from "react-native";

import { useTheme } from "../hooks/useTheme";
import { BottomSheetElement, useBottomSheet } from "./BottomSheetWrapper";
import Button from "./Button";

interface BaseProps {
  nullable: boolean;
  placeholder: string;
  value: string | undefined;
  onChange: (value: string | undefined) => void;
}

type SelectProps = BaseProps & {
  variant: "select";
  options: { value: string; label: string }[];
};

type FilterProps = SelectProps;

type StyleProps = {
  active?: boolean;
};

const useStyles = ({ active }: StyleProps) => {
  const theme = useTheme();
  return StyleSheet.create({
    button: {
      backgroundColor: active
        ? theme.palette.secondary.main
        : theme.palette.paper.main,
      borderRadius: 25,
      borderWidth: 1,
      borderColor: active
        ? theme.palette.border.main
        : theme.palette.border.light,
      paddingHorizontal: theme.spacing(2),
      paddingVertical: theme.spacing(0.5),
    },
  });
};

export const Filter = ({
  onChange,
  options,
  value,
  placeholder,
}: FilterProps) => {
  const active = Boolean(value);
  const styles = useStyles({ active });
  const selectedOption = options.find((option) => option.value === value);
  const title = selectedOption ? selectedOption.label : placeholder;

  const [setBottomSheet] = useBottomSheet();
  const bottomSheetElements: BottomSheetElement[] = options.map((option) => {
    const selected = option.value === value;
    return {
      elementType: "selectOption",
      title: option.label,
      value: option.value,
      onChange,
      selected,
      key: option.value,
    };
  });

  const onPressFilter = () => {
    setBottomSheet({
      sections: [
        {
          elements: bottomSheetElements,
        },
      ],
    });
  };

  return (
    <Button
      title={title}
      buttonStyle={styles.button}
      iconProps={{ type: "material-community", name: "menu-down" }}
      iconRight
      upperCase={false}
      onPress={onPressFilter}
    />
  );
};
