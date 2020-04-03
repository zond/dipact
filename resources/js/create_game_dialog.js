import * as helpers from '%{ cb "/js/helpers.js" }%';

export default class CreateGameDialog extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false,
			newGameProperties: {
				Variant: "Classical",
				NationAllocation: 0,
				PhaseLengthMinutes: 1440,
				Desc: Globals.user.GivenName + "'s game",
				Private: false,
				Anonymous: false,
				MinReliability: 0,
				MinQuickness: 0,
				MinRating: 0,
				MaxRating: 0,
				MaxHated: 0,
				MaxHater: 0,
				DisableConferenceChat: false,
				DisableGroupChat: false,
				DisablePrivateChat: false
			},
			phaseLengthUnit: 60 * 24,
			phaseLengthMultiplier: 1
		};
		this.close = this.close.bind(this);
		this.createGame = this.createGame.bind(this);
		this.setPhaseLength = this.setPhaseLength.bind(this);
		this.newGamePropertyUpdater = this.newGamePropertyUpdater.bind(this);
		this.checkboxField = this.checkboxField.bind(this);
		this.floatField = this.floatField.bind(this);
		if (this.props.parentCB) {
			this.props.parentCB(this);
		}
	}
	close() {
		return new Promise((res, rej) => {
			this.setState({ open: false }, res);
		});
	}
	createGame() {
		helpers.incProgress();
		helpers
			.safeFetch(
				helpers.createRequest("/Game", {
					method: "POST",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify(this.state.newGameProperties)
				})
			)
			.then(resp => {
				helpers.decProgress();
				this.close().then(this.props.gameCreated);
			});
	}
	newGamePropertyUpdater(propertyName, opts = {}) {
		return ev => {
			ev.persist();
			this.setState((state, props) => {
				state = Object.assign({}, state);
				if (ev.target.type == "checkbox") {
					state.newGameProperties[propertyName] = opts.invert
						? !ev.target.checked
						: ev.target.checked;
				} else {
					state.newGameProperties[propertyName] = opts.float
						? Number.parseFloat(ev.target.value)
						: ev.target.value;
				}
				console.log(state.newGameProperties);
				return state;
			});
		};
	}
	floatField(name, opts = {}) {
		return (
			<MaterialUI.TextField
				fullWidth
				label={opts.label || name}
				margin="dense"
				value={this.state.newGameProperties[name]}
				onChange={this.newGamePropertyUpdater(name, {
					float: true
				})}
			/>
		);
	}
	setPhaseLength(ev) {
		ev.persist();
		this.setState((state, props) => {
			state = Object.assign({}, state);
			if (ev.target.name == "phase-length-unit") {
				state.phaseLengthUnit = ev.target.value;
			} else if (ev.target.name == "phase-length-multiplier") {
				state.phaseLengthMultiplier = ev.target.value;
			}
			state.newGameProperties["PhaseLengthMinutes"] =
				state.phaseLengthUnit * state.phaseLengthMultiplier;
			console.log(state.newGameProperties);
			return state;
		});
	}
	checkboxField(name, opts = {}) {
		return (
			<MaterialUI.FormControlLabel
				control={
					<MaterialUI.Checkbox
						checked={
							opts.invert
								? !this.state.newGameProperties[name]
								: this.state.newGameProperties[name]
						}
						onChange={this.newGamePropertyUpdater(name, opts)}
					/>
				}
				label={opts.label || name}
			/>
		);
	}
	render() {
		return (
			<MaterialUI.Dialog
				open={this.state.open}
				disableBackdropClick={false}
				onClose={this.close}
			>
				<MaterialUI.DialogTitle id="form-dialog-title">
					Create game
				</MaterialUI.DialogTitle>
				<MaterialUI.DialogContent>
					<MaterialUI.DialogContentText>
						Edit the properties for your new game.
					</MaterialUI.DialogContentText>
					<MaterialUI.TextField
						key="Desc"
						label="Name"
						margin="dense"
						fullWidth
						value={this.state.newGameProperties["Desc"]}
						onChange={this.newGamePropertyUpdater("Desc")}
					/>
					<MaterialUI.Select
						key="Variant"
						fullWidth
						value={this.state.newGameProperties["Variant"]}
						onChange={this.newGamePropertyUpdater("Variant")}
					>
						{Globals.variants.map(variant => {
							return (
								<MaterialUI.MenuItem
									key={variant.Properties.Name}
									value={variant.Properties.Name}
								>
									{variant.Properties.Name},{" "}
									{variant.Properties.Nations.length} players
								</MaterialUI.MenuItem>
							);
						})}
					</MaterialUI.Select>
					<MaterialUI.Select
						key="NationAllocation"
						fullWidth
						value={this.state.newGameProperties["NationAllocation"]}
						onChange={this.newGamePropertyUpdater(
							"NationAllocation"
						)}
					>
						<MaterialUI.MenuItem key={0} value={0}>
							Random nation allocation
						</MaterialUI.MenuItem>
						<MaterialUI.MenuItem key={1} value={1}>
							Preference based nation allocation
						</MaterialUI.MenuItem>
					</MaterialUI.Select>
					<MaterialUI.Box
						display="flex"
						justifyContent="space-between"
						key="PhaseLengthMinutes"
					>
						<MaterialUI.TextField
							name="phase-length-multiplier"
							label="Amount"
							margin="dense"
							value={this.state.phaseLengthMultiplier}
							onChange={this.setPhaseLength}
						/>
						<MaterialUI.Select
							name="phase-length-unit"
							value={this.state.phaseLengthUnit}
							onChange={this.setPhaseLength}
						>
							<MaterialUI.MenuItem key={1} value={1}>
								Minutes
							</MaterialUI.MenuItem>
							<MaterialUI.MenuItem key={60} value={60}>
								Hours
							</MaterialUI.MenuItem>
							<MaterialUI.MenuItem key={60 * 24} value={60 * 24}>
								Days
							</MaterialUI.MenuItem>
						</MaterialUI.Select>
					</MaterialUI.Box>
					<MaterialUI.FormGroup>
						{this.checkboxField("Private")}
						{this.checkboxField("DisableConferenceChat", {
							invert: true,
							label: "Conference chat"
						})}
						{this.checkboxField("DisableGroupChat", {
							invert: true,
							label: "Group chat"
						})}
						{this.checkboxField("DisablePrivateChat", {
							invert: true,
							label: "Private chat"
						})}
						<MaterialUI.FormControlLabel
							control={
								<MaterialUI.Checkbox
									disabled={
										!this.state.newGameProperties["Private"]
									}
									checked={
										this.state.newGameProperties["Private"]
											? this.state.newGameProperties[
													"Anonymous"
											  ]
											: this.state.newGameProperties[
													"DisableConferenceChat"
											  ] &&
											  this.state.newGameProperties[
													"DisableGroupChat"
											  ] &&
											  this.state.newGameProperties[
													"DisablePrivateChat"
											  ]
									}
									onChange={this.newGamePropertyUpdater(
										"Anonymous"
									)}
								/>
							}
							label="Anonymous"
						/>
					</MaterialUI.FormGroup>
					{this.floatField("MinReliability", {
						label: "Minimum reliability, high = active players"
					})}
					{this.floatField("MinQuickness", {
						label: "Minimum quickness, high = fast games"
					})}
					{this.floatField("MinRating", {
						label: "Minimum rating, high = strong players"
					})}
					{this.floatField("MaxRating", {
						label: "Maximum rating, low = weak players"
					})}
					{this.floatField("MaxHated", {
						label: "Maximum hated, low = unbanned players"
					})}
					{this.floatField("MaxHater", {
						label: "Maximum hater, low = patient players"
					})}
					<MaterialUI.DialogActions>
						<MaterialUI.Button onClick={this.close} color="primary">
							Cancel
						</MaterialUI.Button>
						<MaterialUI.Button
							onClick={this.createGame}
							color="primary"
						>
							Create
						</MaterialUI.Button>
					</MaterialUI.DialogActions>
				</MaterialUI.DialogContent>
			</MaterialUI.Dialog>
		);
	}
}
