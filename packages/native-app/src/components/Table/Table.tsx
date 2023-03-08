import React from "react";

import { Text } from "../Text";
import { Stack } from "../Stack";
import { ViewProps } from "react-native";

interface TableProps {
  title?: string;
  style?: ViewProps["style"];
  children: React.ReactNode;
}

const Table = ({ title, style, children }: TableProps) => {
  return (
    <Stack
      orientation="vertical"
      grow
      align="flex-start"
      fillWidth
      gap={1}
      style={style}
    >
      {Boolean(title) && (
        <Text variant="sectionTitle" bold>
          {title}
        </Text>
      )}
      {children}
    </Stack>
  );
};

export default Table;
