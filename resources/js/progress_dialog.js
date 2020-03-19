
export default class ProgressDialog extends React.Component {
	constructor(props) {
		super(props);
		this.state = { open: false };
		Globals.progress_dialog = this;
	}
	render() {
		return (
			<MaterialUI.Dialog open={this.state.open}>
				<MaterialUI.CircularProgress style={{ padding: "20px" }} />
			</MaterialUI.Dialog>
		);
	}
}
