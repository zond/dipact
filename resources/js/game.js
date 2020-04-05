import * as helpers from '%{ cb "/js/helpers.js" }%';

import DipMap from '%{ cb "/js/dip_map.js" }%';
import ChatMenu from '%{ cb "/js/chat_menu.js" }%';

export default class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			activeTab: "map",
			activePhase: null,
			phases: [],
			orders: {},
			game: null
		};
		this.renderedPhaseOrdinal = null;
		this.options = null;
		this.changeTab = this.changeTab.bind(this);
		this.changePhase = this.changePhase.bind(this);
		this.loadGame = this.loadGame.bind(this);
		this.receiveOrders = this.receiveOrders.bind(this);
		this.phaseJumper = this.phaseJumper.bind(this);
		this.phaseMessageHandler = this.phaseMessageHandler.bind(this);
		this.dead = false;
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
	}
	phaseMessageHandler(payload) {
		if (payload.data.message.GameID != this.state.game.Properties.ID) {
			return false;
		}
		this.loadGame().then(_ => {
			alert("New phase");
		});
		return true;
	}
	loadGame() {
		return this.props.gamePromise.then(game => {
			let promise = null;
			if (game.Properties.Started) {
				promise = helpers
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
					});
			} else {
				let variantStartPhase =
					"/Variant/" + game.Properties.Variant + "/Start";
				promise = helpers.memoize(variantStartPhase, _ => {
					return helpers
						.safeFetch(helpers.createRequest(variantStartPhase))
						.then(resp => resp.json())
						.then(js => {
							return Promise.resolve([js]);
						});
				});
			}
			return promise.then(phases => {
				this.setState({
					game: game,
					phases: phases,
					activePhase: phases[phases.length - 1]
				});
				return Promise.resolve({});
			});
		});
	}
	changeTab(ev, newValue) {
		this.setState({ activeTab: newValue });
	}
	gameDesc() {
		return (
			helpers.gameDesc(this.state.game) +
			" - " +
			this.state.game.Properties.Variant
		);
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
							{this.state.game.Properties.Started &&
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

							{this.state.game.Properties.Started &&
							this.state.activePhase ? (
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
							{this.state.game.Properties.Started &&
							this.state.activePhase.Properties.PhaseOrdinal <
								this.state.game.Properties.NewestPhaseMeta[0]
									.PhaseOrdinal ? (
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
							>
								{helpers.createIcon("\ue5d4")}
							</MaterialUI.IconButton>
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
								icon={helpers.createIcon("\ue0b7")}
							/>
							<MaterialUI.Tab
								value="orders"
								icon={helpers.createIcon("\ue616")}
							/>
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
							isActive={this.state.activeTab == "map"}
							game={this.state.game}
							phase={this.state.activePhase}
							title={this.gameDesc()}
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
							isActive={this.state.activeTab == "chat"}
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
						<MaterialUI.List>
							{Object.keys(this.state.orders).map(nation => {
								return (
									<li key={"nation_" + nation}>
										<ul>
											<MaterialUI.ListSubheader
												style={{
													backgroundColor: "white"
												}}
											>
												{nation}
											</MaterialUI.ListSubheader>
											<MaterialUI.List>
												{this.state.orders[nation].map(
													order => {
														return (
															<MaterialUI.ListItem
																key={order.Name}
															>
																<MaterialUI.ListItemText>
																	{order.Name}
																</MaterialUI.ListItemText>
															</MaterialUI.ListItem>
														);
													}
												)}
											</MaterialUI.List>
										</ul>
									</li>
								);
							})}
						</MaterialUI.List>
					</div>
				</React.Fragment>
			);
		} else {
			return "";
		}
	}
}
