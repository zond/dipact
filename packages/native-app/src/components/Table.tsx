import React from "react";

import { Text } from "./Text";
import { Stack } from "./Stack";
import { Icon } from "@rneui/base";
import { View, StyleSheet, ViewProps } from "react-native";

const styles = StyleSheet.create({
  iconContainer: {
    width: 24,
    height: 24,
  },
});

export interface ITableRow {
  iconProps?: { name: string; type: string };
  label: string;
  value: string | (() => JSX.Element) | undefined;
  orientation?: "horizontal" | "vertical";
}

export interface ITable {
  title?: string;
  rows: Array<ITableRow>;
  tableStyle?: { [key: string]: string };
}

type TableProps = ITable & ViewProps;

const Table = ({ rows, title, tableStyle, ...rest }: TableProps) => {
  return (
    <Stack
      orientation="vertical"
      grow
      align="flex-start"
      fillWidth
      gap={1}
      padding={1}
      style={[tableStyle]}
      {...rest}
    >
      {Boolean(title) && (
        <Text variant="sectionTitle" bold>
          {title}
        </Text>
      )}
      {rows.map(({ iconProps, label, orientation, value }) => (
        <Stack
          key={label}
          fillWidth
          orientation={orientation || "horizontal"}
          justify="space-evenly"
          align="flex-start"
          gap={2}
        >
          <Stack gap={1} grow flex={1} wrap align="flex-start">
            <View style={styles.iconContainer}>
              {Boolean(iconProps) && (
                <Icon {...(iconProps as { name: string; type: string })} />
              )}
            </View>
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
      ))}
    </Stack>
  );
};

export default Table;
