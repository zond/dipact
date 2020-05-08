import * as helpers from '%{ cb "/js/helpers.js" }%';

import Color from '%{ cb "/js/color.js" }%';

export default class SettingsDialog extends React.Component {
	constructor(props) {
		super(props);
		this.allNations = Object.keys(
			Globals.variants.reduce((sum, el) => {
				el.Properties.Nations.forEach(nation => {
					sum[nation] = true;
				});
				return sum;
			}, {})
		).sort();
		this.state = {
			open: false,
			userConfig: Globals.userConfig,
			newColorOverrideType: "position",
			newColorOverrideColor: "#ffffff",
			newColorOverrideNation: this.allNations[0],
			newColorOverrideVariant: "Classical",
			newColorOverridePosition: 0
		};
		if (this.props.parentCB) {
			this.props.parentCB(this);
		}
		this.close = this.close.bind(this);
		this.updatePhaseDeadline = this.updatePhaseDeadline.bind(this);
		this.newColorSetter = this.newColorSetter.bind(this);
		this.newColorDeleter = this.newColorDeleter.bind(this);
		this.addColorOverride = this.addColorOverride.bind(this);
		this.saveConfig = this.saveConfig.bind(this);
	}
	addColorOverride() {
		if (this.state.newColorOverrideType == "position") {
			Globals.colorOverrides.positions[
				this.state.newColorOverridePosition
			] = this.state.newColorOverrideColor;
		} else if (this.state.newColorOverrideType == "nation") {
			Globals.colorOverrides.nations[
				this.state.newColorOverrideNation.replace(
					helpers.overrideReg,
					""
				)
			] = this.state.newColorOverrideColor;
		} else {
			const variantCode = this.state.newColorOverrideVariant.replace(
				helpers.overrideReg,
				""
			);
			if (!Globals.colorOverrides.variants[variantCode]) {
				Globals.colorOverrides.variants[variantCode] = {};
			}
			Globals.colorOverrides.variants[variantCode][
				this.state.newColorOverrideNation.replace(
					helpers.overrideReg,
					""
				)
			] = this.state.newColorOverrideColor;
		}
		this.setState((state, props) => {
			state = Object.assign({}, state);
			state.userConfig.Properties.Colors =
				Globals.colorOverrides.positions;
			Object.keys(Globals.colorOverrides.nations || {}).forEach(
				nationCode => {
					state.userConfig.Properties.Colors.push(
						nationCode +
							"/" +
							Globals.colorOverrides.nations[nationCode]
					);
				}
			);
			Object.keys(Globals.colorOverrides.variants || {}).forEach(
				variantCode => {
					Object.keys(
						Globals.colorOverrides.variants[variantCode] || {}
					).forEach(nationCode => {
						state.userConfig.Properties.Colors.push(
							variantCode +
								"/" +
								nationCode +
								"/" +
								Globals.colorOverrides.variants[variantCode][
									nationCode
								]
						);
					});
				}
			);
			return state;
		}, this.saveConfig);
	}
	newColorSetter(idx, prefix) {
		return col => {
			this.setState((state, props) => {
				state = Object.assign({}, state);
				state.userConfig.Properties.Colors[idx] = prefix + col;
				return state;
			}, this.saveConfig);
		};
	}
	newColorDeleter(idxToDelete) {
		return _ => {
			this.setState((state, props) => {
				state = Object.assign({}, state);
				state.userConfig.Properties.Colors = state.userConfig.Properties.Colors.filter(
					(c, idx) => {
						return idx != idxToDelete;
					}
				);
				return state;
			}, this.saveConfig);
		};
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
		helpers
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
				disableBackdropClick={false}
				classes={{
					paper: helpers.scopedClass("margin: 2px; width: 100%;")
				}}
				onClose={this.close}
			>
				<MaterialUI.DialogTitle>Settings</MaterialUI.DialogTitle>
				<MaterialUI.DialogContent>
					{this.state.userConfig ? (
						<React.Fragment>
							<h3>Notifications</h3>
							<div width="100%">
								<MaterialUI.FormControlLabel
									control={
										<MaterialUI.Switch
											checked={
												Globals.messaging.tokenEnabled
											}
											disabled={
												Globals.messaging
													.hasPermission == "false"
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
															.state.userConfig;
														if (js) {
															currentConfig = js;
														}
														this.setState(
															(state, props) => {
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
								(window.Wrapper && window.Wrapper.startFCM) ? (
									Globals.messaging.started ? (
										Globals.messaging.hasPermission ||
										(window.Wrapper &&
											window.Wrapper.startFCM) ? (
											Globals.messaging.tokenOnServer ? (
												Globals.messaging
													.tokenEnabled ? (
													""
												) : (
													""
												)
											) : (
												<p style={{ marginTop: "2px" }}>
													<MaterialUI.Typography variant="caption">
														Notifications disabled
														[Error: no token
														uploaded]
													</MaterialUI.Typography>
												</p>
											)
										) : (
											<p style={{ marginTop: "2px" }}>
												<MaterialUI.Typography variant="caption">
													No notification permission
													received.
													<br />
													<a
														href="https://www.google.com/search?q=reset+browser+permission+notifications&rlz=1C5CHFA_enNL775NL775&oq=reset+browser+permission+notifications&aqs=chrome..69i57j69i60l2.3519j1j4&sourceid=chrome&ie=UTF-8"
														target="_blank"
													>
														Allow this sites
														notifications in your
														browser settings.
													</a>
												</MaterialUI.Typography>
											</p>
										)
									) : (
										<p style={{ marginTop: "2px" }}>
											<MaterialUI.Typography variant="caption">
												Notifications disabled [Error:
												notification system did not
												start]
											</MaterialUI.Typography>
										</p>
									)
								) : (
									<p style={{ marginTop: "2px" }}>
										<MaterialUI.Typography variant="caption">
											Notifications disabled [Error:
											Firebase Messaging not supported on
											your browser]
										</MaterialUI.Typography>
									</p>
								)}
							</div>

							<MaterialUI.FormControlLabel
								control={
									<MaterialUI.Switch
										checked={
											this.state.userConfig.Properties
												.MailConfig.Enabled
										}
										onChange={ev => {
											ev.persist();
											this.setState((state, props) => {
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
													"{{message.Body}}\n\nVisit {{unsubscribeURL}} to stop receiving email like this.\n\nVisit " +
													hrefURL.protocol +
													"//" +
													hrefURL.host +
													"/Game/{{game.ID.Encode}}  to see the latest phase in this game.";
												state.userConfig.Properties.MailConfig.PhaseConfig.TextBodyTemplate =
													"{{game.Desc}} has a new phase: " +
													hrefURL.protocol +
													"//" +
													hrefURL.host +
													"/Game/{{game.ID.Encode}}.\n\nVisit %s to stop receiving email like this.";
												return state;
											}, this.saveConfig);
										}}
									/>
								}
								label="Email notifications"
							/>
							<MaterialUI.TextField
								inputProps={{ min: 0 }}
								fullWidth
								disabled={
									!this.state.userConfig.Properties.MailConfig
										.Enabled &&
									!Globals.messaging.tokenEnabled
								}
								type="number"
								label="Phase deadline reminder"
								helperText={
									this.state.userConfig.Properties.MailConfig
										.Enabled ||
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
							<h3>Colors</h3>
							<MaterialUI.List>
								{(_ => {
									let overridePos = 0;
									return (
										this.state.userConfig.Properties
											.Colors || []
									).map((color, idx) => {
										if (color == "") {
											return "";
										}
										const parts = color.split("/");
										if (parts.length == 1) {
											return (
												<MaterialUI.ListItem
													button
													key={
														"override_" +
														overridePos +
														"_" +
														color
													}
												>
													<div
														className={helpers.scopedClass(
															"flex: 1 1 auto;"
														)}
													>
														Override{" "}
														<span
															style={{
																backgroundColor:
																	Globals
																		.contrastColors[
																		overridePos
																	]
															}}
														>
															position
															{" " +
																overridePos++}
														</span>
													</div>
													<Color
														value={color}
														onSelect={this.newColorSetter(
															idx,
															""
														)}
													/>
													<MaterialUI.ListItemSecondaryAction>
														<MaterialUI.IconButton
															edge="end"
															onClick={this.newColorDeleter(
																idx
															)}
														>
															{helpers.createIcon(
																"\ue92b"
															)}
														</MaterialUI.IconButton>
													</MaterialUI.ListItemSecondaryAction>
												</MaterialUI.ListItem>
											);
										} else if (parts.length == 2) {
											return (
												<MaterialUI.ListItem
													button
													key={
														"nation_" +
														parts[0] +
														"_" +
														parts[1]
													}
												>
													<MaterialUI.ListItemText
														primary={
															"Override " +
															Globals
																.colorOverrides
																.nationCodes[
																parts[0]
															]
														}
													/>
													<Color
														value={parts[1]}
														onSelect={this.newColorSetter(
															idx,
															parts[0] + "/"
														)}
													/>
													<MaterialUI.ListItemSecondaryAction>
														<MaterialUI.IconButton
															edge="end"
															onClick={this.newColorDeleter(
																idx
															)}
														>
															{helpers.createIcon(
																"\ue92b"
															)}
														</MaterialUI.IconButton>
													</MaterialUI.ListItemSecondaryAction>
												</MaterialUI.ListItem>
											);
										} else if (parts.length == 3) {
											return (
												<MaterialUI.ListItem
													button
													key={
														"variant_" +
														parts[0] +
														"_nation_" +
														parts[1] +
														"_" +
														parts[2]
													}
												>
													<MaterialUI.ListItemText
														primary={
															"Override " +
															Globals
																.colorOverrides
																.nationCodes[
																parts[1]
															] +
															" in " +
															Globals
																.colorOverrides
																.variantCodes[
																parts[0]
															]
														}
													/>
													<Color
														value={parts[2]}
														onSelect={this.newColorSetter(
															idx,
															parts[0] +
																"/" +
																parts[1] +
																"/"
														)}
													/>
													<MaterialUI.ListItemSecondaryAction>
														<MaterialUI.IconButton
															edge="end"
															onClick={this.newColorDeleter(
																idx
															)}
														>
															{helpers.createIcon(
																"\ue92b"
															)}
														</MaterialUI.IconButton>
													</MaterialUI.ListItemSecondaryAction>
												</MaterialUI.ListItem>
											);
										}
									});
								})()}
							</MaterialUI.List>
							<div
								className={helpers.scopedClass(
									"display: flex;"
								)}
							>
								<MaterialUI.Select
									value={this.state.newColorOverrideType}
									className={helpers.scopedClass(
										"flex-grow: 0;"
									)}
									onChange={ev => {
										const variant = Globals.variants.find(
											v => {
												return (
													v.Properties.Name ==
													this.state
														.newColorOverrideVariant
												);
											}
										);
										let nation = this.state
											.newColorOverrideNation;
										if (
											ev.target.value == "variant" &&
											variant.Properties.Nations.indexOf(
												nation
											) == -1
										) {
											nation =
												variant.Properties.Nations[0];
										}
										this.setState({
											newColorOverrideType:
												ev.target.value,
											newColorOverrideNation: nation
										});
									}}
								>
									<MaterialUI.MenuItem value="position">
										Position
									</MaterialUI.MenuItem>
									<MaterialUI.MenuItem value="nation">
										Nation
									</MaterialUI.MenuItem>
									<MaterialUI.MenuItem value="variant">
										Nation in variant
									</MaterialUI.MenuItem>
								</MaterialUI.Select>
								{this.state.newColorOverrideType ==
								"position" ? (
									<React.Fragment>
										<MaterialUI.FormControl
											className={helpers.scopedClass(
												"flex-grow: 1;"
											)}
										>
											<MaterialUI.InputLabel>
												Color position to override
											</MaterialUI.InputLabel>
											<MaterialUI.Input
												type="number"
												inputProps={{
													min: 0,
													max:
														Globals.colorOverrides
															.positions.length
												}}
												style={{
													backgroundColor:
														Globals.contrastColors[
															this.state
																.newColorOverridePosition
														]
												}}
												value={
													this.state
														.newColorOverridePosition
												}
												onChange={ev => {
													let newValue =
														ev.target.value;
													if (newValue != "") {
														newValue = Number.parseInt(
															newValue
														);
													}
													this.setState({
														newColorOverridePosition: newValue
													});
												}}
											/>
										</MaterialUI.FormControl>
									</React.Fragment>
								) : (
									<React.Fragment>
										<MaterialUI.Select
											value={
												this.state
													.newColorOverrideNation
											}
											className={helpers.scopedClass(
												"flex-grow: 1;"
											)}
											onChange={ev => {
												this.setState({
													newColorOverrideNation:
														ev.target.value
												});
											}}
										>
											{(this.state.newColorOverrideType ==
											"nation"
												? this.allNations
												: Globals.variants.find(v => {
														return (
															v.Properties.Name ==
															this.state
																.newColorOverrideVariant
														);
												  }).Properties.Nations
											).map(nation => {
												return (
													<MaterialUI.MenuItem
														key={nation}
														value={nation}
													>
														{nation}
													</MaterialUI.MenuItem>
												);
											})}
										</MaterialUI.Select>
									</React.Fragment>
								)}
								<Color
									className={helpers.scopedClass(
										"flex-grow: 0;"
									)}
									value={this.state.newColorOverrideColor}
									onSelect={col => {
										this.setState({
											newColorOverrideColor: col
										});
									}}
								/>
							</div>
							{this.state.newColorOverrideType == "variant" ? (
								<MaterialUI.Select
									fullWidth
									value={this.state.newColorOverrideVariant}
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
												variant.Properties.Nations[0];
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
												key={variant.Properties.Name}
												value={variant.Properties.Name}
											>
												{variant.Properties.Name}
											</MaterialUI.MenuItem>
										);
									})}
								</MaterialUI.Select>
							) : (
								""
							)}
							<MaterialUI.Button
								onClick={this.addColorOverride}
								color="primary"
							>
								Add color override
							</MaterialUI.Button>
						</React.Fragment>
					) : (
						""
					)}
					<MaterialUI.DialogActions>
						<MaterialUI.Button onClick={this.close} color="primary">
							Close
						</MaterialUI.Button>
					</MaterialUI.DialogActions>
				</MaterialUI.DialogContent>
			</MaterialUI.Dialog>
		);
	}
}
