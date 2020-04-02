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
				Desc: ""
			},
			phaseLengthUnit: 60 * 24,
			phaseLengthMultiplier: 1
		};
		this.close = this.close.bind(this);
		this.createGame = this.createGame.bind(this);
		this.setPhaseLength = this.setPhaseLength.bind(this);
		this.newGamePropertyUpdater = this.newGamePropertyUpdater.bind(this);
		this.props.parent.createGameDialog = this;
	}
	close() {
		this.setState({ open: false });
	}
	createGame() {
		console.log("create game", this.state.newGameProperties);
	}
	newGamePropertyUpdater(propertyName) {
		return ev => {
			ev.persist();
			this.setState((state, props) => {
				state = Object.assign({}, state);
				state.newGameProperties[propertyName] = ev.target.value;
				console.log(state.newGameProperties);
				return state;
			});
		};
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
						autoFocus
						margin="dense"
						fullWidth
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
