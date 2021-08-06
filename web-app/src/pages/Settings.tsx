/* eslint-disable no-restricted-globals */
import "firebase/messaging";
import React, { useEffect, useState } from "react";
import {
	FormControlLabel,
	AppBar,
	Toolbar,
	IconButton,
	Button,
	TextField,
	Typography,
	Switch,
	makeStyles,
	Container,
} from "@material-ui/core";
import { RouteComponentProps, withRouter } from "react-router-dom";
import Globals from "../Globals";
import { GoBackIcon } from "../icons";
import useRegisterPageView from "../hooks/useRegisterPageview";
import { useColorOverrides, useMessaging } from "../hooks/selectors";
import { useListVariantsQuery, useSubmitSettingsForm } from "../hooks/service";
import { SettingsFormValues, SettingsFormSubmitValues } from "../store/types";
import ResetSettingsDialog from "../components/ResetSettingsDialog";
import NationColorPicker, { ColorMap } from "../components/NationColorPicker";

const CLASSICAL = "Classical";

const useStyles = makeStyles((theme) => {
	return {
		subtitle: {
			color: theme.palette.grey[400],
			padding: theme.spacing(2, 0),
		},
		notificationWarning: {
			marginTop: theme.spacing(0.25),
		},
		textField: {
			maxWidth: theme.spacing(24),
		},
		variantSelect: {
			display: "flex",
			flexDirection: "column",
		},
		nations: {
			display: "flex",
			height: theme.spacing(6),
			alignItems: "center",
			justifyContent: "space-between",
			"& > div": {
				display: "flex",
				alignItems: "center",
			},
		},
		buttons: {
			display: "flex",
			justifyContent: "space-between",
		},
	};
});

const initialFormValues: SettingsFormValues = {
	Colors: [],
	enablePushNotifications: false,
	enableEmailNotifications: false,
	PhaseDeadlineWarningMinutesAhead: 60,
	selectedVariant: "",
};

const Settings = ({ history }: RouteComponentProps): React.ReactElement => {
	useRegisterPageView("SettingsDialog"); // NOTE rename?

	const [resetSettingsDialogOpen, setResetSettingsDialogOpen] = useState(false);
	const [formValues, setFormValues] =
		useState<SettingsFormValues>(initialFormValues);

	const [submitSettingsForm, queryStatus] = useSubmitSettingsForm("123456789");
	const { userConfig, queryIsLoading, mutationIsLoading, isSuccess, isError } =
		queryStatus;
	const isLoading = queryIsLoading || mutationIsLoading;

	const { data: variants } = useListVariantsQuery(undefined);

	const colorOverrides = useColorOverrides();
	const classes = useStyles();
	const { hasPermission, tokenEnabled } = useMessaging();

	// Set initial variant to Classical once variants are available
	useEffect(() => {
		if (variants?.find((variant) => variant.Name === CLASSICAL))
			setFormValues((f) => ({ ...f, selectedVariant: CLASSICAL }));
	}, [variants]);

	useEffect(() => {
		if (isError || isSuccess) setResetSettingsDialogOpen(false);
	}, [isSuccess, isError]);

	// Set initial form values to userConfig once loaded
	useEffect(() => {
		if (!userConfig) return;
		const { Colors, PhaseDeadlineWarningMinutesAhead, MailConfig } = userConfig;
		const Enabled = MailConfig?.Enabled;
		if (Colors) setFormValues((f) => ({ ...f, Colors }));
		if (PhaseDeadlineWarningMinutesAhead)
			setFormValues((f) => ({ ...f, PhaseDeadlineWarningMinutesAhead }));
		// TODO push notifications
		setFormValues((f) => ({
			...f,
			enableEmailNotifications: Enabled || false,
		}));
	}, [queryIsLoading, userConfig]);

	useEffect(() => {
		setFormValues((f) => ({ ...f, enablePushNotifications: tokenEnabled }));
	}, [tokenEnabled]);

	const getOverride = (nation: string) =>
		(colorOverrides.variants[formValues.selectedVariant] || {})[nation];

	const colorMap: ColorMap = {};
	variants?.forEach((v) => {
		const nations = v.Nations.map((nation, index) => {
			const override = getOverride(nation);
			return {
				name: nation,
				color: override || Globals.contrastColors[index],
				edited: Boolean(override),
			};
		});
		colorMap[v.Name] = nations;
	});

	const close = (): void => history.push("/");

	const setNewColor = () => null;

	const deleteNewColor = () => null;

	const onClickResetSettings = () => setResetSettingsDialogOpen(true);

	const onToggleCheckbox = (
		e: React.ChangeEvent<{ checked: boolean; name: string }>
	) => {
		setFormValues({ ...formValues, [e.target.name]: e.target.checked });
	};

	const onChangePhaseDeadline = (e: React.ChangeEvent<{ value: string }>) =>
		setFormValues({
			...formValues,
			PhaseDeadlineWarningMinutesAhead: Number.parseInt(e.target.value),
		});

	const onChangeVariantInput = (
		e: React.ChangeEvent<{ value: unknown }>
	): void => {
		setFormValues({
			...formValues,
			selectedVariant: e.target.value as string,
		});
	};

	const getSubmitValuesFromForm = (
		form: SettingsFormValues
	): SettingsFormSubmitValues => {
		const {
			enableEmailNotifications,
			enablePushNotifications,
			PhaseDeadlineWarningMinutesAhead,
		} = form;
		return {
			enableEmailNotifications,
			enablePushNotifications,
			PhaseDeadlineWarningMinutesAhead,
		};
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		submitSettingsForm(getSubmitValuesFromForm(formValues));
	};

	const handleResetSettings = () => {
		submitSettingsForm(getSubmitValuesFromForm(initialFormValues));
	};

	return (
		<>
			<AppBar>
				<Toolbar>
					<IconButton
						edge="start"
						color="inherit"
						onClick={close}
						aria-label="close"
					>
						<GoBackIcon />
					</IconButton>
					<Typography variant="h6">Settings</Typography>
				</Toolbar>
			</AppBar>

			<Toolbar />

			<Container>
				<form onSubmit={handleSubmit}>
					<Typography variant="subtitle2" className={classes.subtitle}>
						Notifications
					</Typography>
					<div>
						<FormControlLabel
							label="Push notifications"
							control={
								<Switch
									checked={formValues.enablePushNotifications}
									disabled={hasPermission === "false"}
									name="enablePushNotifications"
									onChange={onToggleCheckbox}
								/>
							}
						/>
					</div>
					<div>
						<FormControlLabel
							label="Email notifications"
							control={
								<Switch
									checked={formValues.enableEmailNotifications}
									name="enableEmailNotifications"
									onChange={onToggleCheckbox}
								/>
							}
						/>
					</div>
					<div>
						<TextField
							label="Phase deadline reminder"
							inputProps={{ min: 0 }}
							fullWidth
							className={classes.textField}
							disabled={!userConfig?.MailConfig?.Enabled && !tokenEnabled}
							type="number"
							helperText={
								tokenEnabled
									? "In minutes. 0 = off"
									: "Turn on notifications to receive alarms"
							}
							margin="dense"
							value={formValues.PhaseDeadlineWarningMinutesAhead}
							onChange={onChangePhaseDeadline}
						/>
					</div>
					<Typography variant="subtitle2" className={classes.subtitle}>
						Custom nation colours
					</Typography>
					<NationColorPicker
						isLoading={isLoading}
						variant={formValues.selectedVariant}
						onChangeVariant={onChangeVariantInput}
						colorMap={colorMap}
						setColor={setNewColor}
						deleteColorOverride={deleteNewColor}
					/>
					<div className={classes.buttons}>
						<Button
							variant="text"
							onClick={onClickResetSettings}
							disabled={isLoading}
						>
							Reset settings
						</Button>
						<Button
							type="submit"
							variant="contained"
							color="primary"
							disabled={isLoading}
						>
							Save Changes
						</Button>
					</div>
					<ResetSettingsDialog
						open={resetSettingsDialogOpen}
						close={() => setResetSettingsDialogOpen(false)}
						handleResetSettings={handleResetSettings}
						isLoading={isLoading}
					/>
				</form>
			</Container>
		</>
	);
};

export default withRouter(Settings);
