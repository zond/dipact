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
			emailError: false,
			emailErrorDescription: "",
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
		this.handleError = this.handleError.bind(this);
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
		console.log(this);

		// Check if the email is a valid format
		let validString =
			/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		let validEmail = validString.test(this.state.email);
		let nationExists = false;
		// Check if the nation is already allocated - we don't want two similar nations!
		if (this.props.game.Properties.GameMasterInvitations) {
			this.props.game.Properties.GameMasterInvitations.map((nation) => {
				if (nation.Nation == this.state.nation) {
					nationExists = true;
				}
			});
		}

		console.log(nationExists);
		if (!this.state.email) {
			this.setState({
				emailError: true,
				emailErrorDescription: "Email is empty",
			});
			return;
		} else if (validEmail == false) {
			this.setState({
				emailError: true,
				emailErrorDescription: "Invalid email address",
			});
			return;
		} else if (nationExists == true) {
			this.setState({
				emailError: true,
				emailErrorDescription: "Nation is already allocated",
			});
			return;
		}
		{
			this.setState({ emailError: false });
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
	handleError() {
		if (this.state.emailError == false) {
			return <div style={{ height: "19px" }}></div>;
		} else {
			return (
				<Typography variant="caption" color="error">
					{this.state.emailErrorDescription}
				</Typography>
			);
		}
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
				<DialogTitle>Assign players</DialogTitle>
				<DialogContent>
					<React.Fragment>
						<Typography variant="subtitle2">
							Assign a player to have them join a specific nation{" "}
							<span style={{ color: "red" }}>
								(they won't be invited automatically)
							</span>
							. <br />
							To re-assign a joined player, remove them from the game and let
							them re-join. <br />
							Email address must match their Diplicity login details exactly.
						</Typography>
						<Typography
							variant="subtitle2"
							style={{ fontWeight: "bold", marginTop: "8px" }}
						>
							Assigned players
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
							marginTop: "0px",
							paddingTop: "0px",
						}}
					>
						<div
							style={{
								display: "flex",
								flexDirection: "column",
								marginRight: "16px",
								marginTop: "0px",
								paddingTop: "0px",
							}}
						>
							<TextField
								key="Email"
								id="manage-invitations-dialog-email"
								label="Email"
								margin="dense"
								error={this.state.emailError}
								onChange={(ev) => {
									this.setState({ email: ev.target.value });
								}}
								style={{
									margin: "0 0 0 0",
									flexGrow: "1",
									justifyContent: "flex-end",
									maxWidth: "200px",
								}}
							/>
							{this.handleError()}
						</div>
						<div
							style={{
								display: "flex",
								flexDirection: "column",
								margin: "0 16px 0 0",
								padding: "0",
							}}
						>
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
									{this.props.game.Properties.NationAllocation === 0
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
							<div style={{ height: "19px" }}></div>
						</div>
						<div
							style={{
								display: "flex",
								flexDirection: "column",
								justifyContent: "flex-end",
							}}
						>
							<Button
								onClick={this.onInvite}
								variant="outlined"
								color="primary"
								style={{
									alignSelf: "flex-end",
									marginTop: "4px",
								}}
							>
								Assign
							</Button>
							<div style={{ height: "19px" }}></div>
						</div>
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
