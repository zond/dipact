import * as helpers from '%{ cb "/js/helpers.js" }%';

import DipMap from '%{ cb "/js/dip_map.js" }%';
import ChatMenu from '%{ cb "/js/chat_menu.js" }%';
import OrderList from '%{ cb "/js/order_list.js" }%';
import GamePlayers from '%{ cb "/js/game_players.js" }%';
import GameResults from '%{ cb "/js/game_results.js" }%';
import PreliminaryScores from '%{ cb "/js/preliminary_scores.js" }%';
import NationPreferencesDialog from '%{ cb "/js/nation_preferences_dialog.js" }%';

export default class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			readyReminder: false,
			phaseMessages: [],
			activeTab: "map",
			activePhase: null,
			phases: [],
			corroboration: { Properties: {} },
			variant: null,
			member: null,
			unreadMessages: 0,
			laboratoryMode: false,
			labEditMode: false,
			labPlayAs: "",
			gameStates: [],
			game: null
		};
		this.renderedPhaseOrdinal = null;
		this.debugCounters = {};
		this.options = null;
		this.GamePlayers = null;
		this.gameResults = null;
		this.preliminaryScores = null;
		this.nationPreferencesDialog = null;
		this.changeTab = this.changeTab.bind(this);
		this.debugCount = this.debugCount.bind(this);
		this.changePhase = this.changePhase.bind(this);
		this.loadGame = this.loadGame.bind(this);
		this.receiveCorroboration = this.receiveCorroboration.bind(this);
		this.phaseJumper = this.phaseJumper.bind(this);
		this.phaseMessageHandler = this.phaseMessageHandler.bind(this);
		this.setUnreadMessages = this.setUnreadMessages.bind(this);
		this.labPhaseResolve = this.labPhaseResolve.bind(this);
		this.serializePhaseState = this.serializePhaseState.bind(this);
		this.onNewGameState = this.onNewGameState.bind(this);
		this.join = this.join.bind(this);
		this.joinWithPreferences = this.joinWithPreferences.bind(this);
		this.leave = this.leave.bind(this);
		this.refinePhaseMessage = this.refinePhaseMessage.bind(this);
		// Dead means "unmounted", and is used to stop the chat channel from setting the URL
		// when it gets closed, if the parent game is unmounted.
		this.dead = false;
		this.dip_map = null;
	}
	debugCount(tag) {
		if (!this.debugCounters[tag]) {
			this.debugCounters[tag] = 0;
		}
		this.debugCounters[tag] += 1;
	}
	refinePhaseMessage(msg) {
		const parts = msg.split(":");
		switch (parts[0]) {
			case "MustDisband":
				return "You must disband " + parts[1] + " units this phase.";
				break;
			case "MayBuild":
				return "You may build " + parts[1] + " units this phase.";
				break;
		}
		return "";
	}
	leave() {
		const link = this.state.game.Links.find(l => {
			return l.Rel == "leave";
		});
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
				gtag("event", "game_leave");
				if (this.props.onLeaveGame) {
					this.props.onLeaveGame();
				}
				this.setState(
					(state, props) => {
						state = Object.assign({}, state);
						state.game.Links = state.game.Links.filter(l => {
							return l.Rel != "leave";
						});
						return state;
					},
					_ => {
						if (this.state.game.Properties.Members.length > 1) {
							this.loadGame();
						}
					}
				);
			});
	}
	join() {
		if (this.state.game.Properties.NationAllocation == 1) {
			this.nationPreferencesDialog.setState({
				open: true,
				nations: this.state.variant.Properties.Nations,
				onSelected: preferences => {
					this.joinWithPreferences(preferences);
				}
			});
		} else {
			this.joinWithPreferences([]);
		}
	}
	joinWithPreferences(preferences) {
		const link = this.state.game.Links.find(l => {
			return l.Rel == "join";
		});
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
				gtag("event", "game_join");
				Globals.messaging.start();
				this.setState(
					(state, props) => {
						state = Object.assign({}, state);
						state.game.Links = state.game.Links.filter(l => {
							return l.Rel != "join";
						});
						return state;
					},
					_ => {
						this.loadGame();
					}
				);
				if (this.props.onJoinGame) {
					this.props.onJoinGame();
				}
			});
	}
	onNewGameState(gameState) {
		this.setState((state, props) => {
			state = Object.assign({}, state);
			state.gameStates = state.gameStates.map(gs => {
				if (gs.Properties.Nation == gameState.Properties.Nation) {
					gs.Properties = gameState.Properties;
				}
				return gs;
			});
			return state;
		});
	}
	serializePhaseState(phase) {
		return encodeURIComponent(
			btoa(
				pako.deflate(
					JSON.stringify({
						activePhase: phase.Properties.PhaseOrdinal,
						phases: this.state.phases
							.map(p => {
								if (
									p.Properties.PhaseOrdinal ==
									phase.Properties.PhaseOrdinal
								) {
									return phase;
								} else {
									return p;
								}
							})
							.filter(p => {
								return (
									!p.Properties.GameID ||
									p.Properties.PhaseOrdinal ==
										phase.Properties.PhaseOrdinal
								);
							})
					}),
					{ to: "string" }
				)
			)
		);
	}
	labPhaseResolve(resolvedPhase, newPhase) {
		this.setState({
			phases: this.state.phases
				.map(oldPhase => {
					if (
						oldPhase.Properties.PhaseOrdinal ==
						resolvedPhase.Properties.PhaseOrdinal
					) {
						return resolvedPhase;
					} else {
						return oldPhase;
					}
				})
				.filter(oldPhase => {
					return (
						oldPhase.Properties.PhaseOrdinal <
						newPhase.Properties.PhaseOrdinal
					);
				})
				.concat([newPhase]),
			activePhase: newPhase
		});
	}
	setUnreadMessages(n) {
		this.setState({ unreadMessages: n });
		if (this.props.unreadMessagesUpdate) {
			this.props.unreadMessagesUpdate();
		}
	}
	phaseJumper(steps) {
		return _ => {
			let newPhase = this.state.phases.find(p => {
				return (
					p.Properties.PhaseOrdinal ==
					this.state.activePhase.Properties.PhaseOrdinal + steps
				);
			});
			this.setState({ activePhase: newPhase });
		};
	}
	receiveCorroboration(corr) {
		this.setState({ corroboration: corr });
	}
	componentWillUnmount() {
		helpers.unback(this.props.close);
		this.dead = true;
		history.pushState("", "", "/");
		if (Globals.messaging.unsubscribe("phase", this.phaseMessageHandler)) {
			console.log("Game unsubscribing from `phase` notifications.");
		}
	}
	componentDidMount() {
		this.loadGame().then(_ => {
			helpers.urlMatch(
				[
					[
						/^\/Game\/([^\/]+)\/Channel\/([^\/]+)\/Messages$/,
						match => {
							this.setState({ activeTab: "chat" });
						}
					],
					[
						/^\/Game\/([^\/]+)\/Lab\/(.+)$/,
						match => {
							const serializedState = JSON.parse(
								pako.inflate(
									atob(decodeURIComponent(match[2])),
									{
										to: "string"
									}
								)
							);
							const newPhases = this.state.phases.slice();
							serializedState.phases.forEach(phase => {
								newPhases[
									phase.Properties.PhaseOrdinal - 1
								] = phase;
							});
							this.setState({
								laboratoryMode: true,
								activePhase: newPhases.find(phase => {
									return (
										phase.Properties.PhaseOrdinal ==
										serializedState.activePhase
									);
								}),
								phases: newPhases
							});
							gtag("set", {
								page_title: "Game",
								page_location: location.href
							});
							gtag("event", "page_view");
						}
					]
				],
				_ => {
					history.pushState(
						"",
						"",
						"/Game/" + this.state.game.Properties.ID
					);
				}
			);
			if (
				Globals.messaging.subscribe("phase", this.phaseMessageHandler)
			) {
				console.log("Game subscribing to `phase` notifications.");
			}
		});
		helpers.onback(this.props.close);
	}
	phaseMessageHandler(payload) {
		if (payload.data.gameID != this.state.game.Properties.ID) {
			return false;
		}
		this.loadGame().then(_ => {
			helpers.snackbar("New phase");
		});
		return true;
	}
	loadGame() {
		return this.props.gamePromise(!!this.state.game).then(game => {
			const promises = [];
			const gameStatesLink = game.Links.find(l => {
				return l.Rel == "game-states";
			});
			if (gameStatesLink) {
				promises.push(
					helpers
						.safeFetch(helpers.createRequest(gameStatesLink.URL))
						.then(res => res.json())
				);
			}
			if (game.Properties.Started) {
				promises.push(
					helpers
						.safeFetch(
							helpers.createRequest(
								game.Links.find(l => {
									return l.Rel == "phases";
								}).URL
							)
						)
						.then(resp => resp.json())
						.then(js => {
							return Promise.resolve(js.Properties);
						})
				);
			} else {
				const variantStartPhase =
					"/Variant/" + game.Properties.Variant + "/Start";
				promises.push(
					helpers.memoize(variantStartPhase, _ => {
						return helpers
							.safeFetch(helpers.createRequest(variantStartPhase))
							.then(resp => resp.json())
							.then(js => {
								js.Properties.PhaseOrdinal = 1;
								return Promise.resolve([js]);
							});
					})
				);
			}
			return Promise.all(promises).then(values => {
				const gameStates = gameStatesLink ? values[0].Properties : null;
				const phases = gameStatesLink ? values[1] : values[0];
				const member = game.Properties.Members.find(e => {
					return e.User.Email == Globals.user.Email;
				});
				const variant = Globals.variants.find(v => {
					return v.Properties.Name == game.Properties.Variant;
				});
				this.setState(
					{
						gameStates: gameStates,
						variant: variant,
						member: member,
						labPlayAs:
							member && member.Nation
								? member.Nation
								: variant.Properties.Nations[0],
						phaseMessages: member
							? (member.NewestPhaseState.Messages || "")
									.split(",")
									.map(this.refinePhaseMessage)
									.filter(m => {
										return !!m;
									})
							: [],
						readyReminder:
							member &&
							game.Properties.Started &&
							!game.Properties.Finished &&
							(!member.NewestPhaseState.NoOrders ||
								!game.Properties.Mustered) &&
							!member.NewestPhaseState.ReadyToResolve,
						game: game,
						phases: phases,
						activePhase: phases[phases.length - 1]
					},
					_ => {
						if (this.state.game.Properties.Finished) {
							this.gameResults.setState({
								open: true
							});
						}
					}
				);
				return Promise.resolve({});
			});
		});
	}
	changeTab(ev, newValue) {
		this.setState({ activeTab: newValue });
	}
	changePhase(ev) {
		this.setState({
			activePhase: this.state.phases.find(phase => {
				return phase.Properties.PhaseOrdinal == ev.target.value;
			})
		});
	}
	render() {
		if (this.state.game) {
			return (
				<React.Fragment>
					<MaterialUI.AppBar
						key="app-bar"
						position="fixed"
						color={
							this.state.laboratoryMode ? "secondary" : "primary"
						}
					>
						<MaterialUI.Toolbar>
							{!this.state.laboratoryMode ? (
								<MaterialUI.IconButton
									onClick={this.props.close}
									key="close"
									edge="start"
									color="secondary"
								>
									{helpers.createIcon("\ue5cd")}
								</MaterialUI.IconButton>
							) : (
								<MaterialUI.IconButton
									onClick={_ => {
										this.setState(
											{
												moreMenuAnchorEl: null,
												laboratoryMode: !this.state
													.laboratoryMode
											},
											_ => {
												if (
													!this.state.laboratoryMode
												) {
													this.loadGame();
												} else {
													gtag(
														"event",
														"enable_lab_mode"
													);
												}
											}
										);
									}}
									key="close"
									edge="start"
									color="primary"
								>
									{helpers.createIcon("\ue5cd")}
								</MaterialUI.IconButton>
							)}
							{!this.state.laboratoryMode &&
							this.state.activePhase &&
							this.state.activePhase.Properties.PhaseOrdinal >
								1 ? (
								<MaterialUI.IconButton
									onClick={this.phaseJumper(-1)}
									key="previous"
									edge="start"
									color="secondary"
								>
									{helpers.createIcon("\ue5cb")}
								</MaterialUI.IconButton>
							) : !this.state.laboratoryMode ? (
								<MaterialUI.Box key="prev-spacer"></MaterialUI.Box>
							) : (
								""
							)}

							{this.state.laboratoryMode ? (
								<MaterialUI.Typography
									variant="h6"
									style={{ marginRight: "8px" }}
								>
									Sandbox
								</MaterialUI.Typography>
							) : (
								""
							)}
							{this.state.activePhase ? (
								<MaterialUI.Select
									/* TODO: This might be a stretch, but Laboratory mode has SOME "real" and some "fake" turns. E.g. in spring 1902 I can move back to Spring 1901 and create an "alternative" 1901 and commit that. 
                  Is it possible to make all the "hypothetical" phases to change color? Maybe let me know in the Discord chat and we can discuss more. */
									/*
									 * Yes it is - 'real' phases have .Properties.ID, while fake phases don't (IIRC).
									 */
									style={
										this.state.laboratoryMode
											? {
													width: "100%",
													minWidth: "0",
													borderBottom:
														"1px solid rgba(253, 226, 181, 0.7)",
													color: "rgb(40, 26, 26)"
											  }
											: {
													width: "100%",
													minWidth: "0",
													borderBottom:
														"1px solid rgba(253, 226, 181, 0.7)",
													color: "#FDE2B5"
											  }
									}
									key="phase-select"
									value={
										this.state.activePhase.Properties
											.PhaseOrdinal
									}
									onChange={this.changePhase}
									label={helpers.phaseName(
										this.state.activePhase
									)}
								>
									{this.state.phases.map(phase => {
										return (
											<MaterialUI.MenuItem
												key={
													phase.Properties
														.PhaseOrdinal
												}
												style={{
													textOverflow: "ellipsis"
												}}
												value={
													phase.Properties
														.PhaseOrdinal
												}
											>
												{helpers.phaseName(phase)}
											</MaterialUI.MenuItem>
										);
									})}
								</MaterialUI.Select>
							) : !this.state.laboratoryMode ? (
								<MaterialUI.Box
									key="curr-spacer"
									width="100%"
								></MaterialUI.Box>
							) : (
								""
							)}
							{this.state.activePhase &&
							this.state.activePhase.Properties.PhaseOrdinal <
								this.state.phases[this.state.phases.length - 1]
									.Properties.PhaseOrdinal ? (
								<MaterialUI.IconButton
									onClick={this.phaseJumper(1)}
									edge="end"
									key="next"
									color="secondary"
								>
									{helpers.createIcon("\ue5cc")}
								</MaterialUI.IconButton>
							) : !this.state.laboratoryMode ? (
								<MaterialUI.Box key="next-spacer"></MaterialUI.Box>
							) : (
								""
							)}

							{!this.state.laboratoryMode ? (
								<MaterialUI.IconButton
									edge="end"
									key="more-icon"
									color="secondary"
									onClick={ev => {
										this.setState({
											moreMenuAnchorEl: ev.currentTarget
										});
									}}
								>
									{helpers.createIcon("\ue5d4")}
								</MaterialUI.IconButton>
							) : (
								""
							)}
							<MaterialUI.Menu
								anchorEl={this.state.moreMenuAnchorEl}
								anchorOrigin={{
									vertical: "top",
									horizontal: "right"
								}}
								transformOrigin={{
									vertical: "top",
									horizontal: "right"
								}}
								onClose={_ => {
									this.setState({ moreMenuAnchorEl: null });
								}}
								open={!!this.state.moreMenuAnchorEl}
							>
								<MaterialUI.MenuItem
									key="game-id"
									onClick={_ => {
										const hrefURL = new URL(location.href);
										helpers
											.copyToClipboard(
												hrefURL.protocol +
													"//" +
													hrefURL.host +
													"/Game/" +
													this.state.game.Properties
														.ID
											)
											.then(
												_ => {
													this.setState({
														moreMenuAnchorEl: null
													});
													helpers.snackbar(
														"Game URL copied to clipboard. Share it to other players."
													);
												},
												err => {
													console.log(err);
												}
											);
										gtag("event", "game_share");
									}}
								>
									{this.state.game.Properties.Started
										? "Share game"
										: "Invite"}
								</MaterialUI.MenuItem>
								<MaterialUI.MenuItem
									key="download-map"
									onClick={_ => {
										this.setState({
											moreMenuAnchorEl: null
										});
										this.dip_map.downloadMap();
										gtag("event", "download_map");
									}}
								>
									Download map
								</MaterialUI.MenuItem>
								{this.state.game.Properties.Started
									? [
											<MaterialUI.MenuItem
												key="Players"
												onClick={_ => {
													this.setState({
														moreMenuAnchorEl: null
													});
													this.GamePlayers.setState({
														open: true
													});
												}}
											>
												Players
											</MaterialUI.MenuItem>,
											<MaterialUI.MenuItem
												key="scores"
												onClick={_ => {
													this.setState({
														moreMenuAnchorEl: null
													});
													this.preliminaryScores.setState(
														{
															open: true
														}
													);
												}}
											>
												Scores
											</MaterialUI.MenuItem>,
											this.state.game.Properties
												.Finished ? (
												<MaterialUI.MenuItem
													key="results"
													onClick={_ => {
														this.setState({
															moreMenuAnchorEl: null
														});
														this.gameResults.setState(
															{
																open: true
															}
														);
													}}
												>
													Results
												</MaterialUI.MenuItem>
											) : (
												""
											)
									  ]
									: ""}
								<MaterialUI.MenuItem
									key="laboratory-mode"
									onClick={_ => {
										this.setState(
											{
												moreMenuAnchorEl: null,
												laboratoryMode: !this.state
													.laboratoryMode
											},
											_ => {
												if (
													!this.state.laboratoryMode
												) {
													this.loadGame();
												} else {
													gtag(
														"event",
														"enable_lab_mode"
													);
												}
											}
										);
									}}
								>
									{this.state.laboratoryMode
										? "Turn off sandbox mode"
										: "Sandbox mode"}
								</MaterialUI.MenuItem>
								<MaterialUI.MenuItem
									key="debug-data"
									onClick={_ => {
										helpers
											.copyToClipboard(
												JSON.stringify(
													this.debugCounters
												)
											)
											.then(_ => {
												this.setState({
													moreMenuAnchorEl: null
												});
												helpers.snackbar(
													"Debug data copied to clipboard"
												);
											});
									}}
								>
									Debug
								</MaterialUI.MenuItem>
							</MaterialUI.Menu>
							{this.state.laboratoryMode ? (
								<MaterialUI.IconButton
									onClick={_ => {
										this.dip_map.labShare();
									}}
									color="primary"
									edge="end"
									style={{ marginLeft: "auto" }}
								>
									{helpers.createIcon("\ue80d")}
								</MaterialUI.IconButton>
							) : (
								""
							)}
						</MaterialUI.Toolbar>
						{!this.state.laboratoryMode &&
						this.state.game.Properties.Started ? (
							<MaterialUI.Tabs
								key="tabs"
								value={this.state.activeTab}
								onChange={this.changeTab}
								display="flex"
								variant="fullWidth"
							>
								<MaterialUI.Tab
									value="map"
									icon={helpers.createIcon("\ue55b")}
								/>
								<MaterialUI.Tab
									value="chat"
									icon={
										this.state.member &&
										this.state.unreadMessages > 0 ? (
											<MaterialUI.Badge
												badgeContent={
													this.state.unreadMessages
												}
											>
												{helpers.createIcon("\ue0b7")}
											</MaterialUI.Badge>
										) : (
											helpers.createIcon("\ue0b7")
										)
									}
								/>
								{this.state.game &&
								this.state.member &&
								!this.state.activePhase.Properties.Resolved ? (
									this.state.member.NewestPhaseState
										.OnProbation ||
									!this.state.member.NewestPhaseState
										.ReadyToResolve ? (
										<MaterialUI.Tab
											value="orders"
											icon={
												<MaterialUI.SvgIcon>
													<path
														d="M9,0 C10.3,0 11.4,0.84 11.82,2 L11.82,2 L16,2 C17.1045695,2 18,2.8954305 18,4 L18,4 L18,18 C18,19.1045695 17.1045695,20 16,20 L16,20 L2,20 C0.8954305,20 0,19.1045695 0,18 L0,18 L0,4 C0,2.8954305 0.8954305,2 2,2 L2,2 L6.18,2 C6.6,0.84 7.7,0 9,0 Z M5,14 L3,14 L3,16 L5,16 L5,14 Z M15,14 L7,14 L7,16 L15,16 L15,14 Z M5,6 L3,6 L3,12 L5,12 L5,6 Z M15,10 L7,10 L7,12 L15,12 L15,10 Z M15,6 L7,6 L7,8 L15,8 L15,6 Z M9,2 C8.44771525,2 8,2.44771525 8,3 C8,3.55228475 8.44771525,4 9,4 C9.55228475,4 10,3.55228475 10,3 C10,2.44771525 9.55228475,2 9,2 Z"
														id="order_open"
													></path>
												</MaterialUI.SvgIcon>
											}
										/>
									) : (
										<MaterialUI.Tab
											value="orders"
											icon={
												<MaterialUI.SvgIcon>
													<path
														d="M9,0 C10.3,0 11.4,0.84 11.82,2 L11.82,2 L16,2 C17.1045695,2 18,2.8954305 18,4 L18,4 L18,18 C18,19.1045695 17.1045695,20 16,20 L16,20 L2,20 C0.8954305,20 0,19.1045695 0,18 L0,18 L0,4 C0,2.8954305 0.8954305,2 2,2 L2,2 L6.18,2 C6.6,0.84 7.7,0 9,0 Z M13.4347826,7 L7.70608696,12.7391304 L4.56521739,9.60869565 L3,11.173913 L7.70608696,15.8695652 L15,8.56521739 L13.4347826,7 Z M9,2 C8.44771525,2 8,2.44771525 8,3 C8,3.55228475 8.44771525,4 9,4 C9.55228475,4 10,3.55228475 10,3 C10,2.44771525 9.55228475,2 9,2 Z"
														id="order_confirmed"
													></path>
												</MaterialUI.SvgIcon>
											}
										/>
									)
								) : (
									<MaterialUI.Tab
										value="orders"
										icon={helpers.createIcon("\ue616")}
									/>
								)}
							</MaterialUI.Tabs>
						) : !this.state.laboratoryMode ? (
							<MaterialUI.Toolbar
								className={helpers.scopedClass(
									"display: flex; justify-content: space-between; min-height: 53px;"
								)}
							>
								<div>
									{this.state.game.Links.find(l => {
										return l.Rel == "join";
									}) ? (
										<MaterialUI.Button
											variant="outlined"
											color="secondary"
											key="join"
											onClick={this.join}
										>
											Join
										</MaterialUI.Button>
									) : (
										""
									)}
									{this.state.game.Links.find(l => {
										return l.Rel == "leave";
									}) ? (
										<MaterialUI.Button
											variant="outlined"
											color="secondary"
											key="leave"
											onClick={this.leave}
										>
											Leave
										</MaterialUI.Button>
									) : (
										""
									)}
								</div>
								<div
									style={{
										display: "flex",
										alignItems: "center"
									}}
								>
									{helpers.createIcon("\ue7fb")}{" "}
									<MaterialUI.Typography
										variant="body2"
										style={{ paddingLeft: "2px" }}
									>
										{this.state.game.Properties.NMembers}/
										{
											this.state.variant.Properties
												.Nations.length
										}{" "}
									</MaterialUI.Typography>
								</div>
							</MaterialUI.Toolbar>
						) : (
							<MaterialUI.Toolbar>
								<MaterialUI.Typography
									variant="body1"
									style={{ marginRight: "8px" }}
								>
									Edit
								</MaterialUI.Typography>
								<MaterialUI.FormControlLabel
									key="edit-mode"
									control={
										<MaterialUI.Switch
											onChange={ev => {
												this.setState({
													labEditMode: !ev.target
														.checked
												});
												this.dip_map.setState({
													labEditMode: !ev.target
														.checked
												});
											}}
											color="primary"
											checked={!this.state.labEditMode}
										/>
									}
									label="Play as"
								/>
								{!this.state.labEditMode ? (
									<MaterialUI.FormControl
										key="play-as"
										className={helpers.scopedClass(
											"flex-grow: 1;"
										)}
									>
										<MaterialUI.Select
											value={this.state.labPlayAs}
											onChange={ev => {
												this.setState({
													labPlayAs: ev.target.value
												});
												this.dip_map.setState({
													labPlayAs: ev.target.value
												});
											}}
											style={{
												width: "100%",
												minWidth: "0",
												borderBottom:
													"1px solid rgba(253, 226, 181, 0.7)",
												color: "rgb(40, 26, 26)"
											}}
										>
											{this.state.variant.Properties.Nations.map(
												nation => {
													return (
														<MaterialUI.MenuItem
															key={nation}
															value={nation}
														>
															{nation}
														</MaterialUI.MenuItem>
													);
												}
											)}
										</MaterialUI.Select>
									</MaterialUI.FormControl>
								) : (
									""
								)}

								<MaterialUI.IconButton
									edge="end"
									onClick={ev => {
										this.dip_map.labResolve();
									}}
									style={{
										marginLeft: "auto",
										color: "rgb(40, 26, 26)"
									}}
								>
									{helpers.createIcon("\ue01f")}
								</MaterialUI.IconButton>
							</MaterialUI.Toolbar>
						)}
					</MaterialUI.AppBar>

					<div
						key="map-container"
						style={
							this.state.laboratoryMode
								? {
										marginTop: "56px",
										height: "calc(100% - 56px)",
										backgroundColor: "black",
										display:
											this.state.activeTab == "map"
												? "block"
												: "none"
								  }
								: {
										marginTop: "105px",
										height: "calc(100% - 105px)",
										backgroundColor: "black",
										display:
											this.state.activeTab == "map"
												? "block"
												: "none"
								  }
						}
					>
						<DipMap
							parentCB={c => {
								this.dip_map = c;
							}}
							debugCount={this.debugCount}
							labPhaseResolve={this.labPhaseResolve}
							serializePhaseState={this.serializePhaseState}
							laboratoryMode={this.state.laboratoryMode}
							isActive={this.state.activeTab == "map"}
							game={this.state.game}
							phase={this.state.activePhase}
							corroborateSubscriber={this.receiveCorroboration}
							variant={this.state.variant}
						/>
					</div>
					{this.state.game.Properties.Started ? (
						<React.Fragment>
							<div
								key="chat-container"
								style={{
									marginTop: "105px",
									height: "calc(100% - 105px)",
									display:
										this.state.activeTab == "chat"
											? "block"
											: "none"
								}}
							>
								<ChatMenu
									onNewGameState={this.onNewGameState}
									gameState={
										this.state.member &&
										this.state.gameStates
											? this.state.gameStates.find(gs => {
													return (
														gs.Properties.Nation ==
														this.state.member.Nation
													);
											  })
											: null
									}
									isActive={this.state.activeTab == "chat"}
									unreadMessages={this.setUnreadMessages}
									phases={this.state.phases}
									game={this.state.game}
									parent={this}
								/>
							</div>
							<div
								key="orders-container"
								style={{
									marginTop: "105px",
									overflowY: "scroll",
									height: "calc(100% - 105px)",
									display:
										this.state.activeTab == "orders"
											? "block"
											: "none"
								}}
							>
								<OrderList
									isActive={this.state.activeTab == "orders"}
									member={this.state.member}
									phase={this.state.activePhase}
									corroboration={this.state.corroboration}
									newPhaseStateHandler={phaseState => {
										this.setState((state, props) => {
											state = Object.assign({}, state);
											state.member.NewestPhaseState =
												phaseState.Properties;
											return state;
										});
										if (this.props.onChangeReady) {
											this.props.onChangeReady();
										}
									}}
									variant={this.state.variant}
								/>
							</div>
							<GamePlayers
								gameStates={this.state.gameStates}
								game={this.state.game}
								variant={this.state.variant}
								onNewGameState={this.onNewGameState}
								parentCB={c => {
									this.GamePlayers = c;
								}}
							/>
							<PreliminaryScores
								phases={this.state.phases}
								variant={this.state.variant}
								parentCB={c => {
									this.preliminaryScores = c;
								}}
							/>
						</React.Fragment>
					) : (
						<NationPreferencesDialog
							parentCB={c => {
								this.nationPreferencesDialog = c;
							}}
							onSelected={null}
						/>
					)}
					<GameResults
						onNewGameState={this.onNewGameState}
						gameState={
							this.state.member && this.state.gameStates
								? this.state.gameStates.find(gs => {
										return (
											gs.Properties.Nation ==
											this.state.member.Nation
										);
								  })
								: null
						}
						game={this.state.game}
						variant={this.state.variant}
						parentCB={c => {
							this.gameResults = c;
						}}
					/>
					<MaterialUI.Snackbar
						anchorOrigin={{
							vertical: "bottom",
							horizontal: "center"
						}}
						open={this.state.readyReminder}
						autoHideDuration={30000}
						onClose={_ => {
							this.setState({ readyReminder: false });
						}}
						message={[
							<MaterialUI.Typography key="ready-warning">
								You haven't confirmed your orders yet.
								{this.state.game.Properties.Mustered
									? ""
									: " For the game to start, all players have to confirm as ready to play."}
							</MaterialUI.Typography>
						].concat(
							this.state.phaseMessages.map(m => {
								return (
									<MaterialUI.Typography key={m}>
										{m}
									</MaterialUI.Typography>
								);
							})
						)}
						action={
							<React.Fragment>
								<MaterialUI.Button
									color="secondary"
									size="small"
									onClick={_ => {
										this.setState({
											activeTab: "orders",
											readyReminder: false
										});
									}}
								>
									View orders
								</MaterialUI.Button>
								<MaterialUI.IconButton
									size="small"
									aria-label="close"
									color="inherit"
									onClick={_ => {
										this.setState({ readyReminder: false });
									}}
								>
									{helpers.createIcon("\ue5cd")}
								</MaterialUI.IconButton>
							</React.Fragment>
						}
					/>
				</React.Fragment>
			);
		} else {
			return "";
		}
	}
}
