import { StyleProp, ViewProps, ViewStyle } from "react-native";
import { ReliabilityLabel } from "@diplicity/common";

export interface PlayerCardProps extends ViewProps {
  style?: StyleProp<ViewStyle>;
  variant: "compact" | "expanded";
  username: string;
  src: string;
  reliabilityLabel: ReliabilityLabel;
  onPressMore: () => void;
  numJoinedGames: number;
  numSoloWinGames: number;
  numDrawnGames: number;
  numAbandonedGames: number;
}

export type PlayerCardContainerProps = ViewProps &
  Pick<PlayerCardProps, "variant" | "onPressMore"> & {
    id: string;
  };
