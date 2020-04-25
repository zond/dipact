import * as helpers from '%{ cb "/js/helpers.js" }%';

export default class SettingsDialog extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false,
			userConfig: Globals.userConfig
		};
		if (this.props.parentCB) {
			this.props.parentCB(this);
		}
		this.close = this.close.bind(this);
		this.updatePhaseDeadline = this.updatePhaseDeadline.bind(this);
		this.saveConfig = this.saveConfig.bind(this);
	}
	close() {
		this.setState({ open: false });
	}
	componentDidUpdate(prevProps, prevState, snapshot) {
		if (
			JSON.stringify(Globals.userConfig) !=
			JSON.stringify(this.state.userConfig)
		) {
			this.setState({ userConfig: Globals.userConfig });
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
				open={this.state.open}
				disableBackdropClick={false}
				classes={{
					paper: helpers.scopedClass("margin: 2px; width: 100%;")
				}}
				onClose={this.close}
			>
				<MaterialUI.DialogTitle>Notifications</MaterialUI.DialogTitle>
				<MaterialUI.DialogContent>
					{this.state.userConfig ? (
						<React.Fragment>
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
																		Globals.messaging
																			.refreshToken()
																			.then(
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
								{firebase.messaging.isSupported() ? (
									Globals.messaging.started ? (
										Globals.messaging.hasPermission ? (
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

							<MaterialUI.TextField
								fullWidth
								disabled={
									Globals.messaging.tokenEnabled
										? false
										: true
								}
								label="Phase deadline reminder"
								helperText={
									Globals.messaging.tokenEnabled
										? "In minutes. 0 = off"
										: "Turn on push notifications to receive alarms"
								}
								margin="dense"
								value={
									this.state.userConfig.Properties
										.PhaseDeadlineWarningMinutesAhead
								}
								onChange={this.updatePhaseDeadline}
								onBlur={this.saveConfig}
							/>
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
													window.location.href
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
