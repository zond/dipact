import { StyleProp, ViewStyle, TextStyle } from "react-native";

import { useTheme } from "../../hooks/useTheme";
import { GameDisplay } from "./types";

type StyleProps = {
  confirmationStatus?: GameDisplay["confirmationStatus"];
};

export const useStyles = ({
  confirmationStatus,
}: StyleProps): {
  [key: string]: StyleProp<ViewStyle> | StyleProp<TextStyle>;
} => {
  const theme = useTheme();
  const confirmationStatusColorMap = {
    Confirmed: theme.palette.confirmed,
    NotConfirmed: theme.palette.notConfirmed,
    NMR: theme.palette.nmr,
  } as const;
  const confirmationStatusColor = confirmationStatus
    ? confirmationStatusColorMap[confirmationStatus]
    : undefined;
  return {
    root: {
      backgroundColor: theme.palette.paper.main,
    },
    nameContainer: {
      width: "70%",
    },
    moreMenuButton: {
      justifyContent: "flex-start",
      paddingVertical: theme.spacing(2),
    },
    moreMenuContainer: {
      backgroundColor: theme.palette.paper.main,
      flexGrow: 1,
    },
    chipButton: {
      paddingHorizontal: theme.spacing(0.25),
      paddingVertical: theme.spacing(0.2),
      backgroundColor: confirmationStatusColor?.main,
    },
    chipTitle: {
      color: confirmationStatusColor?.contrastText,
    },
  };
};
