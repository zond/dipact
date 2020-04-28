import * as helpers from '%{ cb "/js/helpers.js" }%';

export default class UserAvatar extends React.Component {
	constructor(props) {
		super(props);
		this.state = { dialogOpen: false, userStats: null };
		this.close = this.close.bind(this);
		this.makeRow = this.makeRow.bind(this);
		this.toggleBanned = this.toggleBanned.bind(this);
	}
	toggleBanned() {
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
	close() {
		this.setState({ dialogOpen: false, picker: null });
	}
	componentDidUpdate(prevProps, prevState, snapshot) {
		if (this.state.dialogOpen && !this.state.userStats) {
			helpers.incProgress();
			helpers
				.safeFetch(
					helpers.createRequest(
						"/User/" + this.props.user.Id + "/Stats"
					)
				)
				.then(resp => resp.json())
				.then(js => {
					helpers.decProgress();
					this.setState({ userStats: js });
				});
		}
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
				<MaterialUI.IconButton
					className={helpers.scopedClass("padding: 0px;")}
					onClick={_ => {
						this.setState({ dialogOpen: true });
					}}
				>
					<MaterialUI.Avatar
						className={helpers.avatarClass}
						alt={this.props.user.Name}
						src={this.props.user.Picture}
						style={{ marginRight: "16px" }}
					/>
				</MaterialUI.IconButton>
				<MaterialUI.Dialog
					onEntered={helpers.genOnback(this.close)}
					onExited={helpers.genUnback(this.close)}
					open={this.state.dialogOpen}
					disableBackdropClick={false}
					onClose={this.close}
				>
					<MaterialUI.DialogTitle>
						{this.props.user.Name}
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
						{this.state.userStats ? (
							<MaterialUI.TableContainer
								component={MaterialUI.Paper}
							>
								<MaterialUI.Table>
									<MaterialUI.TableBody>
										{this.makeRow(
											"Ranking (position in server wide leaderboard)",
											"#" +
												(this.state.userStats.Properties
													.TrueSkill
													.HigherRatedCount +
													1)
										)}
										{this.makeRow(
											"TrueSkill rating (calculation based on win/loss history",
											helpers.twoDecimals(
												this.state.userStats.Properties
													.TrueSkill.Rating
											)
										)}
										{this.makeRow(
											"Reliability (ratio non NMR phases)",
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
											"Abandoned games",
											this.state.userStats.Properties
												.FinishedGames
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
						<MaterialUI.Button onClick={this.close} color="primary">
							Close
						</MaterialUI.Button>
					</MaterialUI.DialogActions>
				</MaterialUI.Dialog>
			</React.Fragment>
		);
	}
}
