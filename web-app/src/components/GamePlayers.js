/* eslint-disable no-restricted-globals */
import React from "react";
import * as helpers from "../helpers";
import gtag from "ga-gtag";
import {
	Accordion,
	AccordionSummary,
	AccordionDetails,
	Button,
	Checkbox,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Typography,
	FormControlLabel,
} from "@mui/material";
import withStyles from '@mui/styles/withStyles';

import { ExpandIcon } from "../icons";
import UserAvatar from "./UserAvatar";
import GameMetadata from "./GameMetadata";
import Globals from "../Globals";

const styles = (theme) => ({
	dialogActions: {
		backgroundColor: "white",
		position: "sticky",
		bottom: "-8px",
	},
	valignClass: {
		display: "flex",
		alignItems: "center",
	},
	paper: {
		margin: "2px",
		width: "100%",
	},
});

class GamePlayers extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false,
			gameStates: (this.props.gameStates || []).reduce((sum, el) => {
				sum[el.Properties.Nation] = el;
				return sum;
			}, {}),
			bans: Globals.bans,
		};
		this.member = (this.props.game.Properties.Members || []).find((e) => {
			return e.User.Email === Globals.user.Email;
		});
		if (this.props.parentCB) {
			this.props.parentCB(this);
		}
		this.close = this.close.bind(this);
		this.toggleMuted = this.toggleMuted.bind(this);
		this.valignClass = props.classes.valignClass;
	}
	componentDidUpdate(prevProps, prevState, snapshot) {
		if (!prevState.open && this.state.open) {
			gtag("set", {
				page_title: "GameMetadata",
				page_location: location.href,
			});
			gtag("event", "page_view");
		}
	}
	toggleBanned(uid) {
		return (_) => {
			if (Globals.bans[uid]) {
				let unsignLink = Globals.bans[uid].Links.find((l) => {
					return l.Rel === "unsign";
				});
				if (unsignLink) {
					helpers.incProgress();
					helpers
						.safeFetch(
							helpers.createRequest(unsignLink.URL, {
								method: unsignLink.Method,
							})
						)
						.then((res) => res.json())
						.then((js) => {
							helpers.decProgress();
							delete Globals.bans[uid];
							this.setState({ bans: Globals.bans });
						});
				}
			} else {
				helpers.incProgress();
				helpers
					.safeFetch(
						helpers.createRequest("/User/" + Globals.user.Id + "/Ban", {
							method: "POST",
							headers: {
								"Content-Type": "application/json",
							},
							body: JSON.stringify({
								UserIds: [Globals.user.Id, uid],
							}),
						})
					)
					.then((res) => res.json())
					.then((js) => {
						helpers.decProgress();
						Globals.bans[uid] = js;
						this.setState({ bans: Globals.bans });
					});
			}
		};
	}
	toggleMuted(nation) {
		return (_) => {
			let gameState = this.state.gameStates[this.member.Nation];
			if (gameState.Properties.Muted === null) {
				gameState.Properties.Muted = [];
			}
			let idx = gameState.Properties.Muted.indexOf(nation);
			if (idx === -1) {
				gameState.Properties.Muted.push(nation);
			} else {
				gameState.Properties.Muted = gameState.Properties.Muted.slice(
					0,
					idx
				).concat(gameState.Properties.Muted.slice(idx + 1));
			}
			let updateLink = this.state.gameStates[this.member.Nation].Links.find(
				(l) => {
					return l.Rel === "update";
				}
			);
			helpers.incProgress();
			helpers
				.safeFetch(
					helpers.createRequest(updateLink.URL, {
						headers: {
							"Content-Type": "application/json",
						},
						method: updateLink.Method,
						body: JSON.stringify(gameState.Properties),
					})
				)
				.then((res) => res.json())
				.then((js) => {
					helpers.decProgress();
					this.setState((state, props) => {
						state = Object.assign({}, state);
						state.gameStates[this.member.Nation].Properties = js.Properties;
						return state;
					});
					this.props.onNewGameState(js);
				});
		};
	}
	close() {
		helpers.unback(this.close);
		this.setState({ open: false });
	}
	render() {
		const { classes } = this.props;
		if (this.state.open) {
			return (
				<Dialog
					TransitionProps={{
						onEnter: helpers.genOnback(this.close),
					}}
					open={this.state.open}
					className="find-game-dialog"
					classes={{
						paper: classes.paper,
					}}
					onClose={this.close}
				>
					<DialogTitle>Game & Player info</DialogTitle>
					<DialogContent>
						<Typography
							variant="subtitle2"
							style={{ fontWeight: "bold", paddingBottom: "8px" }}
						>
							Game settings
						</Typography>
						<GameMetadata game={this.props.game} noplayerlist="true" />

						<Accordion
							onChange={(ev, exp) => {
								this.setState({ expanded: exp });
								console.log(this);
							}}
							square
							style={{
								border: "none",
								boxShadow: "none",
								padding: "0px",
								margin: "0px",
								position: "inherit",
							}}
						>
							<AccordionSummary
								classes={{
									root: classes.accordionSummaryRoot,
									content: classes.accordionSummaryContent,
								}}
								style={{
									border: "none",
									boxShadow: "none",
									padding: "0px",
									margin: "0px",
								}}	
								expandIcon={<ExpandIcon />}
							>
								<Typography variant="subtitle2" style={{fontWeight: "bold", marginTop: "8px"}}>Variant rules</Typography>
							</AccordionSummary>
							<AccordionDetails className={classes.accordionDetails} style={{padding: "0"}}>
								{this.state.expanded ? (
															<Typography variant="subtitle2" style={{ paddingBottom: "8px" }}>

										

											{this.props.variant.Properties.Rules}
										
									</Typography>
								) : (
									""
								)}
							</AccordionDetails>
						</Accordion>

						<Typography
							variant="subtitle2"
							style={{
								fontWeight: "bold",
								paddingBottom: "8px",
								paddingTop: "8px",
							}}
						>
							Players
						</Typography>
						<Typography variant="subtitle2" style={{ paddingBottom: "8px" }}>
							Banning a player means you'll never play with them again.
						</Typography>
						{this.state.gameStates
							? this.props.game.Properties.Members.map((member) => {
									return (
										<React.Fragment key={member.Nation + "-fragment"}>
											<div
												style={{
													display: "flex",
													width: "100%",
													flexWrap: "wrap",
													marginBottom: "12px",
												}}
											>
												<div
													style={{
														width: "40px",
														height: "40px",
														marginRight: "8px",
													}}
												>
													<UserAvatar
														onNewGameState={this.props.onNewGameState}
														game={this.props.game}
														gameState={
															this.member
																? this.state.gameStates[this.member.Nation]
																: null
														}
														banChange={(_) => {
															this.forceUpdate();
														}}
														user={member.User}
													/>
												</div>

												<div
													style={{
														display: "flex",
														flexDirection: "column",
													}}
												>
													<Typography variant="body1">
														{member.Nation}
													</Typography>
													<Typography variant="subtitle2">
														{member.User.Name}
													</Typography>
												</div>

												<div
													style={{
														marginLeft: "auto",
														display: "flex",
														paddingLeft: "8px",
													}}
												>
													<FormControlLabel
														control={
															<Checkbox
																disabled={
																	!member.User.Id ||
																	member.User.Id === Globals.user.Id
																}
																checked={!!this.state.bans[member.User.Id]}
																onChange={this.toggleBanned(member.User.Id)}
																color="primary"
															/>
														}
														label="Ban"
													/>

													<FormControlLabel
														control={
															<Checkbox
																disabled={
																	!this.member ||
																	member.Nation === this.member.Nation
																}
																checked={
																	this.member &&
																	(
																		this.state.gameStates[this.member.Nation]
																			.Properties.Muted || []
																	).indexOf(member.Nation) !== -1
																}
																onChange={this.toggleMuted(member.Nation)}
																color="primary"
															/>
														}
														label="Mute"
														style={{
															marginRigh: "0px",
														}}
													/>
												</div>
											</div>
										</React.Fragment>
									);
							  })
							: ""}

						<DialogActions className={classes.dialogActions}>
							<Button onClick={this.close} color="primary">
								Close
							</Button>
						</DialogActions>
					</DialogContent>
				</Dialog>
			);
		} else {
			return "";
		}
	}
}

export default withStyles(styles, { withTheme: true })(GamePlayers);
