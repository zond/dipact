/* eslint-disable no-restricted-globals */
import React from "react";
import gtag from "ga-gtag";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	TextField,
} from "@material-ui/core";

import * as helpers from "../helpers";

export default class FindGameDialog extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false,
			onFind: null,
		};
		if (this.props.parentCB) {
			this.props.parentCB(this);
		}
		this.onFind = this.onFind.bind(this);
		this.close = this.close.bind(this);
	}
	componentDidUpdate(prevProps, prevState, snapshot) {
		if (!prevState.open && this.state.open) {
			gtag("set", {
				page_title: "FindGameDialog",
				page_location: location.href,
			});
			gtag("event", "page_view");
		}
	}
	close() {
		helpers.unback(this.close);
		this.setState({ open: false });
	}
	onFind() {
		const gameID = document.getElementById(
			"find-game-by-id-input-field"
		).value;
		helpers.unback(this.close);
		gtag("event", "find_game");
		this.setState({ open: false }, (_) => {
			this.state.onFind(gameID);
		});
	}
	render() {
		return (
			<Dialog
				TransitionProps={{
					onEnter: helpers.genOnback(this.close),
				}}
				open={this.state.open}
				className="find-game-dialog"
				onClose={this.close}
			>
				<DialogTitle>Find game</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Enter any game ID or URL to find it. You can find the
						game URL in the address bar for any opened game, or by
						choosing "Share" in the top right menu of any game.
					</DialogContentText>
					<TextField
						id="find-game-by-id-input-field"
						label="Game ID"
						autoFocus
						margin="dense"
						fullWidth
					/>
					<DialogActions>
						<Button onClick={this.close} color="primary">
							Cancel
						</Button>
						<Button onClick={this.onFind} color="primary">
							Find
						</Button>
					</DialogActions>
				</DialogContent>
			</Dialog>
		);
	}
}
