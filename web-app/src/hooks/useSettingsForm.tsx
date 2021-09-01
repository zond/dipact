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

type EditedColors = {
	[key: string]: { [key: string]: boolean };
};

const preApiResponseValues: SettingsFormValues = {
	colors: {},
	enablePushNotifications: false,
	enableEmailNotifications: false,
	phaseDeadline: 60,
};

type FieldNames = keyof SettingsFormValues;

type DisabledFields = { [K in FieldNames]?: boolean };
type HelpText = { [K in FieldNames]?: string };

interface IUseSettingsForm {
	edited: boolean;
	editedColors: EditedColors;
	resetColor: (variant: string, nation: string) => void;
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
	if (!variants) return {};
	return variants?.reduce((colorMap: ColorMap, variant) => {
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

const getEditedColors = (
	initialValues: SettingsFormValues,
	values: SettingsFormValues
): EditedColors =>
	Object.entries(values.colors).reduce(
		(editedColors: EditedColors, [variantName, nations]) => {
			editedColors[variantName] = Object.entries(nations).reduce(
				(nat: { [key: string]: boolean }, [nationName, color]) => {
					nat[nationName] =
						initialValues.colors[variantName][nationName] !==
						values.colors[variantName][nationName];
					return nat;
				},
				{}
			);
			return editedColors;
		},
		{}
	);

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
	const [variant, setVariant] = useState("");

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

	const {
		values,
		handleChange,
		handleSubmit,
		resetForm,
		initialValues,
		setFieldValue,
		dirty,
	} = useFormik({
		initialValues: preApiResponseValues,
		onSubmit: (vals) => {
			dispatch(submitSettingsForm(vals));
		},
	});

	useEffect(() => {
		if (userConfig) {
			const vals = getInitialFormValues(colorOverrides, userConfig, variants);
			resetForm({ values: { ...values, ...vals } });
			setVariant(CLASSICAL);
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

	const edited = dirty;
	// TODO this should be in a useEffect to avoid recalculating every render
	const editedColors = getEditedColors(initialValues, values);
	const resetColor = (variant: string, nation: string) => {
		const fieldName = `colors.${variant}.${nation}`;
		setFieldValue(fieldName, initialValues.colors[variant][nation]);
	};

	return {
		edited,
		editedColors,
		resetColor,
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
