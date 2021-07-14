/* eslint-disable react/no-direct-mutation-state */
/* eslint-disable no-restricted-globals */
import firebase from "firebase/app";
import "firebase/messaging";
import React from 'react';
import * as helpers from '../helpers';
import gtag from 'ga-gtag';
import {
    InputLabel,
    FormControlLabel,
    Select,
    Dialog,
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
} from '@material-ui/core';

import Color from './Color';
import Globals from '../Globals';
import { DeleteIcon, GoBackIcon } from "../icons";

export default class SettingsDialog extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false,
			userConfig: Globals.userConfig,
			newColorOverrideVariant: "Classical",
			resetSettingsChecked: false,
		};
		if (this.props.parentCB) {
			this.props.parentCB(this);
		}
		this.close = this.close.bind(this);
		this.updatePhaseDeadline = this.updatePhaseDeadline.bind(this);
		this.newColorSetter = this.newColorSetter.bind(this);
		this.newColorDeleter = this.newColorDeleter.bind(this);
		this.generateNewUserColors = this.generateNewUserColors.bind(this);
		this.saveConfig = this.saveConfig.bind(this);
	}
	newColorDeleter(nation) {
		return (_) => {
			if (
				Globals.colorOverrides.variants[
					this.state.newColorOverrideVariant
				]
			) {
				delete Globals.colorOverrides.variants[
					this.state.newColorOverrideVariant
				][nation];
			}
			this.generateNewUserColors().then(this.saveConfig);
		};
	}
	newColorSetter(nation) {
		return (color) => {
			const variant = this.state.newColorOverrideVariant;
			if (!Globals.colorOverrides.variants[variant]) {
				Globals.colorOverrides.variants[variant] = {};
			}
			Globals.colorOverrides.variants[variant][nation] = color;
			this.generateNewUserColors().then(this.saveConfig);
		};
	}
	generateNewUserColors() {
		return new Promise((res, rej) => {
			this.setState((state, props) => {
				state = Object.assign({}, state);
				state.userConfig.Properties.Colors =
					Globals.colorOverrides.positions;
				Object.keys(Globals.colorOverrides.nations || {}).forEach(
					(nation) => {
						state.userConfig.Properties.Colors.push(
							nation.replace(helpers.overrideReg, "") +
								"/" +
								Globals.colorOverrides.nations[nation]
						);
					}
				);
				Object.keys(Globals.colorOverrides.variants || {}).forEach(
					(variant) => {
						Object.keys(
							Globals.colorOverrides.variants[variant] || {}
						).forEach((nation) => {
							state.userConfig.Properties.Colors.push(
								variant.replace(helpers.overrideReg, "") +
									"/" +
									nation.replace(helpers.overrideReg, "") +
									"/" +
									Globals.colorOverrides.variants[variant][
										nation
									]
							);
						});
					}
				);
				return state;
			}, res);
		});
	}
	close() {
		helpers.unback(this.close);
		this.setState({ open: false });
	}
	componentDidUpdate(prevProps, prevState, snapshot) {
		if (
			JSON.stringify(Globals.userConfig) !==
			JSON.stringify(this.state.userConfig)
		) {
			this.setState({ userConfig: Globals.userConfig });
		}
		if (!prevState.open && this.state.open) {
			gtag("set", {
				page_title: "SettingsDialog",
				page_location: location.href,
			});
			gtag("event", "page_view");
		}
	}
	saveConfig() {
		this.state.userConfig.Properties.PhaseDeadlineWarningMinutesAhead = Number.parseInt(
			this.state.userConfig.Properties.PhaseDeadlineWarningMinutesAhead ||
				"0"
		);
		let updateLink = this.state.userConfig.Links.find((l) => {
			return l.Rel === "update";
		});
		helpers.incProgress();
		return helpers
			.safeFetch(
				helpers.createRequest(updateLink.URL, {
					method: updateLink.Method,
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(this.state.userConfig.Properties),
				})
			)
			.then((resp) => resp.json())
			.then((js) => {
				helpers.decProgress();
				Globals.userConfig = js;
				helpers.parseUserConfigColors();
				this.setState((state, props) => {
					state = Object.assign({}, state);
					state.userConfig = js;
					return state;
				});
			});
	}
	updatePhaseDeadline(ev) {
		ev.persist();
		this.setState(
			(state, props) => {
				state = Object.assign({}, state);
				let newValue = ev.target.value;
				if (newValue !== "") {
					newValue = Number.parseInt(newValue);
				}
				state.userConfig.Properties.PhaseDeadlineWarningMinutesAhead = newValue;
				if (!state.userConfig.Properties.FCMTokens) {
					state.userConfig.Properties.FCMTokens = [];
				}
				return state;
			},
			(_) => {}
		);
	}
	render() {
		return (
			<Dialog
				onEntered={helpers.genOnback(this.close)}
				open={this.state.open}
				fullScreen
				disableBackdropClick={false}
				onClose={this.close}
			>
				<AppBar>
					<Toolbar>
						<IconButton
							edge="start"
							color="inherit"
							onClick={this.close}
							aria-label="close"
						>
							<GoBackIcon />
						</IconButton>
						<Typography
							variant="h6"
							style={{ paddingLeft: "16px" }}
						>
							Settings
						</Typography>
					</Toolbar>
				</AppBar>

				{this.state.userConfig ? (
					<React.Fragment>
						<div>
							<div
								style={{
									margin: "56px auto 16px auto",
									padding: "0px 16px",
									display: "flex",
									flexDirection: "column",
									maxWidth: "940px",
								}}
							>
								<Typography
									variant="subtitle2"
									style={{
										color: "rgba(40, 26, 26, 0.56)",
										padding: "16px 0px",
									}}
								>
									Notifications
								</Typography>
								<div width="100%">
									<FormControlLabel
										style={{
											width: "100%",
											maxWidth: "920px",
											paddingLeft: "0px",
										}}
										classes={{
											root: {
												paddingLeft: "0px"
											}
										}}
										control={
											<Switch
												checked={
													Globals.messaging
														.tokenEnabled
												}
												disabled={
													Globals.messaging
														.hasPermission ===
													"false"
												}
												onChange={(ev) => {
													const wantedState =
														ev.target.checked;
													helpers.incProgress();
													Globals.messaging
														.start()
														.then((js) => {
															helpers.decProgress();
															let currentConfig = this
																.state
																.userConfig;
															if (js) {
																currentConfig = js;
															}
															this.setState(
																(
																	state,
																	props
																) => {
																	state = Object.assign(
																		{},
																		state
																	);
																	state.userConfig = currentConfig;
																	return state;
																},
																(_) => {
																	if (
																		Globals
																			.messaging
																			.tokenOnServer
																	) {
																		if (
																			Globals
																				.messaging
																				.tokenEnabled !==
																			wantedState
																		) {
																			Globals.messaging.targetState = wantedState
																				? "enabled"
																				: "disabled";
																			helpers.incProgress();
																			const uploadPromise =
																				window.Wrapper &&
																				window
																					.Wrapper
																					.startFCM
																					? Globals.messaging.uploadToken()
																					: Globals.messaging.refreshToken();
																			uploadPromise.then(
																				(
																					js
																				) => {
																					helpers.decProgress();
																					this.setState(
																						{
																							config: js,
																						}
																					);
																				}
																			);
																		} else {
																			this.forceUpdate();
																		}
																	} else {
																		this.forceUpdate();
																	}
																}
															);
														});
												}}
											/>
										}
										label="Push notifications"
									/>
									{firebase.messaging.isSupported() ||
									(window.Wrapper &&
										window.Wrapper.startFCM) ? (
										Globals.messaging.started ? (
											Globals.messaging.hasPermission ===
												"true" ||
											(window.Wrapper &&
												window.Wrapper.startFCM) ? (
												Globals.messaging
													.tokenOnServer ? (
													window.Wrapper &&
													window.Wrapper
														.notificationStatus ? (
														window.Wrapper.notificationStatus() !==
														"OK" ? (
															window.Wrapper.notificationStatus()
														) : (
															""
														)
													) : (
														""
													)
												) : (
													<p
														style={{
															marginTop: "2px",
														}}
													>
														<Typography variant="caption">
															Notifications
															disabled [Error: no
															token uploaded]
														</Typography>
													</p>
												)
											) : (
												<p style={{ marginTop: "2px" }}>
													<Typography variant="caption">
														No notification
														permission received.
														<br />
														<a
															href="https://www.google.com/search?q=reset+browser+permission+notifications&rlz=1C5CHFA_enNL775NL775&oq=reset+browser+permission+notifications&aqs=chrome..69i57j69i60l2.3519j1j4&sourceid=chrome&ie=UTF-8"
															target="_blank"
															rel="noreferrer"
														>
															Allow this sites
															notifications in
															your browser
															settings.
														</a>
													</Typography>
												</p>
											)
										) : (
											<p style={{ marginTop: "2px" }}>
												<Typography variant="caption">
													Notifications disabled
													[Error: notification system
													did not start]
												</Typography>
											</p>
										)
									) : (
										<p style={{ marginTop: "2px" }}>
											<Typography variant="caption">
												Notifications disabled [Error:
												Firebase Messaging not supported
												on your browser]
											</Typography>
										</p>
									)}
								</div>

								<FormControlLabel
									control={
										<Switch
											checked={
												!!this.state.userConfig
													.Properties.MailConfig
													.Enabled
											}
											onChange={(ev) => {
												ev.persist();
												this.setState(
													(state, props) => {
														state = Object.assign(
															{},
															state
														);
														state.userConfig.Properties.MailConfig.Enabled =
															ev.target.checked;
														let hrefURL = new URL(
															location.href
														);
														state.userConfig.Properties.MailConfig.MessageConfig.TextBodyTemplate =
															'You received a new message on Diplicity:\n\n"{{message.Body}}"\n\n\nTo view the game, visit\n\n' +
															hrefURL.protocol +
															"//" +
															hrefURL.host +
															"/Game/{{game.ID.Encode}}\n\n\n\n\nTo turn off email notifications from Diplicity, visit:\n\n{{unsubscribeURL}}";
														state.userConfig.Properties.MailConfig.PhaseConfig.TextBodyTemplate =
															"{{game.Desc}} has changed state.\n\n\nTo view the game, visit\n " +
															hrefURL.protocol +
															"//" +
															hrefURL.host +
															"/Game/{{game.ID.Encode}}.\n\n\n\n\nTo turn off emails notifications from Diplicity, visit:\n\n{{unsubscribeURL}}";
														return state;
													},
													this.saveConfig
												);
											}}
										/>
									}
									label="Email notifications"
								/>
								<TextField
									inputProps={{ min: 0 }}
									fullWidth
									style={{
										marginTop: "1px",
										maxWidth: "180px",
									}}
									disabled={
										!this.state.userConfig.Properties
											.MailConfig.Enabled &&
										!Globals.messaging.tokenEnabled
									}
									type="number"
									label="Phase deadline reminder"
									helperText={
										this.state.userConfig.Properties
											.MailConfig.Enabled ||
										Globals.messaging.tokenEnabled
											? "In minutes. 0 = off"
											: "Turn on notifications to receive alarms"
									}
									margin="dense"
									value={
										this.state.userConfig.Properties
											.PhaseDeadlineWarningMinutesAhead
									}
									onChange={this.updatePhaseDeadline}
									onBlur={this.saveConfig}
								/>
								<Typography
									variant="subtitle2"
									style={{
										color: "rgba(40, 26, 26, 0.56)",
										marginTop: "16px",
										padding: "16px 0px",
									}}
								>
									Custom nation colours
								</Typography>

								<div
									className={helpers.scopedClass(
										"display: flex; flex-direction: column"
									)}
								>
									<FormControl
										style={{ marginBottom: "8px" }}
									>
										<InputLabel
											shrink
											id="variantinputlabel"
										>
											Variant
										</InputLabel>
										<Select
											fullWidth
											labelId="variantinputlabel"
											value={
												this.state
													.newColorOverrideVariant
											}
											onChange={(ev) => {
												const variant = Globals.variants.find(
													(v) => {
														return (
															v.Properties.Name ===
															ev.target.value
														);
													}
												);
												let nation = this.state
													.newColorOverrideNation;
												if (
													variant.Properties.Nations.indexOf(
														nation
													) === -1
												) {
													nation =
														variant.Properties
															.Nations[0];
												}
												this.setState({
													newColorOverrideNation: nation,
													newColorOverrideVariant:
														ev.target.value,
												});
											}}
										>
											{Globals.variants.map((variant) => {
												return (
													<MenuItem
														key={
															variant.Properties
																.Name
														}
														value={
															variant.Properties
																.Name
														}
													>
														{
															variant.Properties
																.Name
														}
													</MenuItem>
												);
											})}
										</Select>
									</FormControl>

									<div
										style={{
											display: "flex",
											flexDirection: "column",
										}}
									>
										{Globals.variants
											.find((v) => {
												return (
													v.Properties.Name ===
													this.state
														.newColorOverrideVariant
												);
											})
											.Properties.Nations.map(
												(nation, index) => {
													return (
														<div
															style={{
																display: "flex",
																height: "48px",
																alignItems:
																	"center",
															}}
															key={nation}
															value={nation}
														>
															<Typography>
																{nation}
															</Typography>

															<div
																style={{
																	marginLeft:
																		"auto",
																	display:
																		"flex",
																	alignItems:
																		"center",
																}}
															>
																<Color
																	className={helpers.scopedClass(
																		"flex-grow: 0; margin-right: 4px;"
																	)}
																	value={
																		(Globals
																			.colorOverrides
																			.variants[
																			this
																				.state
																				.newColorOverrideVariant
																		] ||
																			{})[
																			nation
																		]
																			? Globals
																					.colorOverrides
																					.variants[
																					this
																						.state
																						.newColorOverrideVariant
																			  ][
																					nation
																			  ]
																			: Globals
																					.contrastColors[
																					index
																			  ]
																	}
																	edited={
																		(Globals
																			.colorOverrides
																			.variants[
																			this
																				.state
																				.newColorOverrideVariant
																		] ||
																			{})[
																			nation
																		] &&
																		Globals
																			.contrastColors[
																			index
																		] !==
																			Globals
																				.colorOverrides
																				.variants[
																				this
																					.state
																					.newColorOverrideVariant
																			][
																				nation
																			]
																			? false
																			: true
																	}
																	onSelect={this.newColorSetter(
																		nation
																	)}
																/>
															</div>

															{(Globals
																.colorOverrides
																.variants[
																this.state
																	.newColorOverrideVariant
															] || {})[nation] &&
															Globals
																.contrastColors[
																index
															] !==
																Globals
																	.colorOverrides
																	.variants[
																	this.state
																		.newColorOverrideVariant
																][nation] ? (
																<div
																	onClick={this.newColorDeleter(
																		nation
																	)}
																	style={{
																		color:
																			"#281A1A",
																	}}
																>
																	<DeleteIcon />
																</div>
															) : (
																""
															)}
														</div>
													);
												}
											)}
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
										label: helpers.scopedClass(
											"font-size: unset;"
										),
									}}
									control={
										<Checkbox
											onClick={(ev) => {
												this.setState({
													resetSettingsChecked: !this
														.state
														.resetSettingsChecked,
												});
											}}
											style={{ padding: "0 0 0 18" }}
											id="sure-about-reset"
										/>
									}
									label="I want to reset my settings"
								/>
							</div>
							<Button
								style={{ margin: "auto" }}
								variant="contained"
								color="primary"
								disabled={!this.state.resetSettingsChecked}
								onClick={(_) => {
									if (
										document.getElementById(
											"sure-about-reset"
										).checked
									) {
										this.setState(
											(state, props) => {
												state = Object.assign(
													{},
													state
												);
												state.userConfig.Properties.Colors = [];
												state.userConfig.Properties.FCMTokens = [];
												state.userConfig.Properties.MailConfig = {};
												state.userConfig.Properties.PhaseDeadlineWarningMinutesAhead = 0;
												return state;
											},
											(_) => {
												this.saveConfig().then((_) => {
													location.reload();
												});
											}
										);
									}
								}}
							>
								Reset settings
							</Button>
						</div>
					</React.Fragment>
				) : (
					""
				)}
			</Dialog>
		);
	}
}
