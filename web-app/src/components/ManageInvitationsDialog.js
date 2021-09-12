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
				onEntered={helpers.genOnback(this.close)}
				disableBackdropClick={false}
				onClose={this.close} //TODO: REMOVE THE THEY WILL NOT BE INVITED AUTOMATICALLY BELOW. THIS NEEDS TO BE HANDLED PRETTIER.
			>
				<DialogTitle>Manage whitelist</DialogTitle>
				<DialogContent>
					<React.Fragment>
						<Typography variant="subtitle2">
							Whitelist players to allow them to join the game (they will not be
							invited automatically!){" "}
							<span style={{ color: "red" }}>
								Email address must match players Diplicity login details
								exactly.
							</span>
						</Typography>
						<Typography
							variant="subtitle2"
							style={{ fontWeight: "bold", marginTop: "8px" }}
						>
							Whitelisted players
						</Typography>
						<List>
							{(this.state.game.Properties.GameMasterInvitations || []).map(
								(invitation) => {
									return (
										<ListItem
											key={invitation.Email}
											style={{ padding: "0", margin: "0 0 8px 0" }}
										>
											<Grid container>
												<Grid key="data" item xs={11}>
													<Typography>{invitation.Email}</Typography>
													{invitation.Nation ? (
														<Typography variant="caption">
															as {""}
															{invitation.Nation}
														</Typography>
													) : (
														""
													)}
												</Grid>
												<Grid key="button" item xs={1}>
													<IconButton
														style={{ padding: "0", margin: "0" }}
														onClick={this.onUninvite(invitation.Email)}
													>
														<DeleteIcon />
													</IconButton>
												</Grid>
											</Grid>
										</ListItem>
									);
								}
							)}
						</List>
					</React.Fragment>
					<Typography
						variant="subtitle2"
						style={{ fontWeight: "bold", marginTop: "8px" }}
					>
						Add player
					</Typography>
					<div
						style={{
							display: "flex",
							flexWrap: "wrap",
							marginTop: "0",
							paddingTop: "0px",
						}}
					>
						<TextField
							key="Email"
							id="manage-invitations-dialog-email"
							label="Email"
							margin="dense"
							onChange={(ev) => {
								this.setState({ email: ev.target.value });
							}}
							style={{
								margin: "0 16px 0 0",
								flexGrow: "1",
								alignSelf: "flex-end",
								maxWidth: "200px",
							}}
						/>
						<div style={{ margin: "0", padding: "0" }}>
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
							>
								<MenuItem key="normal_allocation" value="normal_allocation">
									{this.props.game.Properties.NationAllocation == 0
										? "Random"
										: "Player preference"}
								</MenuItem>
								{this.variant.Properties.Nations.map((nation) => {
									return (
										<MenuItem key={nation} value={nation}>
											{nation}
										</MenuItem>
									);
								})}
							</Select>
						</div>
						<Button onClick={this.onInvite} variant="outlined" color="primary" style={{alignSelf: "flex-end", marginLeft: "16px"}}>
							Add
						</Button>
					</div>
				</DialogContent>
				<DialogActions className={classes.dialogActions}>
					<Button onClick={this.close}>Close</Button>
				</DialogActions>
			</Dialog>
		);
	}
}

export default withStyles(styles, { withTheme: true })(ManageInvitationsDialog);
