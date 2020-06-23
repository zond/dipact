import * as helpers from '%{ cb "/js/helpers.js" }%';

import Color from '%{ cb "/js/color.js" }%';

export default class SettingsDialog extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false,
			userConfig: Globals.userConfig,
			newColorOverrideVariant: "Classical"
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
		return _ => {
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
		return color => {
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
					nation => {
						state.userConfig.Properties.Colors.push(
							nation.replace(helpers.overrideReg, "") +
								"/" +
								Globals.colorOverrides.nations[nation]
						);
					}
				);
				Object.keys(Globals.colorOverrides.variants || {}).forEach(
					variant => {
						Object.keys(
							Globals.colorOverrides.variants[variant] || {}
						).forEach(nation => {
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
			JSON.stringify(Globals.userConfig) !=
			JSON.stringify(this.state.userConfig)
		) {
			this.setState({ userConfig: Globals.userConfig });
		}
		if (!prevState.open && this.state.open) {
			gtag("set", {
				page_title: "SettingsDialog",
				page_location: location.href
			});
			gtag("event", "page_view");
		}
	}
	saveConfig() {
		this.state.userConfig.Properties.PhaseDeadlineWarningMinutesAhead = Number.parseInt(
			this.state.userConfig.Properties.PhaseDeadlineWarningMinutesAhead ||
				"0"
		);
		let updateLink = this.state.userConfig.Links.find(l => {
			return l.Rel == "update";
		});
		helpers.incProgress();
		return helpers
			.safeFetch(
				helpers.createRequest(updateLink.URL, {
					method: updateLink.Method,
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify(this.state.userConfig.Properties)
				})
			)
			.then(resp => resp.json())
			.then(js => {
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
				if (newValue != "") {
					newValue = Number.parseInt(newValue);
				}
				state.userConfig.Properties.PhaseDeadlineWarningMinutesAhead = newValue;
				if (!state.userConfig.Properties.FCMTokens) {
					state.userConfig.Properties.FCMTokens = [];
				}
				return state;
			},
			_ => {}
		);
	}
	render() {
		return (
			<MaterialUI.Dialog
				onEntered={helpers.genOnback(this.close)}
				open={this.state.open}
				fullScreen
				disableBackdropClick={false}
				classes={{
					paper: helpers.scopedClass("margin: 2px; width: 100%;")
				}}
				onClose={this.close}
			>
				<MaterialUI.AppBar>
					<MaterialUI.Toolbar>
						<MaterialUI.IconButton
							edge="start"
							color="inherit"
							onClick={this.close}
							aria-label="close"
						>
							{helpers.createIcon("\ue5c4")}
						</MaterialUI.IconButton>
						<MaterialUI.Typography
							variant="h6"
							style={{ paddingLeft: "16px" }}
						>
							Settings
						</MaterialUI.Typography>
					</MaterialUI.Toolbar>
				</MaterialUI.AppBar>

				{this.state.userConfig ? (
					<React.Fragment>
						<div>
							<div
								style={{
									margin: "56px auto",
									padding: "0px 16px",
									display: "flex",
									flexDirection: "column",
									maxWidth: "940px"
								}}
							>
								<MaterialUI.Typography
									variant="subtitle2"
									style={{
										color: "rgba(40, 26, 26, 0.56)",
										padding: "16px 0px"
									}}
								>
									Notifications
								</MaterialUI.Typography>
								<div width="100%">
									<MaterialUI.FormControlLabel
										style={{
											width: "100%",
											maxWidth: "920px",
											paddingLeft: "0px"
										}}
										classes={{
											root: helpers.scopedClass(
												"padding-left:0px"
											)
										}}
										control={
											<MaterialUI.Switch
												checked={
													Globals.messaging
														.tokenEnabled
												}
												disabled={
													Globals.messaging
														.hasPermission ==
													"false"
												}
												onChange={ev => {
													const wantedState =
														ev.target.checked;
													helpers.incProgress();
													Globals.messaging
														.start()
														.then(js => {
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
																_ => {
																	if (
																		Globals
																			.messaging
																			.tokenOnServer
																	) {
																		if (
																			Globals
																				.messaging
																				.tokenEnabled !=
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
																				js => {
																					helpers.decProgress();
																					this.setState(
																						{
																							config: js
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
											Globals.messaging.hasPermission ==
												"true" ||
											(window.Wrapper &&
												window.Wrapper.startFCM) ? (
												Globals.messaging
													.tokenOnServer ? (
													Globals.messaging
														.tokenEnabled ? (
														""
													) : (
														""
													)
												) : (
													<p
														style={{
															marginTop: "2px"
														}}
													>
														<MaterialUI.Typography variant="caption">
															Notifications
															disabled [Error: no
															token uploaded]
														</MaterialUI.Typography>
													</p>
												)
											) : (
												<p style={{ marginTop: "2px" }}>
													<MaterialUI.Typography variant="caption">
														No notification
														permission received.
														<br />
														<a
															href="https://www.google.com/search?q=reset+browser+permission+notifications&rlz=1C5CHFA_enNL775NL775&oq=reset+browser+permission+notifications&aqs=chrome..69i57j69i60l2.3519j1j4&sourceid=chrome&ie=UTF-8"
															target="_blank"
														>
															Allow this sites
															notifications in
															your browser
															settings.
														</a>
													</MaterialUI.Typography>
												</p>
											)
										) : (
											<p style={{ marginTop: "2px" }}>
												<MaterialUI.Typography variant="caption">
													Notifications disabled
													[Error: notification system
													did not start]
												</MaterialUI.Typography>
											</p>
										)
									) : (
										<p style={{ marginTop: "2px" }}>
											<MaterialUI.Typography variant="caption">
												Notifications disabled [Error:
												Firebase Messaging not supported
												on your browser]
											</MaterialUI.Typography>
										</p>
									)}
								</div>

								<MaterialUI.FormControlLabel
									control={
										<MaterialUI.Switch
											checked={
												!!this.state.userConfig
													.Properties.MailConfig
													.Enabled
											}
											onChange={ev => {
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
								<MaterialUI.TextField
									inputProps={{ min: 0 }}
									fullWidth
									style={{
										marginTop: "1px",
										maxWidth: "180px"
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
								<MaterialUI.Typography
									variant="subtitle2"
									style={{
										color: "rgba(40, 26, 26, 0.56)",
										marginTop: "16px",
										padding: "16px 0px"
									}}
								>
									Custom nation colours
								</MaterialUI.Typography>

								<div
									className={helpers.scopedClass(
										"display: flex; flex-direction: column"
									)}
								>
									<MaterialUI.FormControl
										style={{ marginBottom: "8px" }}
									>
										<MaterialUI.InputLabel
											shrink
											id="variantinputlabel"
										>
											Variant
										</MaterialUI.InputLabel>
										<MaterialUI.Select
											fullWidth
											labelId="variantinputlabel"
											value={
												this.state
													.newColorOverrideVariant
											}
											onChange={ev => {
												const variant = Globals.variants.find(
													v => {
														return (
															v.Properties.Name ==
															ev.target.value
														);
													}
												);
												let nation = this.state
													.newColorOverrideNation;
												if (
													variant.Properties.Nations.indexOf(
														nation
													) == -1
												) {
													nation =
														variant.Properties
															.Nations[0];
												}
												this.setState({
													newColorOverrideNation: nation,
													newColorOverrideVariant:
														ev.target.value
												});
											}}
										>
											{Globals.variants.map(variant => {
												return (
													<MaterialUI.MenuItem
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
													</MaterialUI.MenuItem>
												);
											})}
										</MaterialUI.Select>
									</MaterialUI.FormControl>

									<div
										style={{
											display: "flex",
											flexDirection: "column"
										}}
									>
										{Globals.variants
											.find(v => {
												return (
													v.Properties.Name ==
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
																	"center"
															}}
															key={nation}
															value={nation}
														>
															<MaterialUI.Typography>
																{nation}
															</MaterialUI.Typography>

															<div
																style={{
																	marginLeft:
																		"auto",
																	display:
																		"flex",
																	alignItems:
																		"center"
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
																		] !=
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
															] !=
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
																			"#281A1A"
																	}}
																>
																	{helpers.createIcon(
																		"\ue872"
																	)}
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
						<MaterialUI.Button
							style={{ color: "red" }}
							variant="outlined"
							onClick={_ => {
								if (
									document.getElementById("sure-about-reset")
										.checked
								) {
									this.setState(
										(state, props) => {
											state = Object.assign({}, state);
											state.userConfig.Properties.Colors = [];
											state.userConfig.Properties.FCMTokens = [];
											state.userConfig.Properties.MailConfig = {};
											state.userConfig.Properties.PhaseDeadlineWarningMinutesAhead = 0;
											return state;
										},
										_ => {
											this.saveConfig().then(_ => {
												location.reload();
											});
										}
									);
								}
							}}
						>
							Reset settings to default
							<MaterialUI.FormControlLabel
								style={{ marginRight: 0 }}
								classes={{
									label: helpers.scopedClass(
										"font-size: unset;"
									)
								}}
								control={
									<MaterialUI.Checkbox
										onClick={ev => {
											ev.stopPropagation();
										}}
										style={{ padding: "0 0 0 18" }}
										id="sure-about-reset"
									/>
								}
								label="Yes I'm sure"
							/>
						</MaterialUI.Button>
					</React.Fragment>
				) : (
					""
				)}
			</MaterialUI.Dialog>
		);
	}
}
