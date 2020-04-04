export default class CreateChannelDialog extends React.Component {
	constructor(props) {
		super(props);
		this.state = { open: false };
		if (this.props.parentCB) {
			this.props.parentCB(this);
		}
		this.close = this.close.bind(this);
	}
	close() {
		return new Promise((res, rej) => {
			this.setState({ open: false }, res);
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
					Create channel
				</MaterialUI.DialogTitle>
				<MaterialUI.DialogContent>
					<MaterialUI.DialogContentText>
						Pick the participants of the new channel.
					</MaterialUI.DialogContentText>
					<MaterialUI.DialogActions>
						<MaterialUI.Button onClick={this.close} color="primary">
							Cancel
						</MaterialUI.Button>
						<MaterialUI.Button color="primary">
							Create
						</MaterialUI.Button>
					</MaterialUI.DialogActions>
				</MaterialUI.DialogContent>
			</MaterialUI.Dialog>
		);
	}
}
