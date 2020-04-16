import * as helpers from '%{ cb "/js/helpers.js" }%';

import Game from '%{ cb "/js/game.js" }%';
import NationPreferencesDialog from '%{ cb "/js/nation_preferences_dialog.js" }%';

export default class GameListElement extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			game: this.props.game,
			viewOpen: false,
			member: props.game.Properties.Members.find(e => {
				return e.User.Email == Globals.user.Email;
			})
		};
		this.variant = Globals.variants.find(v => {
			return v.Properties.Name == this.props.game.Properties.Variant;
		});
		this.nationPreferencesDialog = null;
		this.valignClass = helpers.scopedClass(
			"display: flex; align-items: center;"
		);
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
				Globals.messaging.start();
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
				this.setState({
					game: js,
					member: js.Properties.Members.find(e => {
						return e.User.Email == Globals.user.Email;
					})
				});
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
			this.state.member != null &&
			this.state.game.Properties.Started &&
			!this.state.game.Properties.Finished
		) {
			if (this.state.member.NewestPhaseState.OnProbation) {
				this.addIcon(icons, "\ue88b", "red");
			} else if (this.state.member.NewestPhaseState.ReadyToResolve) {
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
				<MaterialUI.Grid
					className={this.valignClass}
					item
					key={itemKey++}
					xs={10}
				>
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
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					width: "100%",

					marginTop: "8px"
				}}
			>
				{(_ => {
					if (this.state.game.Properties.Started) {
						return (
							<React.Fragment>
								{/* IF STARTED */}
								<div
									style={{
										display: "flex",
										flexDirection: "row",
										justifyContent: "space-between"
									}}
								>
									{this.state.member &&
									this.state.member.UnreadMessages > 0 ? (
										<MaterialUI.Badge
											key={itemKey++}
											badgeContent={
												this.state.member.UnreadMessages
											}
											color="primary"
											style={{
												maxWidth: "calc(100% - 70px)"
											}}
										>
											<MaterialUI.Typography
												textroverflow="ellipsis"
												noWrap
												style={{
													color: "rgba(40, 26, 26, 1)"
												}}
											>
												{helpers.gameDesc(
													this.state.game
												)}
											</MaterialUI.Typography>
										</MaterialUI.Badge>
									) : (
										<MaterialUI.Typography
											key={itemKey++}
											textroverflow="ellipsis"
											noWrap={true}
											style={{
												minWidth: "60px",
												color: "rgba(40, 26, 26, 1)"
											}}
										>
											{helpers.gameDesc(this.state.game)}
										</MaterialUI.Typography>
									)}

									<div
										id="Timer"
										key={itemKey++}
										style={{
											alignSelf: "center",
											display: "flex",
											alignItems: "center",
											color: "#281A1A"
										}}
									>
										{this.state.member != null &&
										this.state.game.Properties.Started &&
										!this.state.game.Properties.Finished ? (
											this.state.member.NewestPhaseState
												.OnProbation ? (
												<MaterialUI.SvgIcon>
													<path
														d="M2.98188996,2.24133335 L21.3666663,20.6261097 L20.0261097,21.9666663 L19.0573333,20.998 L19,21 L5,21 C3.95,21 3.0822314,20.1799587 3.00551277,19.1486946 L3,19 L3,5 L3.00233335,4.942 L1.64133335,3.58188996 L2.98188996,2.24133335 Z M12,1 C13.235,1 14.2895,1.7581 14.75196,2.828465 L14.82,3 L19,3 C20.05,3 20.9177686,3.82004132 20.9944872,4.85130541 L21,5 L21,17.963 L16.037,13 L17,13 L17,11 L14.037,11 L12.037,9 L17,9 L17,7 L10.037,7 L6.037,3 L9.18,3 C9.579,1.898 10.5917,1.0848 11.80656,1.006235 L12,1 Z M13.0593333,15 L7,15 L7,17 L15.0593333,17 L13.0593333,15 Z M11.0593333,13 L9.06033335,11 L7,11 L7,13 L11.0593333,13 Z M12,3 C11.45,3 11,3.45 11,4 C11,4.55 11.45,5 12,5 C12.55,5 13,4.55 13,4 C13,3.45 12.55,3 12,3 Z"
														id="Shape"
														fill="#b71c1c"
														fill-rule="nonzero"
													></path>
												</MaterialUI.SvgIcon>
											) : this.state.member
													.NewestPhaseState
													.ReadyToResolve ? (
												<MaterialUI.SvgIcon>
													<path
														d="M9,0 C10.3,0 11.4,0.84 11.82,2 L11.82,2 L16,2 C17.1045695,2 18,2.8954305 18,4 L18,4 L18,18 C18,19.1045695 17.1045695,20 16,20 L16,20 L2,20 C0.8954305,20 0,19.1045695 0,18 L0,18 L0,4 C0,2.8954305 0.8954305,2 2,2 L2,2 L6.18,2 C6.6,0.84 7.7,0 9,0 Z M13.4347826,7 L7.70608696,12.7391304 L4.56521739,9.60869565 L3,11.173913 L7.70608696,15.8695652 L15,8.56521739 L13.4347826,7 Z M9,2 C8.44771525,2 8,2.44771525 8,3 C8,3.55228475 8.44771525,4 9,4 C9.55228475,4 10,3.55228475 10,3 C10,2.44771525 9.55228475,2 9,2 Z"
														fill="#281A1A"
														id="Combined-Shape"
													></path>
												</MaterialUI.SvgIcon>
											) : (
												helpers.createIcon("\ue422")
											)
										) : (
											""
										)}
										<MaterialUI.Typography
											variant="body2"
											style={{
												paddingLeft: "2px",
												color: "rgba(40, 26, 26, 1)"
											}}
										>
											{this.state.game.Properties.Finished
												? helpers.minutesToDuration(
														-this.state.game
															.Properties
															.FinishedAgo /
															1000000000 /
															60,
														true
												  )
												: helpers.minutesToDuration(
														this.state.game
															.Properties
															.NewestPhaseMeta[0]
															.NextDeadlineIn /
															1000000000 /
															60,
														true
												  )}
										</MaterialUI.Typography>
									</div>
								</div>
								<div
									key={itemKey++}
									style={{
										display: "flex",
										flexDirection: "row",
										justifyContent: "space-between",
										flexWrap: "wrap"
									}}
								>
									<MaterialUI.Typography
										textroverflow="ellipsis"
										noWrap={true}
										display="inline"
										variant="caption"
										id="variant"
										style={{
											color: "rgba(40, 26, 26, 0.7)"
										}}
									>
										{this.state.game.Properties.Variant}{" "}
										{helpers.minutesToDuration(
											this.state.game.Properties
												.PhaseLengthMinutes
										)}
									</MaterialUI.Typography>
									<MaterialUI.Typography
										variant="caption"
										style={{
											color: "rgba(40, 26, 26, 0.7)"
										}}
									>
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
								</div>
							</React.Fragment>
						);
					} else {
						return (
							<React.Fragment>
								{/* IF STARTED */}
								<div
									style={{
										display: "flex",
										flexDirection: "row",
										justifyContent: "space-between"
									}}
								>
									<MaterialUI.Typography
										key={itemKey++}
										textroverflow="ellipsis"
										noWrap={true}
										style={{}}
									>
										{helpers.gameDesc(this.state.game)}
									</MaterialUI.Typography>

									<div
										id="Join"
										key={itemKey++}
										style={{
											alignSelf: "center",
											display: "flex",
											alignItems: "center"
										}}
									>
										{helpers.createIcon("\ue7fb")}{" "}
										<MaterialUI.Typography
											variant="body2"
											style={{ paddingLeft: "2px" }}
										>
											{
												this.state.game.Properties
													.NMembers
											}
											/
											{
												this.variant.Properties.Nations
													.length
											}{" "}
										</MaterialUI.Typography>
									</div>
								</div>
								<MaterialUI.Typography
									textroverflow="ellipsis"
									noWrap={true}
									display="inline"
									variant="caption"
									style={{ color: "rgba(40, 26, 26, 0.7)" }}
								>
									{this.state.game.Properties.Variant}{" "}
									{helpers.minutesToDuration(
										this.state.game.Properties
											.PhaseLengthMinutes
									)}
								</MaterialUI.Typography>
							</React.Fragment>
						);
					}
				})()}

				{/*} <div>
            {/*
					{this.getIcons()} 
            {this.getIcons()}
          </div> TODO: @Joren fix the get icons into the expanded view.*/}
			</div>
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
						unreadMessagesUpdate={this.reloadGame}
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
					{/* TODO: @Joren, the next iteration is here: styling the the expansionpanel on "My ..." list */}
					<MaterialUI.ExpansionPanelSummary
						classes={{
							content: helpers.scopedClass("min-width: 0;")
						}}
						expandIcon={helpers.createIcon("\ue5cf")}
					>
						{summary}
					</MaterialUI.ExpansionPanelSummary>
					<MaterialUI.ExpansionPanelDetails
						style={{
							paddingRight: "0.3em",
							paddingLeft: "0.3em"
						}}
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
