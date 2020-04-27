import * as helpers from '%{ cb "/js/helpers.js" }%';

export default class FindGameDialog extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false,
			onFind: null
		};
		if (this.props.parentCB) {
			this.props.parentCB(this);
		}
		this.onFind = this.onFind.bind(this);
		this.close = this.close.bind(this);
	}
	close() {
		this.setState({ open: false });
	}
	onFind() {
		const gameID = document.getElementById("find-game-by-id-input-field")
			.value;
		this.setState({ open: false }, _ => {
			this.state.onFind(gameID);
		});
	}
	render() {
		return (
			<MaterialUI.Dialog
				onEntered={helpers.genOnback(this.close)}
				onExited={helpers.genUnback(this.close)}
				open={this.state.open}
				className="find-game-dialog"
				disableBackdropClick={false}
				onClose={this.close}
			>
				<MaterialUI.DialogTitle>Find game</MaterialUI.DialogTitle>
				<MaterialUI.DialogContent>
					<MaterialUI.DialogContentText>
						Enter any game ID to view it. You can find the Game ID
						in the address bar for any opened game.
					</MaterialUI.DialogContentText>
					<MaterialUI.TextField
						id="find-game-by-id-input-field"
						label="Game ID"
						autoFocus
						margin="dense"
						fullWidth
					/>
					<MaterialUI.DialogActions>
						<MaterialUI.Button onClick={this.close} color="primary">
							Cancel
						</MaterialUI.Button>
						<MaterialUI.Button
							onClick={this.onFind}
							color="primary"
						>
							Find
						</MaterialUI.Button>
					</MaterialUI.DialogActions>
				</MaterialUI.DialogContent>
			</MaterialUI.Dialog>
		);
	}
}
