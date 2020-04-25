import * as helpers from '%{ cb "/js/helpers.js" }%';

export default class Snackbar extends React.Component {
	constructor(props) {
		super(props);
		this.state = { message: null };
		Globals.snackbar = this;
	}
	render() {
		return (
			<MaterialUI.Snackbar
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "center"
				}}
				open={!!this.state.message}
				autoHideDuration={Math.max(
					6000,
					60 * (this.state.message || "").length
				)}
				onClose={_ => {
					this.setState({ message: null });
				}}
				message={this.state.message}
				action={
					<MaterialUI.IconButton
						size="small"
						aria-label="close"
						color="inherit"
						onClick={_ => {
							this.setState({ message: null });
						}}
					>
						{helpers.createIcon("\ue5cd")}
					</MaterialUI.IconButton>
				}
			/>
		);
	}
}
