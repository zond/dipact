import { StyleSheet } from "react-native";

import { useTheme } from "../../hooks/useTheme";

type StyleProps = {
  active?: boolean;
};

export const useStyles = ({ active }: StyleProps) => {
  const theme = useTheme();
  return StyleSheet.create({
    button: {
      backgroundColor: active
        ? theme.palette.secondary.main
        : theme.palette.paper.main,
      borderRadius: 25,
      borderWidth: 1,
      borderColor: active
        ? theme.palette.border.main
        : theme.palette.border.light,
      paddingHorizontal: theme.spacing(2),
      paddingVertical: theme.spacing(0.5),
    },
  });
};
