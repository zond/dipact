import * as helpers from '%{ cb "/js/helpers.js" }%';

import LeaderboardDialog from '%{ cb "/js/leaderboard_dialog.js" }%';

/*
 * MUST HAVE:
 * - user: A user object.
 * MIGHT HAVE (which will show the nation the user is playing, and allow muting them):
 * - game: A game object.
 *         Will show the nation the user plays in the game.
 * - gameState: A game state object representing the config of the logged in user for the current game.
 *              Will enable muting/unmuting the user in the game.
 * - onNewGameState: A callback to run with the new game state if it gets changed (due to muting the user in the game).
 *                   Required if gameState is provided.
 */
export default class StatsDialog extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			userStats: null,
			leaderboardDialogOpen: false,
			gameState: this.props.gameState
		};
		this.member = this.props.game
			? this.props.game.Properties.Members.find(e => {
					return e.User.Email == Globals.user.Email;
			  })
			: null;
		this.makeRow = this.makeRow.bind(this);
		this.nation = this.props.game
			? this.props.game.Properties.Members.find(m => {
					return m.User.Id == this.props.user.Id;
			  }).Nation
			: null;
		this.toggleBanned = this.toggleBanned.bind(this);
		this.toggleMuted = this.toggleMuted.bind(this);
		this.onClose = helpers.genUnbackClose(this.props.onClose);
	}
	toggleMuted(ev) {
		ev.preventDefault();
		ev.stopPropagation();
		if (this.state.gameState.Properties.Muted == null) {
			this.state.gameState.Properties.Muted = [];
		}
		if (this.state.gameState.Properties.Muted.indexOf(this.nation) == -1) {
			this.state.gameState.Properties.Muted.push(this.nation);
		} else {
			this.state.gameState.Properties.Muted = this.state.gameState.Properties.Muted.filter(
				m => {
					return m != this.nation;
				}
			);
		}
		let updateLink = this.state.gameState.Links.find(l => {
			return l.Rel == "update";
		});
		helpers.incProgress();
		helpers
			.safeFetch(
				helpers.createRequest(updateLink.URL, {
					headers: {
						"Content-Type": "application/json"
					},
					method: updateLink.Method,
					body: JSON.stringify(this.state.gameState.Properties)
				})
			)
			.then(res => res.json())
			.then(js => {
				helpers.decProgress();
				this.setState((state, props) => {
					state = Object.assign({}, state);
					state.gameState.Properties = js.Properties;
					return state;
				});
				this.props.onNewGameState(js);
			});
	}
	toggleBanned(ev) {
		ev.preventDefault();
		ev.stopPropagation();
		if (Globals.bans[this.props.user.Id]) {
			let unsignLink = Globals.bans[this.props.user.Id].Links.find(l => {
				return l.Rel == "unsign";
			});
			if (unsignLink) {
				helpers.incProgress();
				helpers
					.safeFetch(
						helpers.createRequest(unsignLink.URL, {
							method: unsignLink.Method
						})
					)
					.then(res => res.json())
					.then(js => {
						helpers.decProgress();
						delete Globals.bans[this.props.user.Id];
						this.forceUpdate();
						if (this.props.banChange) {
							this.props.banChange();
						}
					});
			}
		} else {
			helpers.incProgress();
			helpers
				.safeFetch(
					helpers.createRequest("/User/" + Globals.user.Id + "/Ban", {
						method: "POST",
						headers: {
							"Content-Type": "application/json"
						},
						body: JSON.stringify({
							UserIds: [Globals.user.Id, this.props.user.Id]
						})
					})
				)
				.then(res => res.json())
				.then(js => {
					helpers.decProgress();
					Globals.bans[this.props.user.Id] = js;
					this.forceUpdate();
					if (this.props.banChange) {
						this.props.banChange();
					}
				});
		}
	}
	componentDidMount() {
		helpers.incProgress();
		helpers
			.safeFetch(
				helpers.createRequest("/User/" + this.props.user.Id + "/Stats")
			)
			.then(resp => resp.json())
			.then(js => {
				helpers.decProgress();
				this.setState({ userStats: js });
				gtag("set", {
					page_title: "StatsDialog",
					page_location: location.href
				});
				gtag("event", "page_view");
			});
	}
	makeRow(label, value) {
		return (
			<MaterialUI.TableRow>
				<MaterialUI.TableCell>{label}</MaterialUI.TableCell>
				<MaterialUI.TableCell>{value}</MaterialUI.TableCell>
			</MaterialUI.TableRow>
		);
	}
	render() {
		return (
			<React.Fragment>
				<MaterialUI.Dialog
					onEntered={helpers.genOnback(this.props.onClose)}
					disableBackdropClick={false}
					open={true}
					onClose={this.onClose}
				>
					<MaterialUI.DialogTitle>
						{this.props.user.Name}
						{this.props.game ? " playing " + this.nation : ""}
					</MaterialUI.DialogTitle>
					<MaterialUI.DialogContent>
						<MaterialUI.FormControlLabel
							control={
								<MaterialUI.Checkbox
									disabled={
										this.props.user.Id == Globals.user.Id
									}
									checked={!!Globals.bans[this.props.user.Id]}
									onClick={this.toggleBanned}
								/>
							}
							label="Banned"
						/>
						{this.member ? (
							<MaterialUI.FormControlLabel
								control={
									<MaterialUI.Checkbox
										disabled={
											this.props.user.Id ==
											Globals.user.Id
										}
										checked={
											(
												this.state.gameState.Properties
													.Muted || []
											).indexOf(this.nation) != -1
										}
										onClick={this.toggleMuted}
									/>
								}
								label="Muted"
							/>
						) : (
							""
						)}
						{this.state.userStats ? (
							<MaterialUI.TableContainer
								component={MaterialUI.Paper}
							>
								<MaterialUI.Table>
									<MaterialUI.TableBody>
										{this.makeRow(
											"Ranking (position in server wide leaderboard)",
											<MaterialUI.Button
												variant="outlined"
												onClick={_ => {
													this.setState({
														leaderboardDialogOpen: true
													});
												}}
											>
												{"#" +
													(this.state.userStats
														.Properties.TrueSkill
														.HigherRatedCount +
														1)}
											</MaterialUI.Button>
										)}
										{this.makeRow(
											"TrueSkill rating (calculation based on win/loss history)",
											helpers.twoDecimals(
												this.state.userStats.Properties
													.TrueSkill.Rating
											)
										)}
										{this.makeRow(
											"Rating percentile (percentage of active players as good or better)",
											"" +
												helpers.ratingPercentile(
													this.state.userStats
														.Properties.TrueSkill
														.Rating
												) +
												"%"
										)}
										{this.makeRow(
											"Reliability (ratio of non NMR phases)",
											helpers.twoDecimals(
												this.state.userStats.Properties
													.Reliability
											)
										)}
										{this.makeRow(
											"Quickness (ratio of committed phases)",
											helpers.twoDecimals(
												this.state.userStats.Properties
													.Quickness
											)
										)}
										{this.makeRow(
											"Hated (ratio of games resulting in being banned)",
											helpers.twoDecimals(
												this.state.userStats.Properties
													.Hated
											)
										)}
										{this.makeRow(
											"Hater (ratio of games resulting in banning someone)",
											helpers.twoDecimals(
												this.state.userStats.Properties
													.Hater
											)
										)}
										{this.makeRow(
											"Joined games",
											this.state.userStats.Properties
												.JoinedGames
										)}
										{this.makeRow(
											"Started games",
											this.state.userStats.Properties
												.StartedGames
										)}
										{this.makeRow(
											"Finished games",
											this.state.userStats.Properties
												.FinishedGames
										)}
										{this.makeRow(
											"Abandoned games",
											this.state.userStats.Properties
												.DroppedGames
										)}
										{this.makeRow(
											"Solo wins",
											this.state.userStats.Properties
												.SoloGames
										)}
										{this.makeRow(
											"Draws",
											this.state.userStats.Properties
												.DIASGames
										)}
										{this.makeRow(
											"Eliminations",
											this.state.userStats.Properties
												.EliminatedGames
										)}
										{this.makeRow(
											"Abandoned games",
											this.state.userStats.Properties
												.DroppedGames
										)}
									</MaterialUI.TableBody>
								</MaterialUI.Table>
							</MaterialUI.TableContainer>
						) : (
							""
						)}
					</MaterialUI.DialogContent>
					<MaterialUI.DialogActions>
						<MaterialUI.Button
							onClick={this.onClose}
							color="primary"
						>
							Close
						</MaterialUI.Button>
					</MaterialUI.DialogActions>
				</MaterialUI.Dialog>
				{this.state.leaderboardDialogOpen ? (
					<LeaderboardDialog
						onClose={_ => {
							this.setState({ leaderboardDialogOpen: false });
						}}
					/>
				) : (
					""
				)}
			</React.Fragment>
		);
	}
}
