import React from "react";
import { IconButton, Avatar } from "@material-ui/core";

import StatsDialog from "./StatsDialog";

/*
 * MUST HAVE:
 * - user: A user object.
 * MIGHT HAVE:
 * - game: A game object.
 *         Forwarded to the stats dialog.
 * - gameState: A game state object representing the config of the logged in user for the current game.
 *              Forwarded to the stats dialog.
 * - onNewGameState: A callback to run with the new game state if it gets changed (due to muting the user in the game).
 *                   Forwarded to the stats dialog.
 */
export default class UserAvatar extends React.Component {
	constructor(props) {
		super(props);
		this.state = { dialogOpen: false };
	}
	render() {
		return (
			<React.Fragment>
				<IconButton
					style={{
						padding: "0px",
					}}
					onClick={(_) => {
						if (this.props.user.Id) {
							this.setState({ dialogOpen: true });
						}
					}}
				>
					<Avatar
						alt={this.props.user.Name}
						src={this.props.user.Picture}
						style={{ marginRight: "16px" }}
					/>
				</IconButton>
				{this.state.dialogOpen ? (
					<StatsDialog
						game={this.props.game}
						onClose={(ev) => {
							if (ev) {
								ev.stopPropagation();
								ev.preventDefault();
							}
							this.setState({ dialogOpen: false });
						}}
						user={this.props.user}
						gameState={this.props.gameState}
						onNewGameState={this.props.onNewGameState}
					/>
				) : (
					""
				)}
			</React.Fragment>
		);
	}
}
