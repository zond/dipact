import { useFormik } from "formik";
import { useEffect } from "react";
import { FormEvent, useState } from "react";
import { useDispatch } from "react-redux";

import Globals from "../Globals";
import { resetUserSettings, submitSettingsForm } from "../store/actions";
import {
	ColorOverrides,
	SettingsFormValues,
	UserConfig,
	Variant,
} from "../store/types";
import {
	useColorOverrides,
	useMessaging,
	useUpdateUserConfigStatus,
} from "./selectors";
import {
	useGetRootQuery,
	useGetUserConfigQuery,
	useListVariantsQuery,
} from "./service";

const CLASSICAL = "Classical";

type ColorMap = {
	[key: string]: { [key: string]: string };
};

const initialValues: SettingsFormValues = {
	colors: {},
	enablePushNotifications: false,
	enableEmailNotifications: false,
	phaseDeadline: 60,
};

type FieldNames = keyof SettingsFormValues;

type DisabledFields = { [K in FieldNames]?: boolean };
type HelpText = { [K in FieldNames]?: string };

interface IUseSettingsForm {
	values: SettingsFormValues;
	handleChange: (e: React.ChangeEvent<any>) => void;
	handleSubmit: (e?: FormEvent<HTMLFormElement> | undefined) => void;
	handleChangeVariant: (e: React.ChangeEvent<any>) => void;
	handleResetSettings: () => void;
	variant: string;
	isLoading: boolean;
	isError: boolean;
	disabledFields: DisabledFields;
	helpText: HelpText;
	loaded: boolean;
}

const getDefaultColors = (variants: Variant[] | undefined): ColorMap => {
	// TODO use reduce instead
	const colorMap: ColorMap = {};
	variants?.forEach((v) => {
		const nations: { [key: string]: string } = {};
		v.Nations.forEach((nation, index) => {
			nations[nation] = Globals.contrastColors[index];
		});
		colorMap[v.Name] = nations;
	});
	return colorMap;
};
const getInitialFormValues = (
	colorOverrides: ColorOverrides,
	userConfig: UserConfig,
	variants: Variant[] | undefined
) => {
	const { PhaseDeadlineWarningMinutesAhead, MailConfig } = userConfig;
	const defaultColors = getDefaultColors(variants);
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

const useSettingsForm = (userId: string): IUseSettingsForm => {
	const [variant, setVariant] = useState(CLASSICAL);

	const dispatch = useDispatch();
	useGetRootQuery(undefined);
	const updateUserConfigStatus = useUpdateUserConfigStatus();
	const { data: userConfig, ...getUserConfigStatus } =
		useGetUserConfigQuery(userId);
	const { data: variants } = useListVariantsQuery(undefined);
	const { hasPermission, tokenEnabled } = useMessaging();
	const colorOverrides = useColorOverrides();

	const isLoading =
		updateUserConfigStatus.isLoading || getUserConfigStatus.isFetching;
	const isError = updateUserConfigStatus.isError || getUserConfigStatus.isError;

	const handleResetSettings = () => {
		dispatch(resetUserSettings());
	};

	const { values, handleChange, handleSubmit, resetForm } = useFormik({
		initialValues,
		onSubmit: (vals) => {
			dispatch(submitSettingsForm(vals));
		},
	});

	useEffect(() => {
		if (userConfig) {
			const vals = getInitialFormValues(colorOverrides, userConfig, variants);
			resetForm({ values: { ...values, ...vals } });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [userConfig, colorOverrides, variants, resetForm]);

	const handleChangeVariant = (
		e: React.ChangeEvent<HTMLSelectElement>
	): void => {
		const value = e.target.value as string;
		setVariant(value);
	};

	const disabledFields = {
		enableEmailNotifications: isLoading,
		enablePushNotifications: hasPermission === "false" || isLoading,
		phaseDeadline:
			!(userConfig?.MailConfig?.Enabled && !tokenEnabled) || isLoading,
		colors: isLoading,
	};
	const helpText = {
		phaseDeadline: tokenEnabled
			? "In minutes. 0 = off"
			: "Turn on notifications to receive alarms",
	};

	return {
		values,
		handleChange,
		handleSubmit,
		handleChangeVariant,
		handleResetSettings,
		variant,
		isLoading,
		isError,
		disabledFields,
		helpText,
		loaded: Boolean(userConfig),
	};
};

export default useSettingsForm;
