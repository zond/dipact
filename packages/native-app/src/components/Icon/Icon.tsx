import React from "react";
import { View } from "react-native";
import { Icon as RneIcon } from "@rneui/base";

import { IconNames } from "diplicity-common-internal";
import { iconMap } from "../../icons/iconMap";
import { useStyles } from "./Icon.styles";
import { IconProps } from "./Icon.types";

const Icon = ({ icon, size = "medium" }: IconProps) => {
  const styles = useStyles({ size });
  return (
    <View style={styles.iconContainer}>
      <RneIcon
        {...(iconMap[icon as IconNames] as {
          name: string;
          type: string;
        })}
      />
    </View>
  );
};

export default Icon;
