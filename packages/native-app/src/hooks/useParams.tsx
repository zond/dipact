import { RootStackParamList } from "../screens/Router";
import { useRoute } from "./useRoute";

export const useParams = <P extends keyof RootStackParamList>() => {
  return useRoute<P>().params as Readonly<RootStackParamList[P]>;
};
