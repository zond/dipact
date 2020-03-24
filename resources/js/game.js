import * as helpers from '%{ cb "./helpers.js" }%';

import DipMap from '%{ cb "./dip_map.js" }%';
import ChatMenu from '%{ cb "./chat_menu.js" }%';

export default class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			activeTab: "map",
			activePhase: null,
			phases: []
		};
		this.renderedPhaseOrdinal = null;
		this.options = null;
		this.changeTab = this.changeTab.bind(this);
		this.changePhase = this.changePhase.bind(this);
		this.createOrder = this.createOrder.bind(this);
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
	componentDidMount() {
		let promise = null;
		if (this.props.game.Properties.Started) {
			promise = helpers
				.safeFetch(
					helpers.createRequest(
						this.props.game.Links.find(l => {
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
				"/Variant/" + this.props.game.Properties.Variant + "/Start";
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
			this.setState({
				phases: phases,
				activePhase: phases[phases.length - 1]
			});
		});
	}
	changeTab(ev, newValue) {
		this.setState({ activeTab: newValue });
	}
	gameDesc() {
		return (
			helpers.gameDesc(this.props.game) +
			" - " +
			this.props.game.Properties.Variant
		);
	}
	phaseName(phase) {
		return (
			phase.Properties.Season +
			" " +
			phase.Properties.Year +
			", " +
			phase.Properties.Type
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
		return (
			<React.Fragment>
				<MaterialUI.AppBar key="app-bar" position="fixed">
					<MaterialUI.Toolbar>
						<MaterialUI.IconButton
							onClick={this.props.close}
							key="close"
							edge="start"
						>
							{helpers.createIcon("\ue5cd")}
						</MaterialUI.IconButton>
						{this.props.game.Properties.Started &&
						this.state.activePhase ? (
							<MaterialUI.Select
								style={{ width: "100%" }}
								key="phase-select"
								value={
									this.state.activePhase.Properties
										.PhaseOrdinal
								}
								onChange={this.changePhase}
								label={this.phaseName(this.state.activePhase)}
							>
								{this.state.phases.map(phase => {
									return (
										<MaterialUI.MenuItem
											key={phase.Properties.PhaseOrdinal}
											value={
												phase.Properties.PhaseOrdinal
											}
										>
											{this.phaseName(phase)}
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
						display:
							this.state.activeTab == "map" ? "block" : "none"
					}}
				>
					<DipMap
						game={this.props.game}
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
							this.state.activeTab == "chat" ? "block" : "none"
					}}
				>
					<ChatMenu game={this.props.game} />
				</div>
			</React.Fragment>
		);
	}
}
