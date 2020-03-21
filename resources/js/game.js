import * as helpers from '%{ cb "./helpers.js" }%';

import OrderDialog from '%{ cb "./order_dialog.js" }%';

export default class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			activeTab: "map",
			activePhase: null,
			phases: []
		};
		this.member = props.game.Properties.Members.find(e => {
			return e.User.Email == Globals.user.Email;
		});
		this.variant = Globals.variants.find(v => {
			return v.Properties.Name == this.props.game.Properties.Variant;
		});
		this.map = null;
		this.renderedPhaseOrdinal = null;
		this.options = null;
		this.renderPhase = this.renderPhase.bind(this);
		this.changeTab = this.changeTab.bind(this);
		this.changePhase = this.changePhase.bind(this);
		this.addOptionHandlers = this.addOptionHandlers.bind(this);
		this.setOrder = this.setOrder.bind(this);
		this.acceptOrders = this.acceptOrders.bind(this);
		this.renderOrders = this.renderOrders.bind(this);
		this.fetchOrders = this.fetchOrders.bind(this);
	}
	// This function is wonky, because for historical
	// reasons the diplicity server provides phases in
	// different formats for 'start phase for variant'
	// and 'a phase of an actual game'.
	renderPhase() {
		// Skip this if we don't have an active phase,
		// or if this is the phase we rendered last.
		if (
			this.state.activePhase == null ||
			(this.state.activePhase.Properties.PhaseOrdinal &&
				this.renderedPhaseOrdinal ==
					this.state.activePhase.Properties.PhaseOrdinal)
		) {
			return;
		}
		let orderPromise = this.fetchOrders();
		let optionsPromise = null;
		let optionsLink = this.state.activePhase.Links.find(l => {
			return l.Rel == "options";
		});
		if (optionsLink) {
			helpers.incProgress();
			optionsPromise = fetch(
				helpers.createRequest(optionsLink.URL)
			).then(resp => resp.json());
		}
		if (this.state.activePhase.Properties.Units instanceof Array) {
			this.state.activePhase.Properties.Units.forEach(unitData => {
				this.map.addUnit(
					"unit" + unitData.Unit.Type,
					unitData.Province,
					this.natCol(unitData.Unit.Nation)
				);
			});
		} else {
			for (let prov in this.state.activePhase.Properties.Units) {
				let unit = this.state.activePhase.Properties.Units[prov];
				this.map.addUnit(
					"unit" + unit.Type,
					prov,
					this.natCol(unit.Nation)
				);
			}
		}
		if (this.state.activePhase.Properties.Dislodgeds instanceof Array) {
			this.state.activePhase.Properties.Dislodgeds.forEach(disData => {
				this.map.addUnit(
					"unit" + disData.Dislodged.Type,
					disData.Province,
					this.natCol(disData.Dislodged.Nation)
				);
			});
		} else {
			for (let prov in this.state.activePhase.Properties.Dislodgeds) {
				let unit = this.state.activePhase.Properties.Units[prov];
				this.map.addUnit(
					"unit" + unit.Type,
					prov,
					this.natCol(unit.Nation),
					true
				);
			}
		}
		let SCs = {};
		if (this.state.activePhase.Properties.SupplyCenters) {
			SCs = this.state.activePhase.Properties.SupplyCenters;
		} else {
			this.state.activePhase.Properties.SCs.forEach(scData => {
				SCs[scData.Province] = scData.Owner;
			});
		}
		for (let prov in this.variant.Properties.Graph.Nodes) {
			let node = this.variant.Properties.Graph.Nodes[prov];
			if (node.SC && SCs[prov]) {
				this.map.colorProvince(prov, this.natCol(SCs[prov]));
			} else {
				this.map.hideProvince(prov);
			}
		}
		this.map.showProvinces();
		if (this.state.activePhase.Properties.Orders) {
			for (let nat in this.state.activePhase.Properties.Orders) {
				let orders = this.state.activePhase.Properties.Orders[nat];
				for (let prov in orders) {
					let order = orders[prov];
					this.map.addOrder([prov] + order, this.natCol(nat));
				}
			}
		}
		if (orderPromise) {
			let renderingPhase = this.state.activePhase;
			this.renderOrders(orderPromise, this.state.activePhase).then(_ => {
				if (optionsPromise) {
					optionsPromise.then(js => {
						helpers.decProgress();
						// Skip this if we aren't rendering the same phase anymore.
						if (
							renderingPhase.Properties.PhaseOrdinal !=
							this.state.activePhase.Properties.PhaseOrdinal
						) {
							return;
						}
						this.options = js.Properties;
						this.acceptOrders();
					});
				}
			});
		}
		// Assume we are done now, even if we possibly haven't rendered the orders yet.
		this.renderedPhaseOrdinal = this.state.activePhase.Properties.PhaseOrdinal;
	}
	fetchOrders() {
		let orderLink = this.state.activePhase.Links.find(l => {
			return l.Rel == "orders";
		});
		if (orderLink) {
			helpers.incProgress();
			return fetch(helpers.createRequest(orderLink.URL)).then(resp =>
				resp.json()
			);
		} else {
			return null;
		}
	}
	renderOrders(orderPromise, regardingPhase) {
		return orderPromise.then(js => {
			helpers.decProgress();
			// Skip this if we aren't rendering the same phase anymore.
			if (
				regardingPhase.Properties.PhaseOrdinal !=
				this.state.activePhase.Properties.PhaseOrdinal
			) {
				return Promise.resolve({});
			}
			this.map.removeOrders();
			js.Properties.forEach(orderData => {
				this.map.addOrder(
					orderData.Properties.Parts,
					this.natCol(orderData.Properties.Nation)
				);
			});
			if (regardingPhase.Properties.Resolutions) {
				regardingPhase.Properties.Resolutions.forEach(res => {
					if (res.Resolution != "OK") {
						this.map.addCross(res.Province, "#ff0000");
					}
				});
			}
			return Promise.resolve({});
		});
	}
	acceptOrders() {
		this.addOptionHandlers(this.options, []);
	}
	setOrder(parts) {
		let set_order_link = this.state.activePhase.Links.find(l => {
			return l.Rel == "create-order";
		});
		if (set_order_link) {
			fetch(
				helpers.createRequest(set_order_link.URL, {
					method: set_order_link.Method,
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify({ Parts: parts.slice(1) })
				})
			).then(resp => {
				this.renderOrders(
					this.fetchOrders(),
					this.state.activePhase
				).then(_ => {
					this.acceptOrders();
				});
			});
		}
	}
	addOptionHandlers(options, parts) {
		if (Object.keys(options) == 0) {
			this.setOrder(parts);
		} else {
			let type = null;
			for (let option in options) {
				if (type == null) {
					type = options[option].Type;
				} else if (type != options[option].Type) {
					throw "Can't use multiple types in the same level of options.";
				}
			}
			switch (type) {
				case "Province":
					for (let prov in options) {
						this.map.addClickListener(
							prov,
							prov => {
								this.map.clearClickListeners();
								this.addOptionHandlers(
									options[prov].Next,
									parts.concat(prov)
								);
							},
							{ touch: true }
						);
					}
					break;
				case "OrderType":
					Globals.order_dialog.setState({
						open: true,
						options: Object.keys(options),
						onClick: ord => {
							this.addOptionHandlers(
								options[ord].Next,
								parts.concat(ord)
							);
						}
					});
					break;
				case "SrcProvince":
					let src_province = Object.keys(options)[0];
					this.addOptionHandlers(
						options[src_province].Next,
						[src_province].concat(parts)
					);
					break;
			}
		}
	}
	natCol(nat) {
		return this.map.contrasts[this.variant.Properties.Nations.indexOf(nat)];
	}
	componentDidMount() {
		helpers.incProgress();
		let promises = [
			fetch(
				helpers.createRequest(
					"/Variant/" +
						this.props.game.Properties.Variant +
						"/Map.svg"
				)
			).then(resp => resp.text()),
			Promise.all(
				this.variant.Properties.UnitTypes.map(unitType => {
					return fetch(
						helpers.createRequest(
							"/Variant/" +
								this.props.game.Properties.Variant +
								"/Units/" +
								unitType +
								".svg"
						)
					)
						.then(resp => resp.text())
						.then(svg => {
							return {
								name: unitType,
								svg: svg
							};
						});
				})
			)
		];
		if (this.props.game.Properties.Started) {
			promises.push(
				fetch(
					helpers.createRequest(
						this.props.game.Links.find(l => {
							return l.Rel == "phases";
						}).URL
					)
				).then(resp => resp.json())
			);
		}
		Promise.all(promises).then(values => {
			helpers.decProgress();
			let mapSVG = values[0];
			document.getElementById("map").innerHTML = mapSVG;
			this.map = dippyMap($("#map"));
			panzoom(document.getElementById("map-wrapper"), {
				bounds: true,
				boundsPadding: 0.5
			});

			let variantUnits = values[1];
			variantUnits.forEach(unitData => {
				let container = document.createElement("div");
				container.setAttribute("id", "unit" + unitData.name);
				container.innerHTML = unitData.svg;
				document.getElementById("units").appendChild(container);
			});
			if (this.props.game.Properties.Started) {
				let phases = values[2].Properties;
				this.setState(
					{
						phases: phases,
						activePhase: phases[phases.length - 1],
						gameDesc: this.gameDesc()
					},
					this.renderPhase
				);
			} else {
				helpers.incProgress();
				fetch(
					helpers.createRequest(
						"/Variant/" +
							this.props.game.Properties.Variant +
							"/Start"
					)
				)
					.then(resp => resp.json())
					.then(js => {
						helpers.decProgress();
						let phases = [js];
						this.setState(
							{
								phases: phases,
								activePhase: phases[0],
								gameDesc: this.gameDesc()
							},
							this.renderPhase
						);
					});
			}
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
		this.map.clearClickListeners();
		this.setState(
			{
				activePhase: this.state.phases.find(phase => {
					return phase.Properties.PhaseOrdinal == ev.target.value;
				})
			},
			_ => {
				this.renderPhase();
				if (!this.state.activePhase.Properties.Resolved) {
					this.acceptOrders();
				}
			}
		);
	}
	render() {
		return [
			<MaterialUI.AppBar key="app-bar" position="static">
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
								this.state.activePhase.Properties.PhaseOrdinal
							}
							onChange={this.changePhase}
							label={this.phaseName(this.state.activePhase)}
						>
							{this.state.phases.map(phase => {
								return (
									<MaterialUI.MenuItem
										key={phase.Properties.PhaseOrdinal}
										value={phase.Properties.PhaseOrdinal}
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
			</MaterialUI.AppBar>,
			<div
				key="map-container"
				style={{
					display: this.state.activeTab == "map" ? "block" : "none"
				}}
			>
				<div id="map-wrapper" key="map-wrapper">
					<div
						style={{ display: "flex", flexWrap: "wrap" }}
						key="map"
						id="map"
					></div>
					<div
						key="game-desc"
						style={{ flexBasis: "100%", fontSize: "x-large" }}
					>
						{this.state.gameDesc}
					</div>
				</div>
			</div>,
			<MaterialUI.BottomNavigation
				style={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
				key="bottom-navigation"
				value={this.state.activeTab}
				onChange={this.changeTab}
			>
				<MaterialUI.BottomNavigationAction
					key="map"
					label="Map"
					value="map"
					icon={helpers.createIcon("\ue55b")}
				/>
				<MaterialUI.BottomNavigationAction
					label="Chat"
					key="chat"
					value="chat"
					icon={helpers.createIcon("\ue0b7")}
				/>
				<MaterialUI.BottomNavigationAction
					label="Orders"
					key="orders"
					value="orders"
					icon={helpers.createIcon("\ue616")}
				/>
			</MaterialUI.BottomNavigation>,
			<div key="units-div" style={{ display: "none" }} id="units"></div>,
			<OrderDialog key="order-dialog" key="order-dialog" />
		];
	}
}
