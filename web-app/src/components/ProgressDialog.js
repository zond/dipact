import React from 'react';
import { CircularProgress, Dialog } from "@material-ui/core";
import Globals from '../Globals';

export default class ProgressDialog extends React.Component {
	constructor(props) {
		super(props);
		this.state = { open: false };
		Globals.progressDialog = this;

	}
	render() {
		return (
			<Dialog open={this.state.open}>
				<CircularProgress style={{ margin: "20px", }} />
			</Dialog>
		);
	}
}

