import * as helpers from '%{ cb "/js/helpers.js" }%';

export default class CreateGameDialog extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false,
			tooltips: {},
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
		this.userStats = {
			Properties: {
				Glicko: {}
			}
		};
		if (this.props.parentCB) {
			this.props.parentCB(this);
		}
	}
	componentDidMount() {
		helpers.incProgress();
		helpers
			.safeFetch(
				helpers.createRequest("/User/" + Globals.user.Id + "/Stats")
			)
			.then(resp => resp.json())
			.then(js => {
				helpers.decProgress();
				this.userStats = js;
				this.setState((state, props) => {
					state = Object.assign({}, state);
					state.newGameProperties.MinReliability = Math.min(
						10,
						Math.floor(this.userStats.Properties.Reliability)
					);
					return state;
				});
			});
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
					if (propertyName == "Private") {
						state.newGameProperties["MinReliability"] = ev.target
							.checked
							? 0
							: Math.min(
									10,
									Math.floor(
										this.userStats.Properties.Reliability
									)
							  );
					}
					state.newGameProperties[propertyName] = opts.invert
						? !ev.target.checked
						: ev.target.checked;
				} else {
					let newValue = ev.target.value;
					if (opts.float && newValue != "") {
						newValue = Number.parseFloat(ev.target.value);
						if (opts.max && opts.max <= newValue) {
							state.tooltips[propertyName] =
								"Must be lower than or equal to " + opts.max;
							newValue = opts.max;
						}
						if (opts.min && opts.min >= newValue) {
							state.tooltips[propertyName] =
								"Must be 0, or greater than or equal to " +
								opts.min;
						}
					}
					state.newGameProperties[propertyName] = newValue;
				}
				return state;
			});
		};
	}
	floatField(name, opts = {}) {
		opts.float = true;
		return (
			<MaterialUI.Tooltip
				open={!!this.state.tooltips[name]}
				onClose={_ => {
					this.setState((state, props) => {
						state = Object.assign({}, state);
						delete state.tooltips[name];
						return state;
					});
				}}
				title={this.state.tooltips[name] || ""}
			>
				<MaterialUI.TextField
					fullWidth
					label={opts.label || name}
					margin="dense"
					max={opts.max}
					min={opts.min}
					value={this.state.newGameProperties[name]}
					onChange={this.newGamePropertyUpdater(name, opts)}
				/>
			</MaterialUI.Tooltip>
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
						label: "Minimum reliability, high = active players",
						max: Math.floor(this.userStats.Properties.Reliability)
					})}
					{this.floatField("MinQuickness", {
						label: "Minimum quickness, high = fast games",
						max: Math.floor(this.userStats.Properties.Quickness)
					})}
					{this.floatField("MinRating", {
						label: "Minimum rating, high = strong players",
						max: Math.floor(this.userStats.Properties.Glicko.Rating)
					})}
					{this.floatField("MaxRating", {
						label: "Maximum rating, low = weak players",
						min: Math.ceil(this.userStats.Properties.Glicko.Rating)
					})}
					{this.floatField("MaxHated", {
						label: "Maximum hated, low = unbanned players",
						min: Math.ceil(this.userStats.Properties.Hated)
					})}
					{this.floatField("MaxHater", {
						label: "Maximum hater, low = patient players",
						min: Math.ceil(this.userStats.Properties.Hater)
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
