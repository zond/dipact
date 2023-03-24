import React from "react";

import Text from "../Text";
import { Stack } from "../Stack";
import Icon from "../Icon";

interface TableRowProps {
  icon?: string | undefined;
  label?: string;
  value?: string | number | (() => JSX.Element) | undefined;
  orientation?: "horizontal" | "vertical";
}

const TableRow = ({
  icon,
  label,
  value,
  orientation = "horizontal",
}: TableRowProps) => {
  return (
    <Stack
      fillWidth
      orientation={orientation}
      justify={orientation === "horizontal" ? "space-evenly" : "flex-start"}
      align="flex-start"
      gap={2}
    >
      <Stack
        gap={1}
        grow={orientation === "horizontal" ? true : false}
        flex={orientation === "horizontal" ? 1 : undefined}
        wrap
        align="center"
        justify="flex-start"
      >
        {icon && <Icon icon={icon} />}
        <Text variant="body2" size="medium">
          {label}
        </Text>
      </Stack>
      <Stack
        grow={orientation === "horizontal" ? true : false}
        flex={orientation === "horizontal" ? 1 : undefined}
        wrap
      >
        {Boolean(value) && (
          <Text>{typeof value === "function" ? value() : value}</Text>
        )}
      </Stack>
    </Stack>
  );
};

export default TableRow;
