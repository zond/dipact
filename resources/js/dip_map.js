import * as helpers from '%{ cb "./helpers.js" }%';

import OrderDialog from '%{ cb "./order_dialog.js" }%';

export default class DipMap extends React.Component {
	constructor(props) {
		super(props);
		this.addOptionHandlers = this.addOptionHandlers.bind(this);
		this.acceptOrders = this.acceptOrders.bind(this);
		this.renderOrders = this.renderOrders.bind(this);
		this.fetchOrders = this.fetchOrders.bind(this);
		this.updateMap = this.updateMap.bind(this);
		this.natCol = this.natCol.bind(this);
		this.map = null;
		this.lastRenderedGameID = null;
	}
	componentDidMount() {
		this.componentDidUpdate();
	}
	shouldComponentUpdate(nextProps, nextState) {
		return (
			!nextProps.game ||
			!this.props.game ||
			nextProps.game.Properties.ID != this.props.game.Properties.ID ||
			!nextProps.phase ||
			!this.props.phase ||
			nextProps.phase.Properties.PhaseOrdinal !=
				this.props.phase.Properties.PhaseOrdinal
		);
	}
	componentDidUpdate() {
		if (this.lastRenderedGameID == this.props.game.Properties.ID) {
			this.updateMap();
			return;
		}

		this.member = this.props.game.Properties.Members.find(e => {
			return e.User.Email == Globals.user.Email;
		});
		this.variant = Globals.variants.find(v => {
			return v.Properties.Name == this.props.game.Properties.Variant;
		});

		helpers.incProgress();
		let variantMapSVG =
			"/Variant/" + this.props.game.Properties.Variant + "/Map.svg";
		let promises = [
			helpers.memoize(
				variantMapSVG,
				helpers
					.safeFetch(helpers.createRequest(variantMapSVG))
					.then(resp => resp.text())
			),
			Promise.all(
				this.variant.Properties.UnitTypes.map(unitType => {
					let variantUnitSVG =
						"/Variant/" +
						this.props.game.Properties.Variant +
						"/Units/" +
						unitType +
						".svg";
					return helpers.memoize(
						variantUnitSVG,
						helpers
							.safeFetch(helpers.createRequest(variantUnitSVG))
							.then(resp => resp.text())
							.then(svg => {
								return {
									name: unitType,
									svg: svg
								};
							})
					);
				})
			)
		];
		Promise.all(promises).then(values => {
			helpers.decProgress();

			let mapSVG = values[0];
			document.getElementById("map").innerHTML = mapSVG;
			this.map = dippyMap($("#map"));

			panzoom(document.getElementById("map-container"), {
				bounds: true,
				boundsPadding: 0.5
			});

			let variantUnits = values[1];
			variantUnits.forEach(unitData => {
				let container = document.createElement("div");
				container.setAttribute("id", "unit" + unitData.name);
				container.innerHTML = unitData.svg;
				document.getElementById("units-div").appendChild(container);
			});
			this.lastRenderedGameID = this.props.game.Properties.ID;
			this.updateMap();
		});
	}
	// This function is wonky, because for historical
	// reasons the diplicity server provides phases in
	// different formats for 'start phase for variant'
	// and 'a phase of an actual game'.
	updateMap() {
		if (!this.props.phase) {
			return;
		}
		let orderPromise = this.fetchOrders();
		let optionsPromise = null;
		if (this.props.phase.Links) {
			let optionsLink = this.props.phase.Links.find(l => {
				return l.Rel == "options";
			});
			if (optionsLink) {
				helpers.incProgress();
				optionsPromise = helpers.memoize(
					optionsLink.URL,
					helpers
						.safeFetch(helpers.createRequest(optionsLink.URL))
						.then(resp => resp.json())
				);
			}
		}
		this.map.removeUnits();
		if (this.props.phase.Properties.Units instanceof Array) {
			this.props.phase.Properties.Units.forEach(unitData => {
				this.map.addUnit(
					"unit" + unitData.Unit.Type,
					unitData.Province,
					this.natCol(unitData.Unit.Nation)
				);
			});
		} else {
			for (let prov in this.props.phase.Properties.Units) {
				let unit = this.props.phase.Properties.Units[prov];
				this.map.addUnit(
					"unit" + unit.Type,
					prov,
					this.natCol(unit.Nation)
				);
			}
		}
		if (this.props.phase.Properties.Dislodgeds instanceof Array) {
			this.props.phase.Properties.Dislodgeds.forEach(disData => {
				this.map.addUnit(
					"unit" + disData.Dislodged.Type,
					disData.Province,
					this.natCol(disData.Dislodged.Nation)
				);
			});
		} else {
			for (let prov in this.props.phase.Properties.Dislodgeds) {
				let unit = this.props.phase.Properties.Units[prov];
				this.map.addUnit(
					"unit" + unit.Type,
					prov,
					this.natCol(unit.Nation),
					true
				);
			}
		}
		let SCs = {};
		if (this.props.phase.Properties.SupplyCenters) {
			SCs = this.props.phase.Properties.SupplyCenters;
		} else {
			this.props.phase.Properties.SCs.forEach(scData => {
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
		if (this.props.phase.Properties.Orders) {
			for (let nat in this.props.phase.Properties.Orders) {
				let orders = this.props.phase.Properties.Orders[nat];
				for (let prov in orders) {
					let order = orders[prov];
					this.map.addOrder([prov] + order, this.natCol(nat));
				}
			}
		}
		if (orderPromise) {
			let renderingPhase = this.props.phase;
			this.renderOrders(orderPromise, this.props.phase).then(_ => {
				if (optionsPromise) {
					optionsPromise.then(js => {
						helpers.decProgress();
						// Skip this if we aren't rendering the same phase anymore.
						if (
							renderingPhase.Properties.PhaseOrdinal !=
							this.props.phase.Properties.PhaseOrdinal
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
		this.renderedPhaseOrdinal = this.props.phase.Properties.PhaseOrdinal;
	}
	fetchOrders() {
		if (!this.props.phase.Links) {
			return null;
		}
		let orderLink = this.props.phase.Links.find(l => {
			return l.Rel == "orders";
		});
		if (!orderLink) {
			return null;
		}
		helpers.incProgress();
		let fetchPromise = helpers
			.safeFetch(helpers.createRequest(orderLink.URL))
			.then(resp => resp.json());
		if (this.props.phase.Properties.Resolved) {
			return helpers.memoize(orderLink.URL, fetchPromise);
		} else {
			return fetchPromise;
		}
	}
	renderOrders(orderPromise, regardingPhase) {
		return orderPromise.then(js => {
			helpers.decProgress();
			// Skip this if we aren't rendering the same phase anymore.
			if (
				regardingPhase.Properties.PhaseOrdinal !=
				this.props.phase.Properties.PhaseOrdinal
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
	addOptionHandlers(options, parts) {
		if (Object.keys(options) == 0) {
			this.props.createOrder(parts).then(_ => {
				this.renderOrders(this.fetchOrders(), this.props.phase).then(
					_ => {
						this.acceptOrders();
					}
				);
			});
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
					Globals.orderDialog.setState({
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
					let srcProvince = Object.keys(options)[0];
					this.addOptionHandlers(
						options[srcProvince].Next,
						[srcProvince].concat(parts)
					);
					break;
			}
		}
	}
	natCol(nat) {
		return this.map.contrasts[this.variant.Properties.Nations.indexOf(nat)];
	}
	render() {
		return (
			<React.Fragment>
				<div id="map-container">
					<div
						style={{ display: "flex", flexWrap: "wrap" }}
						key="map"
						id="map"
					></div>
					<div
						key="game-desc"
						style={{ flexBasis: "100%", fontSize: "x-large" }}
					>
						{this.props.title}
					</div>
				</div>
				<div
					key="units-div"
					style={{ display: "none" }}
					id="units-div"
				></div>
				<OrderDialog key="order-dialog" key="order-dialog" />
			</React.Fragment>
		);
	}
}
