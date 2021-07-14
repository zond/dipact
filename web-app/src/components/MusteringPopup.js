import React from 'react';

import * as helpers from '../helpers';
import { Button, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from "@material-ui/core";

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
			<Dialog
				onEntered={helpers.genOnback(this.close)}
				open={this.state.open}
				disableBackdropClick={false}
				classes={{
					paper: helpers.scopedClass("margin: 2px; width: 100%;")
				}}
				onClose={this.close}
			>
				<DialogTitle>Mustering game</DialogTitle>
				<DialogContent style={{ paddingBottom: "0px" }}>
					<Typography>
						This game is currently in the mustering phase. This
						means that all players must confirm that they are ready
						to start, or the game will eject all non-ready players
						from this and all staging games, and revert back to
						being a staging game.
					</Typography>
					<DialogActions
						className={helpers.scopedClass(
							"background-color: white; position: sticky; bottom: 0px;"
						)}
					>
						<Button
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
						</Button>
						<Button onClick={this.close} color="primary">
							Close
						</Button>
					</DialogActions>
				</DialogContent>
			</Dialog>
		);
	}
}
