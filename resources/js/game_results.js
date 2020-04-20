import * as helpers from '%{ cb "/js/helpers.js" }%';

import NationAvatar from '%{ cb "/js/nation_avatar.js"}%';

export default class GameResults extends React.Component {
	constructor(props) {
		super(props);
		this.state = { open: false, gameResult: null };
		this.member = this.props.game.Properties.Members.find(e => {
			return e.User.Email == Globals.user.Email;
		});
		if (this.props.parentCB) {
			this.props.parentCB(this);
		}
		this.close = this.close.bind(this);
	}
	close() {
		this.setState({ open: false });
	}
	componentDidMount() {
		let gameResultLink = this.props.game.Links.find(l => {
			return l.Rel == "game-result";
		});
		if (gameResultLink) {
			helpers.incProgress();
			helpers
				.safeFetch(helpers.createRequest(gameResultLink.URL))
				.then(res => res.json())
				.then(js => {
					helpers.decProgress();
					this.setState({ gameResult: js });
				});
		}
	}
	render() {
		return (
			<MaterialUI.Dialog
				open={this.state.open}
				disableBackdropClick={false}
				classes={{
					paper: helpers.scopedClass("margin: 2px; width: 100%;")
				}}
				onClose={this.close}
			>
				<MaterialUI.DialogTitle>Game results</MaterialUI.DialogTitle>
				<MaterialUI.DialogContent>
					<MaterialUI.Typography>
						This is the scoreboard for this game, based on number of
						owned supply centers. The scoring system used is the{" "}
						<a href="http://windycityweasels.org/tribute-scoring-system/">
							Tribute
						</a>{" "}
						ssytem.
					</MaterialUI.Typography>
					<MaterialUI.List>
						{this.state.gameResult
							? this.props.variant.Properties.Nations.slice()
									.sort((n1, n2) => {
										if (
											this.member &&
											n1 == this.member.Nation
										) {
											return -1;
										} else if (
											this.member &&
											n2 == this.member.Nation
										) {
											return 1;
										} else {
											if (n1 < n2) {
												return -1;
											} else if (n2 < n1) {
												return 1;
											} else {
												return 0;
											}
										}
									})
									.map(nation => {
										const score = this.state.gameResult.Properties.Scores.find(
											s => {
												return s.Member == nation;
											}
										);
										return (
											<li key={"nation_" + nation}>
												<ul
													style={{
														paddingLeft: "0px"
													}}
												>
													<MaterialUI.ListSubheader
														style={{
															backgroundColor:
																"white",
															padding: "0px 16px",
															margin: "0px",
															display: "flex",
															flexWrap: "wrap",
															color:
																"rgba(40, 26, 26, 0.54)"
														}}
													>
														<NationAvatar
															nation={nation}
															className={
																helpers.avatarClass
															}
															variant={
																this.props
																	.variant
															}
														/>
														{nation}
													</MaterialUI.ListSubheader>
													<MaterialUI.List>
														{this.state.gameResult
															.Properties
															.SoloWinnerMember ==
														nation ? (
															<MaterialUI.ListItem key="solo-winner">
																<MaterialUI.ListItemText>
																	Solo winner
																</MaterialUI.ListItemText>
															</MaterialUI.ListItem>
														) : (
															""
														)}
														{this.state.gameResult
															.Properties
															.SoloWinnerMember ==
															"" &&
														(
															this.state
																.gameResult
																.Properties
																.DIASMembers ||
															[]
														).indexOf(nation) !=
															-1 ? (
															<MaterialUI.ListItem key="dias-member">
																<MaterialUI.ListItemText>
																	Draw
																	participant
																</MaterialUI.ListItemText>
															</MaterialUI.ListItem>
														) : (
															""
														)}
														{(
															this.state
																.gameResult
																.Properties
																.EliminatedMembers ||
															[]
														).indexOf(nation) !=
														-1 ? (
															<MaterialUI.ListItem key="eliminated-member">
																<MaterialUI.ListItemText>
																	Eliminated
																</MaterialUI.ListItemText>
															</MaterialUI.ListItem>
														) : (
															""
														)}
														{(
															this.state
																.gameResult
																.Properties
																.NMRMembers ||
															[]
														).indexOf(nation) !=
														-1 ? (
															<MaterialUI.ListItem key="nmr-member">
																<MaterialUI.ListItemText>
																	Abandoned
																	the game
																</MaterialUI.ListItemText>
															</MaterialUI.ListItem>
														) : (
															""
														)}
														{score ? (
															<React.Fragment>
																<MaterialUI.ListItem>
																	{score.SCs}{" "}
																	supply
																	centers
																</MaterialUI.ListItem>
																<MaterialUI.ListItem>
																	<MaterialUI.TableContainer
																		component={
																			MaterialUI.Paper
																		}
																	>
																		<MaterialUI.Table>
																			<MaterialUI.TableBody>
																				{score.Explanation.split(
																					"\n"
																				)
																					.filter(
																						l => {
																							return (
																								l.trim() !=
																								""
																							);
																						}
																					)
																					.map(
																						line => {
																							const parts = line.split(
																								":"
																							);
																							return (
																								<MaterialUI.TableRow
																									key={
																										line
																									}
																								>
																									<MaterialUI.TableCell
																										component="th"
																										scope="row"
																									>
																										{
																											parts[0]
																										}
																									</MaterialUI.TableCell>
																									<MaterialUI.TableCell align="left">
																										{helpers.twoDecimals(
																											parts[1]
																										)}
																									</MaterialUI.TableCell>
																								</MaterialUI.TableRow>
																							);
																						}
																					)}
																				<MaterialUI.TableRow>
																					<MaterialUI.TableCell>
																						Sum
																					</MaterialUI.TableCell>
																					<MaterialUI.TableCell>
																						{helpers.twoDecimals(
																							score.Score
																						)}
																					</MaterialUI.TableCell>
																				</MaterialUI.TableRow>
																			</MaterialUI.TableBody>
																		</MaterialUI.Table>
																	</MaterialUI.TableContainer>
																</MaterialUI.ListItem>
															</React.Fragment>
														) : (
															""
														)}
													</MaterialUI.List>
												</ul>
											</li>
										);
									})
							: ""}
					</MaterialUI.List>
					<MaterialUI.DialogActions>
						<MaterialUI.Button onClick={this.close} color="primary">
							Close
						</MaterialUI.Button>
					</MaterialUI.DialogActions>
				</MaterialUI.DialogContent>
			</MaterialUI.Dialog>
		);
	}
}
