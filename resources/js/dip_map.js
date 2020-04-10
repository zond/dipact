import * as helpers from '%{ cb "/js/helpers.js" }%';

import OrderDialog from '%{ cb "/js/order_dialog.js" }%';

export default class DipMap extends React.Component {
	constructor(props) {
		super(props);
		this.addOptionHandlers = this.addOptionHandlers.bind(this);
		this.acceptOrders = this.acceptOrders.bind(this);
		this.renderOrders = this.renderOrders.bind(this);
		this.loadOrdersPromise = this.loadOrdersPromise.bind(this);
		this.updateMap = this.updateMap.bind(this);
		this.createOrder = this.createOrder.bind(this);
		this.deleteOrder = this.deleteOrder.bind(this);
		this.snapshotSVG = this.snapshotSVG.bind(this);
		this.mapDims = [null, null];
		this.map = null;
		this.orders = null;
		this.lastRenderedGameID = null;
		this.orderDialog = null;
	}
	snapshotSVG() {
		let mapEl = document.getElementById("map");
		let serializedSVG = btoa(
			new XMLSerializer().serializeToString(mapEl.children[0])
		);
		let snapshotImage = document.createElement("img");
		snapshotImage.style.width = this.mapDims[0];
		snapshotImage.style.height = this.mapDims[1];
		snapshotImage.src = "data:image/svg+xml;base64," + serializedSVG;
		snapshotImage.addEventListener("load", _ => {
			let snapshotCanvas = document.createElement("canvas");
			snapshotCanvas.setAttribute("height", this.mapDims[1]);
			snapshotCanvas.setAttribute("width", this.mapDims[0]);
			snapshotCanvas.style.height = this.mapDims[1];
			snapshotCanvas.style.width = this.mapDims[0];
			snapshotCanvas.getContext("2d").drawImage(snapshotImage, 0, 0);
			let snapshotData = snapshotCanvas.toDataURL("image/png");
			let snapshotEl = document.getElementById("mapSnapshot");
			snapshotEl.src = snapshotData;
		});
	}
	createOrder(parts) {
		let setOrderLink = this.props.phase.Links.find(l => {
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
	deleteOrder(prov) {
		let order = this.orders.Properties.find(o => {
			return o.Properties.Parts[0] == prov;
		});
		if (order) {
			let deleteOrderLink = order.Links.find(l => {
				return l.Rel == "delete";
			});
			if (deleteOrderLink) {
				return helpers.safeFetch(
					helpers.createRequest(deleteOrderLink.URL, {
						method: deleteOrderLink.Method
					})
				);
			}
		} else {
			return Promise.resolve({});
		}
	}
	componentDidMount() {
		this.componentDidUpdate();
	}
	shouldComponentUpdate(nextProps, nextState) {
		return (
			nextProps.isActive != this.props.isActive ||
			!nextProps.game ||
			!this.props.game ||
			nextProps.game.Properties.ID != this.props.game.Properties.ID ||
			!nextProps.phase ||
			!this.props.phase ||
			nextProps.phase.Properties.PhaseOrdinal !=
				this.props.phase.Properties.PhaseOrdinal
		);
	}
	componentDidUpdate(prevProps, prevState, snapshot) {
		if (this.lastRenderedGameID == this.props.game.Properties.ID) {
			this.updateMap(true).then(this.snapshotSVG);
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
			helpers.memoize(variantMapSVG, _ => {
				return helpers
					.safeFetch(helpers.createRequest(variantMapSVG))
					.then(resp => resp.text());
			}),
			Promise.all(
				this.variant.Properties.UnitTypes.map(unitType => {
					let variantUnitSVG =
						"/Variant/" +
						this.props.game.Properties.Variant +
						"/Units/" +
						unitType +
						".svg";
					return helpers.memoize(variantUnitSVG, _ => {
						return helpers
							.safeFetch(helpers.createRequest(variantUnitSVG))
							.then(resp => resp.text())
							.then(svg => {
								return {
									name: unitType,
									svg: svg
								};
							});
					});
				})
			)
		];
		Promise.all(promises).then(values => {
			helpers.decProgress();

			let mapSVG = values[0];
			let mapEl = document.getElementById("map");
			mapEl.innerHTML = mapSVG;
			this.mapDims = [mapEl.clientWidth, mapEl.clientHeight];
			this.map = dippyMap($("#map"));

			var panzoomInstance = panzoom(
				document.getElementById("map-container"),
				{
					bounds: true,
					boundsPadding: 0.5,
					onZoom: e => {
						document.getElementById("map").style.display = "none";
						document.getElementById("mapSnapshot").style.display =
							"flex";
					},
					onZoomend: e => {
						document.getElementById("map").style.display = "flex";
						document.getElementById("mapSnapshot").style.display =
							"none";
					}
				}
			);
			let variantUnits = values[1];
			variantUnits.forEach(unitData => {
				let container = document.createElement("div");
				container.setAttribute("id", "unit" + unitData.name);
				container.innerHTML = unitData.svg;
				document.getElementById("units-div").appendChild(container);
			});
			if (this.props.isActive) {
				this.lastRenderedGameID = this.props.game.Properties.ID;
			}
			this.updateMap().then(this.snapshotSVG);
		});
	}
	// This function is wonky, because for historical
	// reasons the diplicity server provides phases in
	// different formats for 'start phase for variant'
	// and 'a phase of an actual game'.
	updateMap(silent = false) {
		if (!this.props.phase) {
			return Promise.resolve({});
		}
		let orderPromise = this.loadOrdersPromise(silent);
		let optionsPromise = null;
		if (this.props.phase.Links) {
			let optionsLink = this.props.phase.Links.find(l => {
				return l.Rel == "options";
			});
			if (optionsLink) {
				if (!silent) {
					helpers.incProgress();
				}
				optionsPromise = helpers.memoize(optionsLink.URL, _ => {
					return helpers
						.safeFetch(helpers.createRequest(optionsLink.URL))
						.then(resp => resp.json());
				});
			}
		}
		this.map.removeUnits();
		if (this.props.phase.Properties.Units instanceof Array) {
			this.props.phase.Properties.Units.forEach(unitData => {
				this.map.addUnit(
					"unit" + unitData.Unit.Type,
					unitData.Province,
					helpers.natCol(unitData.Unit.Nation, this.variant)
				);
			});
		} else {
			for (let prov in this.props.phase.Properties.Units) {
				let unit = this.props.phase.Properties.Units[prov];
				this.map.addUnit(
					"unit" + unit.Type,
					prov,
					helpers.natCol(unit.Nation, this.variant)
				);
			}
		}
		if (this.props.phase.Properties.Dislodgeds instanceof Array) {
			this.props.phase.Properties.Dislodgeds.forEach(disData => {
				this.map.addUnit(
					"unit" + disData.Dislodged.Type,
					disData.Province,
					helpers.natCol(disData.Dislodged.Nation, this.variant)
				);
			});
		} else {
			for (let prov in this.props.phase.Properties.Dislodgeds) {
				let unit = this.props.phase.Properties.Units[prov];
				this.map.addUnit(
					"unit" + unit.Type,
					prov,
					helpers.natCol(unit.Nation, this.variant),
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
				this.map.colorProvince(
					prov,
					helpers.natCol(SCs[prov], this.variant)
				);
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
					this.map.addOrder(
						[prov] + order,
						helpers.natCol(nat, this.variant)
					);
				}
			}
		}
		if (orderPromise) {
			let renderingPhase = this.props.phase;
			return this.renderOrders(
				orderPromise,
				this.props.phase,
				silent
			).then(_ => {
				if (optionsPromise) {
					return optionsPromise.then(js => {
						if (!silent) {
							helpers.decProgress();
						}
						// Skip this if we aren't rendering the same phase anymore.
						if (
							renderingPhase.Properties.PhaseOrdinal !=
							this.props.phase.Properties.PhaseOrdinal
						) {
							return;
						}
						this.options = js.Properties;
						this.acceptOrders();
						return Promise.resolve({});
					});
				} else {
					this.map.clearClickListeners();
					return Promise.resolve({});
				}
			});
		} else {
			// Assume we are done now, even if we possibly haven't rendered the orders yet.
			this.renderedPhaseOrdinal = this.props.phase.Properties.PhaseOrdinal;
			return Promise.resolve({});
		}
	}
	loadOrdersPromise(silent = false) {
		if (!this.props.phase.Links) {
			return null;
		}
		let orderLink = this.props.phase.Links.find(l => {
			return l.Rel == "orders";
		});
		if (!orderLink) {
			return null;
		}
		if (!silent) {
			helpers.incProgress();
		}
		let fetchPromiseFunc = _ => {
			return helpers
				.safeFetch(helpers.createRequest(orderLink.URL))
				.then(resp => resp.json());
		};
		let returnValue = null;
		if (this.props.phase.Properties.Resolved) {
			returnValue = helpers.memoize(orderLink.URL, fetchPromiseFunc);
		} else {
			returnValue = fetchPromiseFunc();
		}
		return returnValue.then(js => {
			this.orders = js;
			this.props.ordersSubscriber(js.Properties);
			return Promise.resolve(js);
		});
	}
	renderOrders(orderPromise, regardingPhase, silent = false) {
		return orderPromise.then(js => {
			if (!silent) {
				helpers.decProgress();
			}
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
					helpers.natCol(orderData.Properties.Nation, this.variant)
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
			this.createOrder(parts).then(_ => {
				this.renderOrders(
					this.loadOrdersPromise(),
					this.props.phase
				).then(_ => {
					this.acceptOrders();
					this.snapshotSVG();
				});
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
				case "UnitType":
				case "OrderType":
					this.orderDialog.setState({
						open: true,
						options: Object.keys(options).concat("Cancel"),
						onClick: ord => {
							if (ord == "Cancel") {
								this.deleteOrder(parts[0]).then(_ => {
									this.renderOrders(
										this.loadOrdersPromise(),
										this.props.phase
									).then(_ => {
										this.acceptOrders();
										this.snapshotSVG();
									});
								});
							} else {
								this.addOptionHandlers(
									options[ord].Next,
									parts.concat(ord)
								);
							}
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
	render() {
		return (
			<React.Fragment>
				<div id="map-container">
					<div
						style={{
							display: "flex",
							flexWrap: "wrap"
						}}
						key="map"
						id="map"
					></div>
					<img
						id="mapSnapshot"
						key="mapSnapshot"
						style={{
							width: "100%",
							display: "none",
							flexWrap: "wrap"
						}}
					/>
					<div
						key="game-desc"
						style={{
							flexBasis: "100%",
							fontFamily: '"Libre Baskerville", "Cabin", Serif',
							fontSize: "small",
							padding: "10px",
							textAlign: "center",
							textTransform: "capitalize",
							color: "#FDE2B5"
						}}
					>
						{this.props.title}
					</div>
				</div>
				<div
					key="units-div"
					style={{ display: "none" }}
					id="units-div"
				></div>
				<OrderDialog
					parentCB={c => {
						this.orderDialog = c;
					}}
					key="order-dialog"
				/>
			</React.Fragment>
		);
	}
}
