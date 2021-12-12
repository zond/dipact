/* eslint-disable no-restricted-globals */
import React from 'react';
import * as helpers from '../helpers';
import {
    Dialog,
    Button,
    TextField,
    DialogContent,
    DialogActions,
    DialogTitle,
} from '@mui/material';

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
				TransitionProps={{
					onEnter: helpers.genOnback(this.close),
				}}
				onClose={this.close}
			>
				<DialogTitle>Reschedule game</DialogTitle>
				<DialogContent>
					<TextField
						name="next-phase-deadline-in-minutes"
						label="New next deadline in minutes"
						style={{ minWidth: "170px" }}
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
					<Button onClick={this.onSubmit} color="primary">
						Reschedule
					</Button>
				</DialogActions>
			</Dialog>
		);
	}
}

