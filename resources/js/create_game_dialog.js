import * as helpers from '%{ cb "/js/helpers.js" }%';

export default class CreateGameDialog extends React.Component {
	constructor(props) {
		super(props);
		this.state = { open: false, newGameProperties: {} };
		this.close = this.close.bind(this);
		this.createGame = this.createGame.bind(this);
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
			this.setState((state, props) => {
				state = Object.assign({}, state);
				state.newGameProperties[propertyName] = ev.target.value;
				return state;
			});
		};
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
						id="create-game-name-input-field"
						label="Name"
						autoFocus
						margin="dense"
						fullWidth
					/>
					<MaterialUI.Box
						display="flex"
						justifyContent="space-between"
						key="Variant"
					>
						<MaterialUI.Select
							id="create-game-name-input-field"
							value="Classical"
							onChange={this.newGamePropertyUpdater("Variant")}
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
