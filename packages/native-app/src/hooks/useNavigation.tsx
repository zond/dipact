import { useNavigation as rnUseNavigation } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../screens/Router";

export const useNavigation = <P extends keyof RootStackParamList>() => {
  type RouteProp = NativeStackScreenProps<RootStackParamList, P>;
  return rnUseNavigation<RouteProp["navigation"]>();
};
