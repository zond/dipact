/* eslint-disable no-restricted-globals */
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

export default class RescheduleDialog extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false,
			minutes: "60",
		};
		if (this.props.parentCB) {
			this.props.parentCB(this);
		}
		this.onSubmit = this.onSubmit.bind(this);
		this.close = this.close.bind(this);
	}
	onSubmit() {
		this.props.onSubmit(this.state.minutes);
		this.setState({ open: false });
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
				<DialogTitle>Change Next Deadline</DialogTitle>
				<DialogContent>
					<Typography variant="body2">
						New length will be the remainder <strong>of the current phase</strong>.
					</Typography>
					<Typography variant="body2" style={{marginBottom: "16px"}}>
						<i>To pause, set a long deadline and adjust it later to resume.</i>
					</Typography>
					<TextField
						name="next-phase-deadline-in-minutes"
						label="New phase length (minutes)"
						style={{ minWidth: "190px" }}
						type="number"
						inputProps={{ min: 0, max: 60 * 24 * 30 }}
						value={this.state.minutes}
						onChange={(ev) => {
							this.setState({
								minutes: ev.target.value,
							});
						}}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={this.close} color="primary">
						Cancel
					</Button>
					<Button onClick={this.onSubmit} color="primary">
						Set new phase length
					</Button>
				</DialogActions>
			</Dialog>
		);
	}
}
