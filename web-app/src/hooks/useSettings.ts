import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Variant } from "../store/types";
import {
  useUpdateUserConfigStatus,
  useMessaging,
  useColorOverrides,
} from "./selectors";
import {
  useGetRootQuery,
  useGetUserConfigQuery,
  useListVariantsQuery,
} from "./service";

interface IUseSettings {
  variants: { [key: string]: { name: string; color: string }[] };
}

const transformVariants = (variants: Variant[]) => {

}

const useSettings = (userId: string): IUseSettings => {
  const [variant, setVariant] = useState("");

  useGetRootQuery(undefined);
  const updateUserConfigStatus = useUpdateUserConfigStatus();
  const { data: userConfig, ...getUserConfigStatus } = useGetUserConfigQuery(
    userId
  );
  const { data: variants } = useListVariantsQuery(undefined);
  // const { hasPermission, tokenEnabled } = useMessaging();
  // const colorOverrides = useColorOverrides();

  // useEffect(() => {
  //     if (variants) {

  //     }
  // }, [variants])

  return {
    variants,
  };
};

export default useSettings;
