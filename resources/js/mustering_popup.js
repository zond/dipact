import * as helpers from '%{ cb "/js/helpers.js" }%';

export default class MusteringPopup extends React.Component {
	constructor(props) {
		super(props);
		this.state = { open: true };
		this.close = this.close.bind(this);
	}
	close() {
		helpers.unback(this.close);
		this.setState({ open: false });
	}
	render() {
		if (!this.state.open) {
			return "";
		}
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
				<MaterialUI.DialogTitle>Mustering game</MaterialUI.DialogTitle>
				<MaterialUI.DialogContent style={{ paddingBottom: "0px" }}>
					<MaterialUI.Typography>
						This game is currently in the mustering phase. This
						means that all players must confirm that they are ready
						to start, or the game will eject all non-ready players
						from this and all staging games, and revert back to
						being a staging game.
					</MaterialUI.Typography>
					<MaterialUI.DialogActions
						className={helpers.scopedClass(
							"background-color: white; position: sticky; bottom: 0px;"
						)}
					>
						<MaterialUI.Button
							color="primary"
							onClick={_ => {
								this.setState(
									{
										open: false
									},
									this.props.viewOrders
								);
							}}
						>
							View order screen to confirm ready
						</MaterialUI.Button>
						<MaterialUI.Button onClick={this.close} color="primary">
							Close
						</MaterialUI.Button>
					</MaterialUI.DialogActions>
				</MaterialUI.DialogContent>
			</MaterialUI.Dialog>
		);
	}
}
