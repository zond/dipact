import React from "react";
import * as helpers from "../helpers";

import {
	Dialog,
	Button,
	TextField,
	Typography,
	DialogContent,
	DialogActions,
	DialogTitle,
} from "@material-ui/core";

export default class ConfirmDialog extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false,
		};
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
			<Dialog
				open={this.state.open}
				onEntered={helpers.genOnback(this.close)}
				disableBackdropClick={false}
				onClose={this.close}
			>
				<DialogTitle>Are you sure?</DialogTitle>
				<DialogContent>
					<Typography variant="body2" style={{marginBottom: "16px"}}>
						To pause, set a long deadline and change it back to resume.
					</Typography>
				</DialogContent>
				<DialogActions>
					<Button onClick={this.close} color="primary">
						Cancel
					</Button>
					<Button onClick={} color="primary">
						Sure
					</Button>
				</DialogActions>
			</Dialog>
		);
	}
}
