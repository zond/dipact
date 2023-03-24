import React, { useState } from "react";

import { BottomSheetSelect } from "../BottomSheet";
import { Stack } from "../Stack";
import Text from "../Text";
import { MenuItemValue } from "./Select.types";
import SelectTitle from "./SelectTitle";

interface SelectProps {
  children: React.ReactNode;
  onChange: (value: MenuItemValue) => void;
  label: string;
  placeholder?: string;
  value: MenuItemValue | undefined;
}

const Select = ({
  children,
  onChange,
  label,
  value,
  placeholder,
}: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Stack orientation="vertical" fillWidth align="flex-start">
        <Text>{label}</Text>
        <SelectTitle
          accessibilityLabel={label}
          label={value ? value.toString() : placeholder || ""}
          onPress={() => setIsOpen(true)}
        />
      </Stack>
      <BottomSheetSelect
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        onPress={onChange}
      >
        {children}
      </BottomSheetSelect>
    </>
  );
};

export default Select;
