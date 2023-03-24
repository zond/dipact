import React from "React";
import { Input as RneInput } from "@rneui/base";

import Text from "../Text";

type TextFieldProps = {
  label?: string | undefined;
  placeholder?: string | undefined;
  value?: string | undefined;
  onChange?: ((text: string) => void) | undefined;
};

const shake = () => {};

const TextField = ({ label, placeholder, value, onChange }: TextFieldProps) => {
  return (
    <RneInput
      label={<Text>{label}</Text>}
      accessibilityLabel={label}
      placeholder={placeholder}
      value={value}
      onChangeText={onChange}
      shake={shake}
    />
  );
};

export default TextField;
