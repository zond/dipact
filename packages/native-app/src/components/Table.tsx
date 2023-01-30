import React from "react";

import { Text } from "./Text";
import { Stack } from "./Stack";
import { Icon } from "@rneui/base";
import { View, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  iconContainer: {
    width: 24,
    height: 24,
  },
});

interface TableProps {
  title?: string;
  rows: Array<{
    iconProps?: { name: string; type: string };
    label: string;
    value: string | (() => JSX.Element) | undefined;
    orientation?: "horizontal" | "vertical";
  }>;
  tableStyle?: { [key: string]: string };
}

const Table = ({ rows, title, tableStyle }: TableProps) => {
  return (
    <Stack
      orientation="vertical"
      grow
      align="flex-start"
      fillContainer
      gap={1}
      padding={1}
      style={[tableStyle]}
    >
      {Boolean(title) && (
        <Text variant="sectionTitle" bold>
          {title}
        </Text>
      )}
      {rows.map(({ iconProps, label, orientation, value }) => (
        <Stack
          fillContainer
          orientation={orientation || "horizontal"}
          justify="space-evenly"
          align="center"
          gap={2}
        >
          <Stack gap={1} grow flex={1} wrap>
            <View style={styles.iconContainer}>
              {Boolean(iconProps) && (
                <Icon {...(iconProps as { name: string; type: string })} />
              )}
            </View>
            <Text>{label}</Text>
          </Stack>
          <Stack grow flex={1} wrap>
            {Boolean(value) && (
              <Text variant="body2" size="medium">
                {typeof value === "function" ? value() : value}
              </Text>
            )}
          </Stack>
        </Stack>
      ))}
    </Stack>
  );
};

export default Table;
