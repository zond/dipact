import { TransformedGame } from "@diplicity/common";
import { StyleProp, ViewStyle, TextStyle } from "react-native";

import { useTheme } from "../../hooks/useTheme";

type StyleProps = {
  confirmationStatus?: TransformedGame["confirmationStatus"];
};

export const useStyles = ({
  confirmationStatus,
}: StyleProps): {
  [key: string]: StyleProp<ViewStyle> | StyleProp<TextStyle>;
} => {
  const theme = useTheme();
  const confirmationStatusColorMap = {
    confirmed: theme.palette.confirmed,
    notConfirmed: theme.palette.notConfirmed,
    nmr: theme.palette.nmr,
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
    chipButton: {
      paddingHorizontal: theme.spacing(0.25),
      paddingVertical: theme.spacing(0.2),
      backgroundColor: confirmationStatusColor?.main,
    },
    chipTitle: {
      color: confirmationStatusColor?.contrastText,
    },
    actionButtonContainer: {
      flexGrow: 1,
    },
  };
};
