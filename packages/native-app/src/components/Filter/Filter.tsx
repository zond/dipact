import React, { useState } from "react";

import BottomSheet, { BottomSheetSelectOption } from "../BottomSheet";
import Button from "../Button";
import { useStyles } from "./Filter.styles";

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

  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
  const bottomSheetElements: Parameters<typeof BottomSheetSelectOption>[0][] =
    options.map((option) => {
      const selected = option.value === value;
      return {
        title: option.label,
        value: option.value,
        onChange: () => {
          onChange(option.value);
          setBottomSheetOpen(false);
        },
        selected,
        key: option.value,
      };
    });

  const onPressFilter = () => {
    setBottomSheetOpen(true);
  };

  return (
    <>
      <Button
        title={title}
        buttonStyle={styles.button}
        iconProps={{ type: "material-community", name: "menu-down" }}
        iconRight
        upperCase={false}
        onPress={onPressFilter}
      />
      <BottomSheet
        isVisible={bottomSheetOpen}
        onBackdropPress={() => setBottomSheetOpen(false)}
        testID="game-card-more-menu"
      >
        {bottomSheetElements.map((element) => (
          <BottomSheetSelectOption {...element} />
        ))}
      </BottomSheet>
    </>
  );
};

export default Filter;
