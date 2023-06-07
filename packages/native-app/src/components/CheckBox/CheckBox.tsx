import React from "react";
import { CheckBox as RneCheckBox } from "@rneui/base";

type CheckBoxProps = {
  label?: string | undefined;
  placeholder?: string | undefined;
  checked: boolean;
  onPress?: (() => void) | undefined;
  disabled?: boolean | undefined;
};

const CheckBox = ({ label, checked, onPress, disabled }: CheckBoxProps) => {
  return (
    <RneCheckBox
      title={label}
      accessibilityLabel={label}
      checked={checked}
      onPress={onPress}
      disabled={disabled}
    />
  );
};

export default CheckBox;
