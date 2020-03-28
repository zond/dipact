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
		this.props.parent.findGameDialog = this;
		this.onClick = this.onClick.bind(this);
		this.close = this.close.bind(this);
	}
	close() {
		this.setState({ open: false });
	}
	onClick() {
		this.setState({ open: false });
		this.state.onClick(
			document.getElementById("find_game_by_id_input_field").value
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
				<MaterialUI.TextField
					id="find_game_by_id_input_field"
					label="Game ID"
				/>
				<MaterialUI.IconButton onClick={this.onClick}>
					{helpers.createIcon("\ue8b6")}
				</MaterialUI.IconButton>
			</MaterialUI.Dialog>
		);
	}
}
