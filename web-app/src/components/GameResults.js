/* eslint-disable no-restricted-globals */
import React from 'react';
import * as helpers from '../helpers';
import { Button, List, ListItem, Typography, Dialog, DialogTitle, DialogContent, DialogActions, AccordionDetails, Accordion, AccordionSummary } from "@material-ui/core";
import gtag from 'ga-gtag';

import { ExpandIcon } from '../icons';
import NationAvatar from './NationAvatar';
import Globals from '../Globals';

export default class GameResults extends React.Component {
	constructor(props) {
		super(props);
		this.state = { open: false, gameResult: null, trueSkills: null };
		this.member = (this.props.game.Properties.Members || []).find((e) => {
			return e.User.Email === Globals.user.Email;
		});
		if (this.props.parentCB) {
			this.props.parentCB(this);
		}
		this.close = this.close.bind(this);
	}
	close() {
		helpers.unback(this.close);
		this.setState({ open: false });
	}
	componentDidUpdate(prevProps, prevState, snapshot) {
		if (!prevState.open && this.state.open) {
			gtag("set", {
				page_title: "GameResults",
				page_location: location.href,
			});
			gtag("event", "page_view");
		}
	}
	componentDidMount() {
		let gameResultLink = this.props.game.Links.find((l) => {
			return l.Rel === "game-result";
		});
		if (gameResultLink) {
			helpers.incProgress();
			helpers
				.safeFetch(helpers.createRequest(gameResultLink.URL))
				.then((res) => res.json())
				.then((gameResultJS) => {
					gameResultJS.Properties.Scores = gameResultJS.Properties.Scores.sort(
						(a, b) => {
							if (a.Score > b.Score) {
								return -1;
							} else if (a.Score < b.Score) {
								return 1;
							} else if (a.SCs > b.SCs) {
								return -1;
							} else if (a.SCs < b.SCs) {
								return 1;
							}
							return 0;
						}
					);
					const trueSkillsLink = gameResultJS.Links.find((l) => {
						return l.Rel === "true-skills";
					});
					if (trueSkillsLink) {
						helpers
							.safeFetch(
								helpers.createRequest(
									gameResultJS.Links.find((l) => {
										return l.Rel === "true-skills";
									}).URL
								)
							)
							.then((res) => res.json())
							.then((trueSkillsJS) => {
								helpers.decProgress();
								this.setState({
									gameResult: gameResultJS,
									trueSkills: trueSkillsJS,
								});
							});
					} else {
						helpers.decProgress();
						this.setState({
							gameResult: gameResultJS,
						});
					}
				});
		}
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
					paper: helpers.scopedClass("margin: 2px; width: 100%;"),
				}}
				onClose={this.close}
			>
				<DialogTitle>Game result</DialogTitle>
				<DialogContent style={{ paddingBottom: "0px" }}>
					{this.state.gameResult ? (
						this.state.gameResult.Properties.SoloWinnerMember ? (
							<Typography>
								The game was won by{" "}
								{
									(
										this.props.game.Properties.Members || []
									).find((m) => {
										return (
											m.Nation ===
											this.state.gameResult.Properties
												.SoloWinnerMember
										);
									}).User.Name
								}{" "}
								playing{" "}
								{
									this.state.gameResult.Properties
										.SoloWinnerMember
								}
								.
							</Typography>
						) : (
							<Typography>
								The game was a draw.
								{this.state.gameResult.Properties.Scores[0]
									.Score >
								this.state.gameResult.Properties.Scores[1].Score
									? " " +
									  (
											this.props.game.Properties
												.Members || []
									  ).find((m) => {
											return (
												m.Nation ===
												this.state.gameResult.Properties
													.Scores[0].Member
											);
									  }).User.Name +
									  " earned the highest score as " +
									  this.state.gameResult.Properties.Scores[0]
											.Member +
									  "."
									: ""}
							</Typography>
						)
					) : (
						""
					)}

					<Typography variant="caption">
						Points below are based on the{" "}
						<a href="http://windycityweasels.org/tribute-scoring-system/">
							Tribute
						</a>{" "}
						system.
					</Typography>
					<List>
						{this.state.gameResult
							? this.state.gameResult.Properties.Scores.map(
									(score) => {
										const trueSkill = this.state.trueSkills
											? this.state.trueSkills.Properties.find(
													(l) => {
														return (
															l.Properties
																.Member ===
															score.Member
														);
													}
											  )
											: null;
										return (
											<ListItem
												key={"nation_" + score.Member}
												style={{
													padding: "0px",
													margin: "0px",
												}}
											>
												<Accordion
													square
													style={{
														padding: "0px",
														margin: "0px",
														boxShadow: "none",
														width: "100%",
													}}
												>
													<AccordionSummary
														style={{
															padding: "0px",
															margin: "0px",
															boxShadow: "none",
														}}
														expandIcon={<ExpandIcon />}
													>
														<div
															style={{
																backgroundColor:
																	"white",
																padding:
																	"0px 0px",
																margin: "0px",
																display: "flex",
																flexWrap:
																	"wrap",
																alignItems:
																	"center",
																width: "100%",
																color:
																	"rgba(40, 26, 26, 0.54)",
															}}
														>
															<NationAvatar
																game={
																	this.props
																		.game
																}
																gameState={
																	this.props
																		.gameState
																}
																newGameState={
																	this.props
																		.newGameState
																}
																nation={
																	score.Member
																}
																variant={
																	this.props
																		.variant
																}
															/>
															<div
																style={{
																	marginLeft:
																		"8px",
																	display:
																		"flex",
																	flexDirection:
																		"column",
																}}
															>
																<Typography
																	variant="subtitle2"
																	color="primary"
																>
																	{
																		score.Member
																	}
																</Typography>
																{this.state
																	.gameResult
																	.Properties
																	.SoloWinnerMember ===
																score.Member ? (
																	<Typography
																		variant="caption"
																		key="solo-winner"
																	>
																		Solo
																		winner
																	</Typography>
																) : (
																	""
																)}
																{this.state
																	.gameResult
																	.Properties
																	.SoloWinnerMember ===
																	"" &&
																(
																	this.state
																		.gameResult
																		.Properties
																		.EliminatedMembers ||
																	[]
																).indexOf(
																	score.Member
																) === -1 &&
																(
																	this.state
																		.gameResult
																		.Properties
																		.NMRMembers ||
																	[]
																).indexOf(
																	score.Member
																) === -1 ? (
																	<Typography
																		variant="caption"
																		key="dias-member"
																	>
																		Draw
																		participant
																	</Typography>
																) : (
																	""
																)}
																{(
																	this.state
																		.gameResult
																		.Properties
																		.EliminatedMembers ||
																	[]
																).indexOf(
																	score.Member
																) !== -1 ? (
																	<Typography
																		variant="caption"
																		key="eliminated-member"
																	>
																		Eliminated
																	</Typography>
																) : (
																	""
																)}
																{(
																	this.state
																		.gameResult
																		.Properties
																		.NMRMembers ||
																	[]
																).indexOf(
																	score.Member
																) !== -1 ? (
																	<Typography
																		variant="caption"
																		key="nmr-member"
																	>
																		Abandoned
																		the game
																	</Typography>
																) : (
																	""
																)}
															</div>
															<div
																style={{
																	display:
																		"flex",
																	flexDirection:
																		"column",
																	alignSelf:
																		"flex-end",
																	marginLeft:
																		"auto",
																}}
															>
																<Typography
																	variant="subtitle2"
																	color="primary"
																	style={{
																		textAlign:
																			"right",
																	}}
																>
																	{helpers.twoDecimals(
																		score.Score
																	)}{" "}
																	points
																</Typography>
																<Typography
																	variant="caption"
																	style={{
																		textAlign:
																			"right",
																	}}
																>
																	{score.SCs}{" "}
																	SCs{" "}
																</Typography>
															</div>
														</div>
													</AccordionSummary>

													<AccordionDetails>
														<div
															style={{
																width: "100%",
															}}
														>
															{score ? (
																<div
																	style={{
																		display:
																			"flex",
																		flexDirection:
																			"column",
																		padding:
																			"0px",
																		margin:
																			"0px",
																		width:
																			"100%",
																	}}
																>
																	<div>
																		{score.Explanation.split(
																			"\n"
																		)
																			.filter(
																				(
																					l
																				) => {
																					return (
																						l.trim() !==
																						""
																					);
																				}
																			)
																			.map(
																				(
																					line
																				) => {
																					const parts = line.split(
																						":"
																					);
																					return (
																						<div
																							style={{
																								display:
																									"flex",
																								justifyContent:
																									"space-between",
																								color:
																									"rgba(40, 26, 26,0.3)",
																							}}
																							key={
																								line
																							}
																						>
																							<Typography variant="subtitle2">
																								{
																									parts[0]
																								}
																							</Typography>
																							<Typography variant="subtitle2">
																								{helpers.twoDecimals(
																									parts[1]
																								)}
																							</Typography>
																						</div>
																					);
																				}
																			)}

																		{trueSkill ? (
																			<div>
																				<div
																					style={{
																						borderTop:
																							"1px solid black",
																						display:
																							"flex",
																						justifyContent:
																							"space-between",
																						padding:
																							"0px",
																						margin:
																							"0px 0px 16px 0px",
																						width:
																							"100%",
																					}}
																				>
																					<Typography variant="subtitle2">
																						Total
																						points
																					</Typography>
																					<Typography variant="subtitle2">
																						{helpers.twoDecimals(
																							score.Score
																						)}
																					</Typography>
																				</div>
																				<div
																					style={{
																						display:
																							"flex",
																						justifyContent:
																							"space-between",
																						padding:
																							"0px",
																						margin:
																							"0px",
																						width:
																							"100%",
																						color:
																							"rgba(40, 26, 26,0.3)",
																					}}
																				>
																					{trueSkill
																						.Properties
																						.Previous instanceof
																					Array ? (
																						<React.Fragment>
																							<Typography variant="subtitle2">
																								Previous
																								rating
																							</Typography>
																							<Typography variant="subtitle2">
																								{helpers.twoDecimals(
																									trueSkill
																										.Properties
																										.Previous[0]
																										.Rating
																								)}
																							</Typography>
																						</React.Fragment>
																					) : (
																						""
																					)}
																				</div>
																				<div
																					style={{
																						display:
																							"flex",
																						justifyContent:
																							"space-between",
																						padding:
																							"0px",
																						margin:
																							"0px",
																						width:
																							"100%",
																						color:
																							"rgba(40, 26, 26,0.3)",
																					}}
																				>
																					{trueSkill
																						.Properties
																						.Previous instanceof
																					Array ? (
																						<React.Fragment>
																							<Typography variant="subtitle2">
																								Points
																								vs
																								Predicted
																								outcome
																							</Typography>
																							<Typography variant="subtitle2">
																								{helpers.twoDecimals(
																									trueSkill
																										.Properties
																										.Rating -
																										trueSkill
																											.Properties
																											.Previous[0]
																											.Rating
																								)}
																							</Typography>
																						</React.Fragment>
																					) : (
																						""
																					)}
																				</div>
																				<div
																					style={{
																						display:
																							"flex",
																						justifyContent:
																							"space-between",
																						padding:
																							"0px",
																						margin:
																							"0px",
																						width:
																							"100%",
																						borderTop:
																							"1px solid black",
																					}}
																				>
																					<Typography variant="subtitle2">
																						New
																						rating
																					</Typography>
																					<Typography variant="subtitle2">
																						{helpers.twoDecimals(
																							trueSkill
																								.Properties
																								.Rating
																						)}
																					</Typography>
																				</div>
																			</div>
																		) : (
																			<div
																				style={{
																					display:
																						"flex",
																					justifyContent:
																						"space-between",
																					padding:
																						"0px",
																					margin:
																						"0px",
																					width:
																						"100%",
																				}}
																			>
																				<div>
																					Total
																					points
																				</div>
																				<div>
																					{helpers.twoDecimals(
																						score.Score
																					)}
																				</div>
																			</div>
																		)}
																	</div>
																</div>
															) : (
																""
															)}
														</div>
													</AccordionDetails>
												</Accordion>
											</ListItem>
										);
									}
							  )
							: ""}
					</List>
					<DialogActions
						className={helpers.scopedClass(
							"background-color: white; position: sticky; bottom: 0px;"
						)}
					>
						<Button onClick={this.close} color="primary">
							Close
						</Button>
					</DialogActions>
				</DialogContent>
			</Dialog>
		);
	}
}

