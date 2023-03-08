import React from "react";

import { Text } from "../Text";
import { Stack } from "../Stack";
import Icon from "../Icon";

interface TableRowProps {
  icon?: string | undefined;
  label?: string;
  value?: string | number | (() => JSX.Element) | undefined;
}

const TableRow = ({ icon, label, value }: TableRowProps) => {
  return (
    <Stack
      fillWidth
      orientation="horizontal"
      justify="space-evenly"
      align="flex-start"
      gap={2}
    >
      <Stack gap={1} grow flex={1} wrap align="center" justify="flex-start">
        {icon && <Icon icon={icon} />}
        <Text variant="body2" size="medium">
          {label}
        </Text>
      </Stack>
      <Stack grow flex={1} wrap>
        {Boolean(value) && (
          <Text>{typeof value === "function" ? value() : value}</Text>
        )}
      </Stack>
    </Stack>
  );
};

export default TableRow;
