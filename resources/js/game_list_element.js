import * as helpers from '%{ cb "/js/helpers.js" }%';

import Game from '%{ cb "/js/game.js" }%';
import NationPreferencesDialog from '%{ cb "/js/nation_preferences_dialog.js" }%';

export default class GameListElement extends React.Component {
	constructor(props) {
		super(props);
		this.state = { game: this.props.game, viewOpen: false };
		this.member = props.game.Properties.Members.find(e => {
			return e.User.Email == Globals.user.Email;
		});
		this.variant = Globals.variants.find(v => {
			return v.Properties.Name == this.props.game.Properties.Variant;
		});
		this.nationPreferencesDialog = null;
		this.viewGame = this.viewGame.bind(this);
		this.closeGame = this.closeGame.bind(this);
		this.joinGame = this.joinGame.bind(this);
		this.leaveGame = this.leaveGame.bind(this);
		this.joinGameWithPreferences = this.joinGameWithPreferences.bind(this);
		this.reloadGame = this.reloadGame.bind(this);
		this.dead = false;
	}
	joinGameWithPreferences(link, preferences) {
		helpers.incProgress();
		helpers
			.safeFetch(
				helpers.createRequest(link.URL, {
					method: link.Method,
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify({
						NationPreferences: preferences.join(",")
					})
				})
			)
			.then(_ => {
				helpers.decProgress();
				this.reloadGame();
			});
	}
	reloadGame() {
		helpers
			.safeFetch(
				helpers.createRequest(
					this.state.game.Links.find(l => {
						return l.Rel == "self";
					}).URL
				)
			)
			.then(resp => resp.json())
			.then(js => {
				this.setState({ game: js });
			});
	}
	leaveGame(link) {
		helpers.incProgress();
		helpers
			.safeFetch(
				helpers.createRequest(link.URL, {
					method: link.Method
				})
			)
			.then(resp => resp.json())
			.then(_ => {
				helpers.decProgress();
				if (this.state.game.Properties.Members.length > 1) {
					this.reloadGame();
				} else {
					this.dead = true;
					this.setState((state, props) => {
						state = Object.assign({}, state);
						state.game.Links = [];
						return state;
					});
				}
			});
	}
	joinGame(link) {
		if (this.state.game.Properties.NationAllocation == 1) {
			this.nationPreferencesDialog.setState({
				open: true,
				nations: this.variant.Properties.Nations,
				onSelected: preferences => {
					this.joinGameWithPreferences(link, preferences);
				}
			});
		} else {
			this.joinGameWithPreferences(link, []);
		}
	}
	closeGame() {
		this.setState({ viewOpen: false });
	}
	viewGame(e) {
		e.stopPropagation();
		e.preventDefault();
		this.setState({ viewOpen: true });
	}
	addIcon(ary, codepoint, color) {
		ary.push(
			helpers.createIcon(codepoint, {
				padding: "4px 1px 0px 1px",
				color: color,
				fontSize: "14px"
			})
		);
	}
	getIcons() {
		let icons = [];
		if (
			this.member != null &&
			this.state.game.Properties.Started &&
			!this.state.game.Properties.Finished
		) {
			if (this.member.NewestPhaseState.OnProbation) {
				this.addIcon(icons, "\ue88b", "red");
			} else if (this.member.NewestPhaseState.ReadyToResolve) {
				this.addIcon(icons, "\ue877", "green");
			}
		}
		if (
			this.state.game.Properties.MinQuickness ||
			this.state.game.Properties.MinReliability
		) {
			this.addIcon(icons, "\ue425", "black");
		}
		if (
			this.state.game.Properties.MinRating ||
			this.state.game.Properties.MaxRating
		) {
			this.addIcon(icons, "\ue83a", "black");
		}
		if (
			this.state.game.Properties.MaxHater ||
			this.state.game.Properties.MaxHated
		) {
			this.addIcon(icons, "\ue612", "black");
		}
		if (
			this.state.game.Properties.DisableConferenceChat ||
			this.state.game.Properties.DisableGroupChat ||
			this.state.game.Properties.DisablePrivateChat
		) {
			this.addIcon(icons, "\ue61e", "black");
		}
		if (this.state.game.Properties.Private) {
			this.addIcon(icons, "\ue628", "black");
		}
		if (this.state.game.Properties.NationAllocation == 1) {
			this.addIcon(icons, "\ue065", "black");
		}

		return <MaterialUI.Box display="inline">{icons}</MaterialUI.Box>;
	}
	render() {
		let expandedGameCells = [
			"Created at",
			helpers.timeStrToDate(this.state.game.Properties.CreatedAt)
		];
		if (this.state.game.Properties.Started) {
			expandedGameCells.push(
				"Started at",
				helpers.timeStrToDate(this.state.game.Properties.StartedAt)
			);
		}
		if (this.state.game.Properties.Finished) {
			expandedGameCells.push(
				"Finished at",
				helpers.timeStrToDate(this.state.game.Properties.FinishedAt)
			);
		}
		expandedGameCells.push(
			"Nation allocation",
			this.state.game.Properties.NationAllocation == 1
				? "Preferences"
				: "Random"
		);

		if (this.state.game.Properties.MinRating) {
			expandedGameCells.push(
				"Minimum rating",
				this.state.game.Properties.MinRating
			);
		}
		if (this.state.game.Properties.MaxRating) {
			expandedGameCells.push(
				"Maximum rating",
				this.state.game.Properties.MaxRating
			);
		}
		if (this.state.game.Properties.MinReliability) {
			expandedGameCells.push(
				"Minimum reliability",
				this.state.game.Properties.MinReliability
			);
		}
		if (this.state.game.Properties.MinQuickness) {
			expandedGameCells.push(
				"Minimum quickness",
				this.state.game.Properties.MinQuickness
			);
		}
		if (this.state.game.Properties.MaxHated) {
			expandedGameCells.push(
				"Maximum hated",
				this.state.game.Properties.MaxHated
			);
		}
		if (this.state.game.Properties.MaxHater) {
			expandedGameCells.push(
				"Maximum hater",
				this.state.game.Properties.MaxHater
			);
		}
		if (
			this.state.game.Properties.DisableConferenceChat ||
			this.state.game.Properties.DisableGroupChat ||
			this.state.game.Properties.DisablePrivateChat
		) {
			if (
				this.state.game.Properties.DisableConferenceChat &&
				this.state.game.Properties.DisableGroupChat &&
				this.state.game.Properties.DisablePrivateChat
			) {
				// Add two columns because this is required for formatting nicely.
				expandedGameCells.push("All chat disabled", "(Gunboat)");
			} else {
				// Sort channel types by whether they're enabled or disabled.
				let allChannels = { false: [], true: [] };
				allChannels[
					this.state.game.Properties.DisableConferenceChat
				].push("Conference");
				allChannels[this.state.game.Properties.DisableGroupChat].push(
					"Group"
				);
				allChannels[this.state.game.Properties.DisablePrivateChat].push(
					"Private"
				);
				expandedGameCells.push(
					"Disabled channels",
					allChannels[false].join(",")
				);
				expandedGameCells.push(
					"Enabled channels",
					allChannels[true].join(",")
				);
			}
		}
		let expandedGameItems = [];
		let itemKey = 0;
		expandedGameCells.forEach(cell =>
			expandedGameItems.push(
				<MaterialUI.Grid item key={itemKey++} xs={6}>
					<MaterialUI.Typography>{cell}</MaterialUI.Typography>
				</MaterialUI.Grid>
			)
		);
		this.state.game.Properties.Members.forEach(member => {
			expandedGameItems.push(
				<MaterialUI.Grid item key={itemKey++} xs={2}>
					<MaterialUI.Avatar
						className={helpers.avatarClass}
						alt={member.User.Name}
						src={member.User.Picture}
					/>
				</MaterialUI.Grid>
			);
			expandedGameItems.push(
				<MaterialUI.Grid item key={itemKey++} xs={10}>
					<MaterialUI.Typography>
						{member.User.GivenName} {member.User.FamilyName}
					</MaterialUI.Typography>
				</MaterialUI.Grid>
			);
		});
		let buttons = [];
		if (!this.dead) {
			buttons.push(
				<MaterialUI.Button onClick={this.viewGame} key={itemKey++}>
					View
				</MaterialUI.Button>
			);
		}
		this.state.game.Links.forEach(link => {
			if (link.Rel == "join") {
				buttons.push(
					<MaterialUI.Button
						key={itemKey++}
						onClick={_ => {
							this.joinGame(link);
						}}
					>
						Join
					</MaterialUI.Button>
				);
			} else if (link.Rel == "leave") {
				buttons.push(
					<MaterialUI.Button
						key={itemKey++}
						onClick={_ => {
							this.leaveGame(link);
						}}
					>
						Leave
					</MaterialUI.Button>
				);
			}
		});
		expandedGameItems.push(
			<MaterialUI.Grid item key={itemKey++} xs={12}>
				<MaterialUI.ButtonGroup style={{ marginTop: "0.2em" }}>
					{buttons}
				</MaterialUI.ButtonGroup>
			</MaterialUI.Grid>
		);

		let summary = (
			<MaterialUI.Grid container>
				{(_ => {
					if (this.state.game.Properties.Started) {
						return (
							<React.Fragment>
								<MaterialUI.Grid key={itemKey++} item xs={11}>
									{this.member &&
									this.member.UnreadMessages > 0 ? (
										<MaterialUI.Badge
											badgeContent={
												this.member.UnreadMessages
											}
											color="primary"
										>
											<MaterialUI.Typography
												textroverflow="ellipsis"
												noWrap={true}
											>
												{helpers.gameDesc(
													this.state.game
												)}
											</MaterialUI.Typography>
										</MaterialUI.Badge>
									) : (
										<MaterialUI.Typography
											textroverflow="ellipsis"
											noWrap={true}
										>
											{helpers.gameDesc(this.state.game)}
										</MaterialUI.Typography>
									)}
								</MaterialUI.Grid>
								<MaterialUI.Grid key={itemKey++} item xs={1}>
									{this.state.game.Properties.Finished
										? helpers.minutesToDuration(
												-this.state.game.Properties
													.FinishedAgo /
													1000000000 /
													60,
												true
										  )
										: helpers.minutesToDuration(
												this.state.game.Properties
													.NewestPhaseMeta[0]
													.NextDeadlineIn /
													1000000000 /
													60,
												true
										  )}
								</MaterialUI.Grid>
								<MaterialUI.Grid key={itemKey++} item xs={12}>
									<MaterialUI.Typography>
										{
											this.state.game.Properties
												.NewestPhaseMeta[0].Season
										}{" "}
										{
											this.state.game.Properties
												.NewestPhaseMeta[0].Year
										}
										,{" "}
										{
											this.state.game.Properties
												.NewestPhaseMeta[0].Type
										}
									</MaterialUI.Typography>
								</MaterialUI.Grid>
							</React.Fragment>
						);
					} else {
						return (
							<React.Fragment>
								<MaterialUI.Grid key={itemKey++} item xs={11}>
									<MaterialUI.Typography
										textroverflow="ellipsis"
										noWrap={true}
									>
										{helpers.gameDesc(this.state.game)}
									</MaterialUI.Typography>
								</MaterialUI.Grid>
								<MaterialUI.Grid key={itemKey++} item xs={1}>
									<MaterialUI.Typography>
										{this.state.game.Properties.NMembers}/
										{this.variant.Properties.Nations.length}{" "}
									</MaterialUI.Typography>
								</MaterialUI.Grid>
							</React.Fragment>
						);
					}
				})()}
				<MaterialUI.Grid item xs={12}>
					<MaterialUI.Typography
						textroverflow="ellipsis"
						noWrap={true}
						display="inline"
					>
						{this.state.game.Properties.Variant}{" "}
						{helpers.minutesToDuration(
							this.state.game.Properties.PhaseLengthMinutes
						)}
					</MaterialUI.Typography>
					{this.getIcons()}
				</MaterialUI.Grid>
			</MaterialUI.Grid>
		);

		let gameView = (
			<MaterialUI.Zoom
				in={this.state.viewOpen}
				mountOnEnter
				unmountOnExit
			>
				<div
					style={{
						position: "fixed",
						zIndex: 1300,
						right: 0,
						bottom: 0,
						top: 0,
						left: 0,
						background: "#ffffff"
					}}
				>
					<Game
						gamePromise={
							new Promise((res, rej) => {
								res(this.state.game);
							})
						}
						close={this.closeGame}
					/>
				</div>
			</MaterialUI.Zoom>
		);

		if (this.props.summaryOnly) {
			return (
				<React.Fragment>
					<div style={{ width: "100%" }} onClick={this.viewGame}>
						{summary}
					</div>
					{gameView}
				</React.Fragment>
			);
		}
		return (
			<React.Fragment>
				<MaterialUI.ExpansionPanel key="game-details">
					<MaterialUI.ExpansionPanelSummary
						classes={{
							content: helpers.scopedClass("min-width: 0;")
						}}
						expandIcon={helpers.createIcon("\ue5cf")}
					>
						{summary}
					</MaterialUI.ExpansionPanelSummary>
					<MaterialUI.ExpansionPanelDetails
						style={{ paddingRight: "0.3em", paddingLeft: "0.3em" }}
					>
						<MaterialUI.Paper elevation={3}>
							<MaterialUI.Grid
								container
								style={{ margin: "0.3em" }}
							>
								{expandedGameItems}
							</MaterialUI.Grid>
						</MaterialUI.Paper>
					</MaterialUI.ExpansionPanelDetails>
				</MaterialUI.ExpansionPanel>
				{gameView}
				<NationPreferencesDialog
					parentCB={c => {
						this.nationPreferencesDialog = c;
					}}
					onSelected={null}
				/>
			</React.Fragment>
		);
	}
}
