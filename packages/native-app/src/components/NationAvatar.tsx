import { Avatar } from "@rneui/base";
import React from "react";
import { StyleSheet } from "react-native";
import { brightnessByColor } from "@diplicity/common";
import { useTheme } from "../hooks/useTheme";

interface NationAvatarProps {
  color: string;
  link?: string;
  nation: string;
  nationAbbreviation: string;
  onPress?: () => void;
}

type StyleProps = Pick<NationAvatarProps, "color">;

const useStyles = ({ color }: StyleProps) => {
  const theme = useTheme();
  const textColor =
    brightnessByColor(color) > 128
      ? theme.palette.text.main
      : theme.palette.text.contrastText;
  return StyleSheet.create({
    containerStyle: {
      backgroundColor: color,
    },
    titleStyle: {
      color: textColor,
    },
  });
};

const NationAvatar = ({
  color,
  nationAbbreviation,
  nation,
}: NationAvatarProps): React.ReactElement => {
  const styles = useStyles({ color });
  return (
    <Avatar
      size={"medium"}
      rounded
      key={nation}
      title={nationAbbreviation}
      containerStyle={styles.containerStyle}
      titleStyle={styles.titleStyle}
    />
  );
};

export default NationAvatar;
