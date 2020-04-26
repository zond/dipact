import * as helpers from '%{ cb "/js/helpers.js" }%';

export default class FindGameDialog extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false,
			onClick: _ => {
				console.log("Uninitialized OrderDialog used?!");
			}
		};
		if (this.props.parentCB) {
			this.props.parentCB(this);
		}
		this.onClick = this.onClick.bind(this);
		this.close = this.close.bind(this);
	}
	componentDidMount() {
		Globals.backListeners.unshift(this.close);
	}
	componentWillUnmount() {
		Globals.backListeners = Globals.backListeners.filter(l => {
			return l != this.close;
		});
	}
	close() {
		this.setState({ open: false });
	}
	onClick() {
		this.setState({ open: false });
		this.state.onClick(
			document.getElementById("find-game-by-id-input-field").value
		);
	}
	render() {
		return (
			<MaterialUI.Dialog
				open={this.state.open}
				className="find-game-dialog"
				disableBackdropClick={false}
				onClose={this.close}
			>
				<MaterialUI.DialogTitle>
					Find (private) game
				</MaterialUI.DialogTitle>
				<MaterialUI.DialogContent>
					<MaterialUI.DialogContentText>
						Enter any game ID to view it. You can find the Game ID
						at [TODO: description wheretofind].
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
							onClick={this.onClick}
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
