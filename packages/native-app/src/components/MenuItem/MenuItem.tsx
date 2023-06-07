import React from "react";

import Button from "../Button";
import { Stack } from "../Stack";
import { MenuItemProps } from "../Select/Select.types";
import { useStyles } from "./MenuItem.styles";

const MenuItem = ({ value, label, onPress }: MenuItemProps) => {
  const styles = useStyles();
  return (
    <Stack fillWidth>
      <Button
        title={label}
        accessibilityLabel={label}
        upperCase={false}
        onPress={onPress ? () => onPress(value) : undefined}
        titleStyle={styles.title}
        containerStyle={styles.container}
      />
    </Stack>
  );
};

export default MenuItem;
