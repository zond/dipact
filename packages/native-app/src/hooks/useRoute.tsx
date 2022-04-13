import { useRoute as rnUseRoute } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../screens/Router";

export const useRoute = <P extends keyof RootStackParamList>() => {
  type RouteProp = NativeStackScreenProps<RootStackParamList, P>;
  return rnUseRoute<RouteProp["route"]>();
};
