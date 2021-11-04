import React from "react";

import * as helpers from "../helpers";
import {
	Button,
	Typography,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

const styles = (theme) => ({
	dialogActions: {
		backgroundColor: "white",
		position: "sticky",
		bottom: "0px",
	},
	paper: {
		margin: "2px",
		width: "100%",
	},
});

class MusteringPopup extends React.Component {
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
		const { classes } = this.props;
		if (!this.state.open) {
			return "";
		}
		return (
			<Dialog
				onEntered={helpers.genOnback(this.close)}
				open={this.state.open}
				disableBackdropClick={false}
				classes={{
					paper: classes.paper,
				}}
				onClose={this.close}
			>
				<DialogTitle>Get Ready Phase</DialogTitle>
				<DialogContent style={{ paddingBottom: "0px" }}>
					<Typography>
						This game is currently in the Get Ready phase. Players must confirm
						they're ready to start or the game will remove them and go back to
						finding (replacement) players. To give future replacements an equal
						chance, you can't chat yet.
					</Typography>
					<DialogActions className={classes.dialogActions}>
						<Button
							color="primary"
							onClick={(_) => {
								this.setState(
									{
										open: false,
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

export default withStyles(styles, { withTheme: true })(MusteringPopup);
