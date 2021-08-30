/* eslint-disable no-restricted-globals */
import React from "react";
import * as helpers from "../helpers";
import Globals from "../Globals";
import gtag from "ga-gtag";
import {
	Dialog,
	Button,
	TextField,
	DialogContent,
	DialogActions,
	DialogTitle,
	Grid,
	Typography,
	ListItem,
	MenuItem,
	Select,
	InputLabel,
	List,
	IconButton,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

import { DeleteIcon } from "../icons";

const styles = (theme) => ({
	dialogActions: {
		backgroundColor: "white",
		position: "sticky",
		bottom: "0px",
	},
});

class ManageInvitationsDialog extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false,
			game: this.props.game,
			email: "",
			nation: "normal_allocation",
		};
		this.variant = Globals.variants.find((variant) => {
			return variant.Name === this.props.game.Properties.Variant;
		});
		if (this.props.parentCB) {
			this.props.parentCB(this);
		}
		this.onInvite = this.onInvite.bind(this);
		this.onUninvite = this.onUninvite.bind(this);
		this.close = this.close.bind(this);
	}
	onUninvite(email) {
		return (_) => {
			if (!email) return;
			const link = this.state.game.Links.find((l) => {
				return l.Rel === "uninvite-" + email;
			});
			if (!link) return;
			helpers.incProgress();
			helpers
				.safeFetch(
					helpers.createRequest(link.URL, {
						method: link.Method,
					})
				)
				.then((_) => {
					helpers.decProgress();
					gtag("event", "manage_invitations_dialog_uninvite_user");
					this.props.reloadGame().then((game) => {
						this.setState({ game: game });
					});
				});
		};
	}
	onInvite() {
		if (!this.state.email) {
			helpers.snackbar("Email address is empty.");
			return;
		}
		const link = this.state.game.Links.find((l) => {
			return l.Rel === "invite-user";
		});
		if (!link) return;
		helpers.incProgress();
		helpers
			.safeFetch(
				helpers.createRequest(link.URL, {
					method: link.Method,
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						Email: this.state.email,
						Nation:
							this.state.nation === "normal_allocation"
								? ""
								: this.state.nation,
					}),
				})
			)
			.then((_) => {
				helpers.decProgress();
				gtag("event", "manage_invitations_dialog_invite_user");
				this.props.reloadGame().then((game) => {
					this.setState({ game: game });
				});
			});
	}
	componentDidUpdate(prevProps, prevState, snapshot) {
		if (!prevState.open && this.state.open) {
			gtag("set", {
				page_title: "ManageInvitationsDialog",
				page_location: location.href,
			});
			gtag("event", "page_view");
		}
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
				open={this.state.open}
				TransitionProps={{
					onEnter: helpers.genOnback(this.close),
				}}
				onClose={this.close}
				fullWidth={true}
				maxWidth="xl"
			>
				<DialogTitle>Manage whitelist</DialogTitle>
				<DialogContent>
					<React.Fragment>
						<Typography style={{ margin: "1em" }}>
							<span style={{ fontWeight: "bold" }}>
								Email addresses must exactly match their login
								email.
							</span>{" "}
							Login email can be seen in the top right menu with
							the logout option. Whitelisted players are able to
							join the game, even if it requires game master
							whitelisting. If the game master picks a country for
							the whitelisting, that country will be assigned when
							the game starts. No email or messages are sent to
							the player, use the 'Share game' link after opening
							the game to send links to this game.
						</Typography>
						<List>
							{(
								this.state.game.Properties
									.GameMasterInvitations || []
							).map((invitation) => {
								return (
									<ListItem key={invitation.Email}>
										<Grid container>
											<Grid key="data" item xs={10}>
												<Typography>
													{invitation.Email}
													{invitation.Nation
														? " as " +
														  invitation.Nation
														: ""}
												</Typography>
											</Grid>
											<Grid key="button" item xs={2}>
												<IconButton
													style={{ padding: "0" }}
													onClick={this.onUninvite(
														invitation.Email
													)}
												>
													<DeleteIcon />
												</IconButton>
											</Grid>
										</Grid>
									</ListItem>
								);
							})}
						</List>
					</React.Fragment>
					<TextField
						key="Email"
						id="manage-invitations-dialog-email"
						label="Email"
						margin="dense"
						onChange={(ev) => {
							this.setState({ email: ev.target.value });
						}}
						style={{
							marginBottom: "8px",
							flexGrow: "1",
						}}
					/>
					<InputLabel
						shrink
						id="nationlabel"
						style={{
							marginTop: "16px",
						}}
					>
						Nation
					</InputLabel>
					<Select
						key="Nation"
						labelId="nationlabel"
						value={this.state.nation}
						onChange={(ev) => {
							this.setState({ nation: ev.target.value });
						}}
						style={{ marginBottom: "16px" }}
					>
						<MenuItem
							key="normal_allocation"
							value="normal_allocation"
						>
							Default allocation for game
						</MenuItem>
						{this.variant.Properties.Nations.map((nation) => {
							return (
								<MenuItem key={nation} value={nation}>
									{nation}
								</MenuItem>
							);
						})}
					</Select>
				</DialogContent>
				<DialogActions className={classes.dialogActions}>
					<Button onClick={this.onInvite} color="primary">
						Add to whitelist
					</Button>
				</DialogActions>
			</Dialog>
		);
	}
}

export default withStyles(styles, { withTheme: true })(ManageInvitationsDialog);
