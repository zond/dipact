/* eslint-disable no-restricted-globals */
import "firebase/messaging";
import React, { useState } from "react";
import {
	Button,
	Container,
	FormControl,
	FormControlLabel,
	InputLabel,
	MenuItem,
	Select,
	Switch,
	TextField,
	Typography,
	makeStyles,
	IconButton,
	Tooltip,
} from "@material-ui/core";
import useRegisterPageView from "../hooks/useRegisterPageview";
import ResetSettingsDialog from "../components/ResetSettingsDialog";
import useSettingsForm from "../hooks/useSettingsForm";
import NavBar from "../components/NavBar";
import Loading from "../components/Loading";
import { UndoIcon } from "../icons";
import ErrorPage from "../components/ErrorPage";

const useStyles = makeStyles((theme) => {
	return {
		root: {
			"& section": {
				paddingTop: theme.spacing(2),
			},
		},
		textField: {
			maxWidth: theme.spacing(24),
		},
		buttons: {
			display: "flex",
			justifyContent: "space-between",
		},
		variantSelect: {
			display: "flex",
			flexDirection: "column",
			gap: theme.spacing(1),
		},
		nations: {
			display: "flex",
			justifyContent: "space-between",
			alignItems: "center",
			"& > div": {
				display: "flex",
				alignItems: "center",
			},
		},
	};
});

interface SettingsProps {
	useSettingsFormDI?: typeof useSettingsForm;
}

const Settings = ({
	useSettingsFormDI = useSettingsForm,
}: SettingsProps): React.ReactElement => {
	const classes = useStyles();
	useRegisterPageView("SettingsDialog"); // NOTE rename?
	const userId = "123456789";
	const {
		edited,
		editedColors,
		resetColor,
		values,
		handleChange,
		handleSubmit,
		handleResetSettings,
		isLoading,
		isError,
		variant,
		handleChangeVariant,
		disabledFields,
		helpText,
		loaded,
	} = useSettingsFormDI(userId);
	const [resetSettingsDialogOpen, setResetSettingsDialogOpen] = useState(false);

	const onClickResetSettings = () => setResetSettingsDialogOpen(true);
	return (
		<>
			<NavBar title="Settings" />
			{isError ? (
				<ErrorPage />
			) : !loaded ? (
				<Loading />
			) : (
				<Container className={classes.root}>
					<form onSubmit={handleSubmit}>
						<section>
							<Typography variant="subtitle2">Notifications</Typography>
							<div>
								<FormControlLabel
									label="Push notifications"
									control={
										<Switch
											name="enablePushNotifications"
											checked={values.enablePushNotifications}
											disabled={disabledFields.enablePushNotifications}
											onChange={handleChange}
										/>
									}
								/>
							</div>
							<div>
								<FormControlLabel
									label="Email notifications"
									control={
										<Switch
											name="enableEmailNotifications"
											checked={values.enableEmailNotifications}
											disabled={disabledFields.enableEmailNotifications}
											onChange={handleChange}
										/>
									}
								/>
							</div>
						</section>
						<div>
							<TextField
								label="Phase deadline reminder"
								name="phaseDeadline"
								type="number"
								inputProps={{ min: 0 }}
								fullWidth
								className={classes.textField}
								disabled={disabledFields.phaseDeadline}
								helperText={helpText.phaseDeadline}
								margin="dense"
								value={values.phaseDeadline}
								onChange={handleChange}
							/>
						</div>

						<section>
							<Typography variant="subtitle2">Custom nation colours</Typography>
							<FormControl>
								<InputLabel shrink id="variantinputlabel">
									Variant
								</InputLabel>
								<Select
									fullWidth
									name="variant"
									labelId="variantinputlabel"
									value={variant}
									onChange={handleChangeVariant}
								>
									{Object.keys(values.colors).map((variantName) => (
										<MenuItem key={variantName} value={variantName}>
											{variantName}
										</MenuItem>
									))}
								</Select>
							</FormControl>
							<div className={classes.variantSelect}>
								{values.colors[variant] &&
									Object.entries(values.colors[variant]).map(
										([nation, color]) => (
											<div className={classes.nations} key={nation}>
												<Typography>{nation}</Typography>
												<div>
													{editedColors[variant][nation] && (
														<Tooltip title="Undo">
															<IconButton
																onClick={() => resetColor(variant, nation)}
															>
																<UndoIcon />
															</IconButton>
														</Tooltip>
													)}
													<input
														type="color"
														name={`colors.${variant}.${nation}`}
														disabled={disabledFields.colors}
														value={color}
														onChange={handleChange}
													/>
												</div>
											</div>
										)
									)}
							</div>
						</section>
						<section>
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
									disabled={isLoading || !edited}
								>
									Save Changes
								</Button>
							</div>
						</section>
						<ResetSettingsDialog
							open={resetSettingsDialogOpen}
							close={() => setResetSettingsDialogOpen(false)}
							handleResetSettings={handleResetSettings}
							isLoading={isLoading}
						/>
					</form>
				</Container>
			)}
		</>
	);
};

export default Settings;
