import React from "react";
import { IconButton, Avatar } from "@mui/material";

import { withStatsDialog } from "./StatsDialogWrapper";

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
// TODO functional component
class UserAvatar extends React.Component {
	render() {
		return (
            <React.Fragment>
				<IconButton
                    style={{
						padding: "0px",
					}}
                    onClick={() => {
						// TODO move out of component
						if (this.props.user.Id) {
							this.props.statsDialogOptions.open(this.props.user, this.props.game, this.props.gameState, this.props.onNewGameState);
						}
					}}
                    size="large">
					<Avatar
						alt={this.props.user.Name}
						src={this.props.user.Picture}
						style={{ marginRight: "16px" }}
					/>
				</IconButton>
			</React.Fragment>
        );
	}
}

export default withStatsDialog(UserAvatar);
