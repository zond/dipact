import * as helpers from '%{ cb "/js/helpers.js" }%';

export default class SettingsDialog extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false,
			config: null
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
	saveConfig() {
		this.state.config.Properties.PhaseDeadlineWarningMinutesAhead = Number.parseInt(
			this.state.config.Properties.PhaseDeadlineWarningMinutesAhead || "0"
		);
		let updateLink = this.state.config.Links.find(l => {
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
					body: JSON.stringify(this.state.config.Properties)
				})
			)
			.then(resp => resp.json())
			.then(js => {
				helpers.decProgress();
				this.setState((state, props) => {
					state = Object.assign({}, state);
					state.config = js;
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
				state.config.Properties.PhaseDeadlineWarningMinutesAhead = newValue;
				if (!state.config.Properties.FCMTokens) {
					state.config.Properties.FCMTokens = [];
				}
				return state;
			},
			_ => {}
		);
	}
	componentDidUpdate(prevProps, prevState, snapshot) {
		if (prevState.open == this.state.open || !this.state.open) {
			return;
		}
		helpers.incProgress();
		helpers
			.safeFetch(
				helpers.createRequest(
					"/User/" + Globals.user.Id + "/UserConfig"
				)
			)
			.then(resp => resp.json())
			.then(js => {
				helpers.decProgress();
				this.setState({ config: js });
			});
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
				<MaterialUI.DialogTitle>Settings</MaterialUI.DialogTitle>
				<MaterialUI.DialogContent>
					{this.state.config ? (
						<React.Fragment>
							<MaterialUI.TextField
								fullWidth
								label="Phase deadline warning minutes before"
								margin="dense"
								value={
									this.state.config.Properties
										.PhaseDeadlineWarningMinutesAhead
								}
								onChange={this.updatePhaseDeadline}
								onBlur={this.saveConfig}
							/>
							<MaterialUI.FormControlLabel
								control={
									<MaterialUI.Checkbox
										checked={(_ => {
											if (!Globals.messaging.started) {
												return false;
											}
											let fcmToken = this.state.config.Properties.FCMTokens.find(
												t => {
													return (
														t.App ==
														"dipact@" +
															Globals.messaging
																.deviceID
													);
												}
											);
											if (!fcmToken) {
												return false;
											}
											if (fcmToken.Disabled) {
												return false;
											}
											return true;
										})()}
										onChange={ev => {
											helpers.incProgress();
											Globals.messaging.start();
											Globals.messaging
												.configure(
													ev.target.checked
														? "true"
														: "false"
												)
												.then(js => {
													helpers.decProgress();
													this.setState({
														config: js
													});
												});
										}}
									/>
								}
								label="Push messages"
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
