import { useFormik } from "formik";
import { FormEvent, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Globals from "../Globals";
import { ColorOverrides, SettingsFormValues, UserConfig, Variant } from "../store/types";
import {
  useUpdateUserConfigStatus,
  useMessaging,
  useColorOverrides,
} from "./selectors";
import {
  useGetRootQuery,
  useGetUserConfigQuery,
  useLazyGetUserConfigQuery,
  useListVariantsQuery,
} from "./service";

const CLASSICAL = "Classical";

type VariantsDisplay = {
  [key: string]: { [key: string]: string };
};

interface IUseSettings {
  variants: VariantsDisplay;
  values: SettingsFormValues;
  handleChange: (e: React.ChangeEvent<any>) => void;
  handleSubmit: (e?: FormEvent<HTMLFormElement> | undefined) => void;
  handleChangeVariant: (e: React.ChangeEvent<any>) => void;
}

const transformVariants = (
  variants: Variant[] | undefined
): VariantsDisplay => {
  if (!variants) return {};
  return variants?.reduce((colorMap: VariantsDisplay, variant) => {
    colorMap[variant.Name] = variant.Nations.reduce(
      (nations: { [key: string]: string }, nation: string, index) => {
        nations[nation] = Globals.contrastColors[index];
        return nations;
      },
      {}
    );
    return colorMap;
  }, {});
};

const initialFormValues: SettingsFormValues = {
  colors: {},
  enablePushNotifications: false,
  enableEmailNotifications: false,
  enableColorNonSCs: false,
  phaseDeadline: 60,
};

const getInitialFormValues = (
	colorOverrides: ColorOverrides,
	userConfig: UserConfig,
	variants: Variant[] | undefined
) => {
	const { PhaseDeadlineWarningMinutesAhead, MailConfig } = userConfig;
	const defaultColors = transformVariants(variants);
	const colors = colorOverrides
		? { ...defaultColors, ...colorOverrides.variants }
		: defaultColors;
	const values: Partial<SettingsFormValues> = {
		enableEmailNotifications: MailConfig?.Enabled,
		phaseDeadline: PhaseDeadlineWarningMinutesAhead,
		colors,
	};
	return values;
};

const useSettings = (): IUseSettings => {
  const [variant, setVariant] = useState("");

  const {
    values,
    handleChange,
    handleSubmit,
    resetForm,
    initialValues,
    setFieldValue,
    dirty,
  } = useFormik({
    initialValues: initialFormValues,
    onSubmit: (vals) => {
      // dispatch(submitSettingsForm(vals));
    },
  });

  const getRootQuery = useGetRootQuery(undefined);
  // const updateUserConfigStatus = useUpdateUserConfigStatus();
  const [triggerUserConfigQuery, userConfigQuery] = useLazyGetUserConfigQuery();
  const listVariantsQuery = useListVariantsQuery(undefined);
  const variants = transformVariants(listVariantsQuery.data);
	const colorOverrides = useColorOverrides();
  // const { hasPermission, tokenEnabled } = useMessaging();
  // const colorOverrides = useColorOverrides();

  useEffect(() => {
    if (getRootQuery.data) {
      triggerUserConfigQuery(getRootQuery.data.Id as string);
    }
  }, [getRootQuery.data]);

  useEffect(() => {
    if (userConfigQuery.data) {
      const vals = getInitialFormValues(colorOverrides, userConfigQuery.data, listVariantsQuery.data);
      resetForm({ values: { ...values, ...vals } });
      setVariant(CLASSICAL);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userConfigQuery.data]);

  // NOTE might not work in native?
  const handleChangeVariant = (
    e: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    const value = e.target.value as string;
    setVariant(value);
  };

  return {
    variants,
    values,
    handleChange,
    handleSubmit,
    handleChangeVariant,
  };
};

export default useSettings;
