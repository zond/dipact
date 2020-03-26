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
			game: null
		};
		this.renderedPhaseOrdinal = null;
		this.options = null;
		this.changeTab = this.changeTab.bind(this);
		this.changePhase = this.changePhase.bind(this);
		this.createOrder = this.createOrder.bind(this);
		this.close = this.close.bind(this);
		this.props.gamePromise.then(game => {
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
			promise.then(phases => {
				this.setState((state, props) => {
					state = Object.assign({}, state);

					helpers.urlMatch(
						[
							[
								/^\/Game\/([^\/]+)\/Channel\/([^\/]+)\/Messages$/,
								match => {
									state.activeTab = "chat";
								}
							]
						],
						_ => {
							history.pushState(
								"",
								"",
								"/Game/" + game.Properties.ID
							);
						}
					);
					state.game = game;
					state.phases = phases;
					state.activePhase = phases[phases.length - 1];
					return state;
				});
			});
		});
	}
	close() {
		history.pushState("", "", "/");
		this.props.close();
	}
	createOrder(parts) {
		let setOrderLink = this.state.activePhase.Links.find(l => {
			return l.Rel == "create-order";
		});
		if (setOrderLink) {
			return helpers.safeFetch(
				helpers.createRequest(setOrderLink.URL, {
					method: setOrderLink.Method,
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify({ Parts: parts.slice(1) })
				})
			);
		} else {
			return Promise.resolve({});
		}
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
								onClick={this.close}
								key="close"
								edge="start"
							>
								{helpers.createIcon("\ue5cd")}
							</MaterialUI.IconButton>
							{this.state.game.Properties.Started &&
							this.state.activePhase ? (
								<MaterialUI.Select
									style={{ width: "100%" }}
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
									key="spacer"
									width="100%"
								></MaterialUI.Box>
							)}
							<MaterialUI.IconButton edge="end" key="more-icon">
								{helpers.createIcon("\ue5d4")}
							</MaterialUI.IconButton>
						</MaterialUI.Toolbar>
						<MaterialUI.Tabs
							key="tabs"
							value={this.state.activeTab}
							onChange={this.changeTab}
							display="flex"
							className="game-tabs"
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
							display:
								this.state.activeTab == "map" ? "block" : "none"
						}}
					>
						<DipMap
							isActive={this.state.activeTab == "map"}
							game={this.state.game}
							phase={this.state.activePhase}
							title={this.gameDesc()}
							createOrder={this.createOrder}
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
						/>
					</div>
				</React.Fragment>
			);
		} else {
			return "";
		}
	}
}
