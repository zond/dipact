import * as helpers from '%{ cb "/js/helpers.js" }%';

import DipMap from '%{ cb "/js/dip_map.js" }%';
import ChatMenu from '%{ cb "/js/chat_menu.js" }%';
import OrderList from '%{ cb "/js/order_list.js" }%';
import GameMetadata from '%{ cb "/js/game_metadata.js" }%';
import GameResults from '%{ cb "/js/game_results.js" }%';
import PreliminaryScores from '%{ cb "/js/preliminary_scores.js" }%';

export default class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			readyReminder: false,
			activeTab: "map",
			activePhase: null,
			phases: [],
			orders: {},
			variant: null,
			member: null,
			unreadMessages: 0,
			laboratoryMode: false,
			gameStates: [],
			game: null
		};
		this.renderedPhaseOrdinal = null;
		this.options = null;
		this.gameMetadata = null;
		this.gameResults = null;
		this.preliminaryScores = null;
		this.changeTab = this.changeTab.bind(this);
		this.changePhase = this.changePhase.bind(this);
		this.loadGame = this.loadGame.bind(this);
		this.receiveOrders = this.receiveOrders.bind(this);
		this.phaseJumper = this.phaseJumper.bind(this);
		this.phaseMessageHandler = this.phaseMessageHandler.bind(this);
		this.setUnreadMessages = this.setUnreadMessages.bind(this);
		this.labPhaseResolve = this.labPhaseResolve.bind(this);
		this.serializePhaseState = this.serializePhaseState.bind(this);
		this.newGameState = this.newGameState.bind(this);
		this.dead = false;
	}
	newGameState(gameState) {
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
	receiveOrders(orders) {
		let natOrders = {};
		orders.forEach(order => {
			if (!natOrders[order.Properties.Nation]) {
				natOrders[order.Properties.Nation] = [];
			}
			natOrders[order.Properties.Nation].push(order);
		});
		this.setState({ orders: natOrders });
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
									{ to: "string" }
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
		return this.props.gamePromise.then(game => {
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
				let member = game.Properties.Members.find(e => {
					return e.User.Email == Globals.user.Email;
				});
				this.setState(
					{
						gameStates: gameStates,
						variant: Globals.variants.find(v => {
							return v.Properties.Name == game.Properties.Variant;
						}),
						member: member,
						readyReminder:
							!game.Properties.Finished &&
							member &&
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
					<MaterialUI.AppBar key="app-bar" position="fixed">
						<MaterialUI.Toolbar>
							<MaterialUI.IconButton
								onClick={this.props.close}
								key="close"
								edge="start"
								color="secondary"
							>
								{helpers.createIcon("\ue5cd")}
							</MaterialUI.IconButton>
							{this.state.activePhase &&
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
							) : (
								<MaterialUI.Box key="prev-spacer"></MaterialUI.Box>
							)}

							{this.state.activePhase ? (
								<MaterialUI.Select
									/* below I define the colours using Hex, but this should be using MaterialUI primary or secondary colour. Haven't figured out how to yet */
									style={{
										width: "100%",
										minWidth: "0",
										borderBottom:
											"1px solid rgba(253, 226, 181, 0.7)",
										color: "#FDE2B5"
									}}
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
							) : (
								<MaterialUI.Box
									key="curr-spacer"
									width="100%"
								></MaterialUI.Box>
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
							) : (
								<MaterialUI.Box key="next-spacer"></MaterialUI.Box>
							)}
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
									key="metadata"
									onClick={_ => {
										this.setState({
											moreMenuAnchorEl: null
										});
										this.gameMetadata.setState({
											open: true
										});
									}}
								>
									Metadata
								</MaterialUI.MenuItem>
								<MaterialUI.MenuItem
									key="scores"
									onClick={_ => {
										this.setState({
											moreMenuAnchorEl: null
										});
										this.preliminaryScores.setState({
											open: true
										});
									}}
								>
									Scores
								</MaterialUI.MenuItem>
								{this.state.game.Properties.Finished ? (
									<MaterialUI.MenuItem
										key="results"
										onClick={_ => {
											this.setState({
												moreMenuAnchorEl: null
											});
											this.gameResults.setState({
												open: true
											});
										}}
									>
										Results
									</MaterialUI.MenuItem>
								) : (
									""
								)}
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
												}
											}
										);
									}}
								>
									{this.state.laboratoryMode
										? "Disable lab mode"
										: "Enable lab mode"}
								</MaterialUI.MenuItem>
							</MaterialUI.Menu>
						</MaterialUI.Toolbar>
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
					</MaterialUI.AppBar>
					<div
						key="map-container"
						style={{
							marginTop: "105px",
							height: "calc(100% - 105px)",
							backgroundColor: "black",
							display:
								this.state.activeTab == "map" ? "block" : "none"
						}}
					>
						<DipMap
							labPhaseResolve={this.labPhaseResolve}
							serializePhaseState={this.serializePhaseState}
							laboratoryMode={this.state.laboratoryMode}
							isActive={this.state.activeTab == "map"}
							game={this.state.game}
							phase={this.state.activePhase}
							ordersSubscriber={this.receiveOrders}
						/>
					</div>
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
							newGameState={this.newGameState}
							gameState={
								this.state.member
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
							member={this.state.member}
							phase={this.state.activePhase}
							orders={this.state.orders}
							newPhaseStateHandler={phaseState => {
								this.setState((state, props) => {
									state = Object.assign({}, state);
									state.member.NewestPhaseState =
										phaseState.Properties;
									return state;
								});
							}}
							variant={this.state.variant}
						/>
					</div>
					<GameMetadata
						gameStates={this.state.gameStates}
						game={this.state.game}
						variant={this.state.variant}
						newGameState={this.newGameState}
						parentCB={c => {
							this.gameMetadata = c;
						}}
					/>
					<GameResults
						newGameState={this.newGameState}
						gameState={
							this.state.member
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
					<PreliminaryScores
						phases={this.state.phases}
						variant={this.state.variant}
						parentCB={c => {
							this.preliminaryScores = c;
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
						message="You haven't confirmed your orders yet"
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
