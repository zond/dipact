import React from "react";

import Button from "../Button";
import { useStyles } from "./SelectTitle.styles";

type SelectTitleProps = {
  accessibilityLabel: string;
  label: string;
  onPress: () => void;
};

const SelectTitle = ({
  accessibilityLabel,
  label,
  onPress,
}: SelectTitleProps) => {
  const styles = useStyles();

  return (
    <Button
      title={label}
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      upperCase={false}
      containerStyle={styles.container}
      titleStyle={styles.title}
      iconPosition="right"
      iconProps={{ name: "chevron-down", color: "grey" }}
    />
  );
};

export default SelectTitle;
