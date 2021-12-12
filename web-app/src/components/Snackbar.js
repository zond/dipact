import React from 'react';
import Globals from '../Globals';
import { IconButton, Snackbar as MuiSnackbar } from '@mui/material';
import { CloseIcon } from '../icons';

export default class Snackbar extends React.Component {
	constructor(props) {
		super(props);
		this.state = { message: null, closesToIgnore: 0 };
		Globals.snackbar = this;
	}
	componentDidUpdate(prevProps, prevState, snapshot) {
		if (
			prevState.message &&
			!this.state.message &&
			this.state.closesToIgnore > 0
		) {
			this.setState({
				message: prevState.message,
				closesToIgnore: this.state.closesToIgnore - 1
			});
		}
	}
	render() {
		return (
			<MuiSnackbar
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
				style={{ wordBreak: "break-word" }}
				action={
					<IconButton
						size="small"
						aria-label="close"
						color="inherit"
						onClick={_ => {
							this.setState({ message: null });
						}}
					>
						<CloseIcon />
					</IconButton>
				}
			/>
		);
	}
}

