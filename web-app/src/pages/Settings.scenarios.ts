import React, { FormEvent, useState } from "react";
import { useFormik } from "formik";
import useSettingsForm from "../hooks/useSettingsForm";

type SettingsScenario = Omit<
	ReturnType<typeof useSettingsForm>,
	| "handleChange"
	| "handleSubmit"
	| "handleChangeVariant"
	| "handleResetSettings"
	| "resetColor"
>;

const defaultScenario: SettingsScenario = {
	values: {
		colors: {},
		enablePushNotifications: false,
		enableEmailNotifications: false,
		phaseDeadline: 60,
	},
	variant: "",
	isLoading: false,
	isError: false,
	disabledFields: {},
	helpText: {
		phaseDeadline: "In minutes. 0 = off",
	},
    edited: true,
    editedColors: {},
	loaded: true,
};
const colors = {
	Classical: {
		England: "#FFFFFF",
		France: "#000000",
	},
	Other: {
		Ireland: "#FFFFFF",
		Greece: "#000000",
	},
};
const editedColors = {
	Classical: {
		England: false,
		France: false,
	},
	Other: {
		Ireland: false,
		Greece: false,
	},
};
const disabledFields = {
	phaseDeadline: true,
	enableEmailNotifications: true,
	enablePushNotifications: true,
	colors: true,
};

const NotLoaded = {
	...defaultScenario,
	loaded: false,
};

const Loaded = {
	...defaultScenario,
	values: { ...defaultScenario.values, colors: { ...colors }},
	editedColors: { ...editedColors },
	variant: "Classical",
};

const IsLoading = {
	...Loaded,
	isLoading: true,
	disabledFields: { ...disabledFields },
};

const TokenEnabled = {
	...Loaded,
	values: { ...Loaded.values, enablePushNotifications: true },
	helpText: {
		phaseDeadline: "Turn on notifications to receive alarms",
	},
	disabledFields: {
		...Loaded.disabledFields,
		phaseDeadline: true,
	},
};

const Unedited = {
	...Loaded,
	edited: false,
}

const EditedColor = {
	...Loaded,
	editedColors: { ...Loaded.editedColors, Classical: { ...Loaded.editedColors.Classical, France: true }},
}

const Error = {
	...Loaded,
	isError: true,
}

export const Scenarios: { [key: string]: SettingsScenario } = {
	NotLoaded,
	IsLoading,
	Loaded,
	TokenEnabled,
    Unedited,
	EditedColor,
	Error
};

export const createSettingsFormDI = (scenario: SettingsScenario) => {
	return () => {
		const { values, handleChange } = useFormik({
			initialValues: scenario.values,
			onSubmit: () => {},
		});
		const [variant, setVariant] = useState(scenario.variant);
		const handleChangeVariant = (
			e: React.ChangeEvent<HTMLSelectElement>
		): void => {
			const value = e.target.value as string;
			setVariant(value);
		};
		const handleResetSettings = () => {};
		const resetColor = () => {};
		const handleSubmit = (e?: FormEvent<HTMLFormElement> | undefined) => {
			e?.preventDefault();
		};
		return {
			...scenario,
			handleChange,
			handleChangeVariant,
			handleSubmit,
			resetColor,
			values,
			variant,
			handleResetSettings,
		};
	};
};
