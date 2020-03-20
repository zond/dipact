import * as helpers from '%{ cb "./helpers.js" }%';

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
		this.map = null;
		this.variant = null;
		this.renderedPhaseOrdinal = null;
		this.renderPhase = this.renderPhase.bind(this);
		this.changeTab = this.changeTab.bind(this);
		this.changePhase = this.changePhase.bind(this);
		this.addOptionHandlers = this.addOptionHandlers.bind(this);
		this.setOrder = this.setOrder.bind(this);
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
			this.renderedPhaseOrdinal ==
				this.state.activePhase.Properties.PhaseOrdinal
		) {
			return;
		}
		let orderPromise = null;
		let orderLink = this.state.activePhase.Links.find(l => {
			return l.Rel == "orders";
		});
		if (orderLink) {
			helpers.incProgress();
			orderPromise = fetch(
				helpers.createRequest(orderLink.URL)
			).then(resp => resp.json());
		}
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
			orderPromise.then(js => {
				helpers.decProgress();
				// Skip this if we aren't rendering the same phase anymore.
				if (
					renderingPhase.Properties.PhaseOrdinal !=
					this.state.activePhase.Properties.PhaseOrdinal
				) {
					return;
				}
				this.map.removeOrders();
				js.Properties.forEach(orderData => {
					this.map.addOrder(
						orderData.Properties.Parts,
						this.natCol(orderData.Properties.Nation)
					);
				});
				if (renderingPhase.Properties.Resolutions) {
					renderingPhase.Properties.Resolutions.forEach(res => {
						if (res.Resolution != "OK") {
							this.map.addCross(res.Province, "#ff0000");
						}
					});
				}
				if (optionsPromise) {
					optionsPromise.then(js => {
						helpers.decProgress();
						if (
							renderingPhase.Properties.PhaseOrdinal !=
							this.state.activePhase.Properties.PhaseOrdinal
						) {
							return;
						}
						console.log("options", js);
						this.addOptionHandlers(js.Properties, []);
					});
				}
			});
		}
		// Assume we are done now, even if we possibly haven't rendered the orders yet.
		this.renderedPhaseOrdinal = this.state.activePhase.Properties.PhaseOrdinal;
	}
	setOrder(parts) {
		console.log("set order", parts);
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
					console.log("Options are", options);
					throw "Can't use multiple types in the same level of options.";
				}
			}
			switch (type) {
				case "Province":
					for (let prov in options) {
						this.map.addClickListener(prov, prov => {
							this.addOptionHandlers(
								options[prov].Next,
								parts.concat(prov)
							);
						});
					}
					break;
				case "OrderType":
					console.log(
						"here we ask what order the user wants among",
						Object.keys(options)
					);
					break;
				case "SrcProvince":
					console.log(
						"here we just add the next-value to the content and move on to",
						options[Object.keys(options)[0]].Next
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
			fetch(
				helpers.createRequest(
					"/Variant/" + this.props.game.Properties.Variant
				)
			)
				.then(resp => resp.json())
				.then(js => {
					let promises = [Promise.resolve(js)];
					js.Properties.UnitTypes.forEach(unitType => {
						promises.push(
							fetch(
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
								})
						);
					});
					return Promise.all(promises);
				})
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

			let variantData = values[1];
			this.variant = variantData[0];
			variantData.slice(1).forEach(unitData => {
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
		this.setState(
			{
				activePhase: this.state.phases.find(phase => {
					return phase.Properties.PhaseOrdinal == ev.target.value;
				})
			},
			this.renderPhase
		);
	}
	render() {
		return [
			<MaterialUI.AppBar key="app-bar" position="static">
				<MaterialUI.Toolbar>
					<MaterialUI.IconButton
						onClick={this.props.close}
						edge="start"
					>
						{helpers.createIcon("\ue5cd")}
					</MaterialUI.IconButton>
					{this.state.activePhase != null ? (
						<MaterialUI.Select
							style={{ width: "100%" }}
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
						<MaterialUI.Box width="100%"></MaterialUI.Box>
					)}
					<MaterialUI.IconButton edge="end">
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
				<div id="map-wrapper">
					<div
						style={{ display: "flex", flexWrap: "wrap" }}
						id="map"
					></div>
					<div style={{ flexBasis: "100%", fontSize: "x-large" }}>
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
					label="Map"
					value="map"
					icon={helpers.createIcon("\ue55b")}
				/>
				<MaterialUI.BottomNavigationAction
					label="Chat"
					value="chat"
					icon={helpers.createIcon("\ue0b7")}
				/>
				<MaterialUI.BottomNavigationAction
					label="Orders"
					value="orders"
					icon={helpers.createIcon("\ue616")}
				/>
			</MaterialUI.BottomNavigation>,
			<div key="units-div" style={{ display: "none" }} id="units"></div>
		];
	}
}
