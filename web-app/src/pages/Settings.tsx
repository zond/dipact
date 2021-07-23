/* eslint-disable no-restricted-globals */
import firebase from "firebase/app";
import "firebase/messaging";
import React, { useState } from "react";
import * as helpers from "../helpers";
import {
	InputLabel,
	FormControlLabel,
	Select,
	AppBar,
	MenuItem,
	Toolbar,
	IconButton,
	Button,
	Checkbox,
	TextField,
	Typography,
	Switch,
	FormControl,
	makeStyles,
} from "@material-ui/core";
import { RouteComponentProps, withRouter } from "react-router-dom";
import Color from "../components/Color";
import Globals from "../Globals";
import { DeleteIcon, GoBackIcon } from "../icons";
import useRegisterPageView from "../hooks/useRegisterPageview";
import {
	useColorOverrides,
	useSelectVariantByName,
	useUserConfig,
	useVariants,
} from "../hooks/selectors";

const CLASSICAL = "Classical";

const useStyles = makeStyles((theme) => {
	return {
		root: {
			"& h6": {
				paddingLeft: theme.spacing(2),
			},
		},
		subtitle: {
			margin: "56px auto 16px auto",
			padding: theme.spacing(0, 2), // TODO remove hard coding
			display: "flex",
			flexDirection: "column",
			maxWidth: "940px", // TODO remove hard coding
		},
		subtitle2: {
			color: "rgba(40, 26, 26, 0.56)", // TODO remove hard coding
			padding: theme.spacing(2, 0),
		},
		formControlLabel: {
			width: "100%",
			maxWidth: "920px", // TODO remove hard coding
			paddingLeft: theme.spacing(0),
		},
		notificationWarning: {
			marginTop: theme.spacing(0.25),
		},
		textField: {
			marginTop: theme.spacing(0.125),
			maxWidth: "180px", // TODO remove hard coding
		},
		variantSelect: {
			display: "flex",
			flexDirection: "column",
		},
		variantSelectFormControlLabel: {
			marginBottom: theme.spacing(1),
		},
		nations: {
			display: "flex",
			height: theme.spacing(6),
			alignItems: "center",
			"& > div": {
				marginLeft: "auto",
				display: "flex",
				alignItems: "center",
			},
		},
		color: {
			flexGrow: 0,
			marginRight: theme.spacing(0.5),
		},
		delete: {
			color: theme.palette.primary.main,
		},
	};
});

const Settings = ({ history }: RouteComponentProps): React.ReactElement => {
	const [newColorOverrideNation, setNewColorOverrideNation] = useState("");
	const [newColorOverrideVariant, setNewColorOverrideVariant] =
		useState(CLASSICAL);
	const [resetSettingsChecked, setResetSettingsChecked] = useState(false);

	// TODO make sure this only happens when opened
	// TODO move dialog to upper level
	useRegisterPageView("SettingsDialog"); // NOTE rename?
	const userConfig = useUserConfig();
	const variants = useVariants();
	const variant = useSelectVariantByName(newColorOverrideVariant);
	const colorOverrides = useColorOverrides();
	const classes = useStyles();

	const getColorOverrideForNation = (nation: string, index: number): string => {
		const override = (colorOverrides.variants[newColorOverrideVariant] || {})[
			nation
		];
		return override || Globals.contrastColors[index] || "";
	};

	const getColorOverrideEdited = (nation: string, index: number): boolean => {
		const override = (colorOverrides.variants[newColorOverrideVariant] || {})[
			nation
		];
		return !(override && Globals.contrastColors[index] !== override);
	};

	const close = (): void => history.push("/");

	// TODO action
	const onTogglePushNotifications = () => null;

	// TODO action
	const setNewColor = () => null;

	// TODO action
	const deleteNewColor = () => null;

	const onClickResetSettings = () => {
		// onClick={(_) => {
		// 	if (resetSettingsChecked) {
		// 		this.setState(
		// 			(state, props) => {
		// 				state = Object.assign({}, state);
		// 				state.userConfig.Properties.Colors = [];
		// 				state.userConfig.Properties.FCMTokens = [];
		// 				state.userConfig.Properties.MailConfig = {};
		// 				state.userConfig.Properties.PhaseDeadlineWarningMinutesAhead = 0;
		// 				return state;
		// 			},
		// 			(_) => {
		// 				saveConfig().then((_) => {
		// 					location.reload();
		// 				});
		// 			}
		// 		);
		// 	}
		// }
	};

	const Wrapper = {
		startFCM: true,
		notificationStatus: () => null,
	};

	// TODO actio
	const onToggleEmailNotifications = () => {
		// ev.persist();
		// this.setState((state, props) => {
		// 	state = Object.assign({}, state);
		// 	state.userConfig.Properties.MailConfig.Enabled = ev.target.checked;
		// 	const hrefURL = new URL(location.href);
		// 	state.userConfig.Properties.MailConfig.MessageConfig.TextBodyTemplate =
		// 		'You received a new message on Diplicity:\n\n"{{message.Body}}"\n\n\nTo view the game, visit\n\n' +
		// 		hrefURL.protocol +
		// 		"//" +
		// 		hrefURL.host +
		// 		"/Game/{{game.ID.Encode}}\n\n\n\n\nTo turn off email notifications from Diplicity, visit:\n\n{{unsubscribeURL}}";
		// 	state.userConfig.Properties.MailConfig.PhaseConfig.TextBodyTemplate =
		// 		"{{game.Desc}} has changed state.\n\n\nTo view the game, visit\n " +
		// 		hrefURL.protocol +
		// 		"//" +
		// 		hrefURL.host +
		// 		"/Game/{{game.ID.Encode}}.\n\n\n\n\nTo turn off emails notifications from Diplicity, visit:\n\n{{unsubscribeURL}}";
		// 	return state;
		// }, this.saveConfig);
	};

	const updatePhaseDeadline = () => {
		// updatePhaseDeadline(ev) {
		// 	ev.persist();
		// 	this.setState(
		// 		(state, props) => {
		// 			state = Object.assign({}, state);
		// 			let newValue = ev.target.value;
		// 			if (newValue !== "") {
		// 				newValue = Number.parseInt(newValue);
		// 			}
		// 			state.userConfig.Properties.PhaseDeadlineWarningMinutesAhead = newValue;
		// 			if (!state.userConfig.Properties.FCMTokens) {
		// 				state.userConfig.Properties.FCMTokens = [];
		// 			}
		// 			return state;
		// 		},
		// 		(_) => {}
		// 	);
		// }
	};

	const saveConfig = () => {
		// saveConfig() {
		// 	this.state.userConfig.Properties.PhaseDeadlineWarningMinutesAhead = Number.parseInt(
		// 		this.state.userConfig.Properties.PhaseDeadlineWarningMinutesAhead ||
		// 			"0"
		// 	);
		// 	let updateLink = this.state.userConfig.Links.find((l) => {
		// 		return l.Rel === "update";
		// 	});
		// 	helpers.incProgress();
		// 	return helpers
		// 		.safeFetch(
		// 			helpers.createRequest(updateLink.URL, {
		// 				method: updateLink.Method,
		// 				headers: {
		// 					"Content-Type": "application/json",
		// 				},
		// 				body: JSON.stringify(this.state.userConfig.Properties),
		// 			})
		// 		)
		// 		.then((resp) => resp.json())
		// 		.then((js) => {
		// 			helpers.decProgress();
		// 			Globals.userConfig = js;
		// 			helpers.parseUserConfigColors();
		// 			this.setState((state, props) => {
		// 				state = Object.assign({}, state);
		// 				state.userConfig = js;
		// 				return state;
		// 			});
		// 		});
		// }
	};

	const onChangeVariantInput = (): void => {
		(e: React.ChangeEvent<HTMLSelectElement>) => {
			const selectedVariant = variants.find((v) => v.Name === e.target.value);
			if (selectedVariant === undefined)
				throw new TypeError("Variant not found");
			let nation = newColorOverrideNation;
			if (!selectedVariant.Nations.includes(nation)) {
				nation = selectedVariant.Nations[0];
			}
			setNewColorOverrideNation(nation);
			setNewColorOverrideVariant(e.target.value);
		};
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

			{userConfig ? (
				<React.Fragment>
					<div>
						<div className={classes.subtitle}>
							<Typography variant="subtitle2" className={classes.subtitle2}>
								Notifications
							</Typography>
							<div>
								<FormControlLabel
									className={classes.formControlLabel}
									control={
										<Switch
											checked={Globals.messaging.tokenEnabled}
											disabled={Globals.messaging.hasPermission === "false"}
											onChange={onTogglePushNotifications}
										/>
									}
									label="Push notifications"
								/>
								{firebase.messaging.isSupported() ||
								(Wrapper && Wrapper.startFCM) ? (
									Globals.messaging.started ? (
										Globals.messaging.hasPermission === "true" ||
										(Wrapper && Wrapper.startFCM) ? (
											Globals.messaging.tokenOnServer ? (
												Wrapper && Wrapper.notificationStatus ? (
													Wrapper.notificationStatus() !== "OK" ? (
														Wrapper.notificationStatus()
													) : (
														""
													)
												) : (
													""
												)
											) : (
												<p className={classes.notificationWarning}>
													<Typography variant="caption">
														Notifications disabled [Error: no token uploaded]
													</Typography>
												</p>
											)
										) : (
											<p className={classes.notificationWarning}>
												<Typography variant="caption">
													No notification permission received.
													<br />
													<a
														href="https://www.google.com/search?q=reset+browser+permission+notifications&rlz=1C5CHFA_enNL775NL775&oq=reset+browser+permission+notifications&aqs=chrome..69i57j69i60l2.3519j1j4&sourceid=chrome&ie=UTF-8"
														target="_blank"
														rel="noreferrer"
													>
														Allow this sites notifications in your browser
														settings.
													</a>
												</Typography>
											</p>
										)
									) : (
										<p className={classes.notificationWarning}>
											<Typography variant="caption">
												Notifications disabled [Error: notification system did
												not start]
											</Typography>
										</p>
									)
								) : (
									<p className={classes.notificationWarning}>
										<Typography variant="caption">
											Notifications disabled [Error: Firebase Messaging not
											supported on your browser]
										</Typography>
									</p>
								)}
							</div>

							<FormControlLabel
								control={
									<Switch
										checked={!!userConfig.MailConfig?.Enabled}
										onChange={onToggleEmailNotifications}
									/>
								}
								label="Email notifications"
							/>
							<TextField
								inputProps={{ min: 0 }}
								fullWidth
								className={classes.textField}
								disabled={
									!userConfig.MailConfig?.Enabled &&
									!Globals.messaging.tokenEnabled
								}
								type="number"
								label="Phase deadline reminder"
								helperText={
									userConfig.MailConfig?.Enabled
									// TODO
									// messaging.tokenEnabled
									// 	? "In minutes. 0 = off"
									// 	: "Turn on notifications to receive alarms"
								}
								margin="dense"
								value={userConfig.PhaseDeadlineWarningMinutesAhead}
								onChange={updatePhaseDeadline}
								onBlur={saveConfig}
							/>
							<Typography variant="subtitle2" className={classes.subtitle2}>
								Custom nation colours
							</Typography>

							<div className={classes.variantSelect}>
								<FormControl className={classes.formControlLabel}>
									<InputLabel shrink id="variantinputlabel">
										Variant
									</InputLabel>
									<Select
										fullWidth
										labelId="variantinputlabel"
										value={newColorOverrideVariant}
										onChange={onChangeVariantInput}
									>
										{variants.map((variant) => (
											<MenuItem key={variant.Name} value={variant.Name}>
												{variant.Name}
											</MenuItem>
										))}
									</Select>
								</FormControl>

								<div className={classes.variantSelect}>
									{variant &&
										variant.Nations.map((nation, index) => {
											return (
												<div className={classes.nations} key={nation}>
													<Typography>{nation}</Typography>

													<div className={classes.color}>
														<Color
															initialValue={getColorOverrideForNation(
																nation,
																index
															)}
															edited={getColorOverrideEdited(nation, index)}
															onSelect={setNewColor}
														/>
													</div>

													{getColorOverrideEdited(nation, index) ? (
														<div
															onClick={deleteNewColor}
															className={classes.delete}
														>
															<DeleteIcon />
														</div>
													) : (
														""
													)}
												</div>
											);
										})}
								</div>
							</div>
						</div>
					</div>
					<div
						style={{
							textAlign: "center",
							marginBottom: "56px",
						}}
					>
						<div>
							<FormControlLabel
								style={{
									marginRight: 0,
									marginBottom: "8px",
								}}
								classes={{
									label: helpers.scopedClass("font-size: unset;"),
								}}
								control={
									<Checkbox
										onClick={() =>
											setResetSettingsChecked(!resetSettingsChecked)
										}
										style={{ padding: "0 0 0 18" }}
									/>
								}
								label="I want to reset my settings"
							/>
						</div>
						<Button
							style={{ margin: "auto" }}
							variant="contained"
							color="primary"
							disabled={!resetSettingsChecked}
							onClick={onClickResetSettings}
						>
							Reset settings
						</Button>
					</div>
				</React.Fragment>
			) : (
				""
			)}
		</>
	);
};

export default withRouter(Settings);
