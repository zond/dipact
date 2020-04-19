import * as helpers from '%{ cb "/js/helpers.js" }%';

import OrderDialog from '%{ cb "/js/order_dialog.js" }%';

export default class DipMap extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			game: null,
			phase: null,
			member: null,
			variant: null,
			laboratoryMode: this.props.laboratoryMode,
			labEditMode: false,
			orders: null,
			options: null,
			svgLoaded: false,
			labPlayAs: ""
		};
		this.addOptionHandlers = this.addOptionHandlers.bind(this);
		this.acceptOrders = this.acceptOrders.bind(this);
		this.renderOrders = this.renderOrders.bind(this);
		this.updateMap = this.updateMap.bind(this);
		this.createOrder = this.createOrder.bind(this);
		this.deleteOrder = this.deleteOrder.bind(this);
		this.snapshotSVG = this.snapshotSVG.bind(this);
		this.loadOrdersPromise = this.loadOrdersPromise.bind(this);
		this.mapDims = [null, null];
		this.map = null;
		this.orderDialog = null;
		this.firstLoadFinished = false;
	}
	snapshotSVG() {
		let mapEl = document.getElementById("map");
		let serializedSVG = btoa(
			unescape(
				encodeURIComponent(
					new XMLSerializer().serializeToString(mapEl.children[0])
				)
			)
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
		let setOrderLink = this.state.phase.Links.find(l => {
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
		let order = this.state.orders.find(o => {
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
		this.setState({ game: this.props.game, phase: this.props.phase });
	}
	loadOrdersPromise() {
		let orderLink = this.state.phase.Links.find(l => {
			return l.Rel == "orders";
		});
		if (orderLink) {
			const promiseFunc = _ => {
				return helpers
					.safeFetch(helpers.createRequest(orderLink.URL))
					.then(resp => resp.json());
			};
			return new Promise((res, rej) => {
				(this.state.phase.Properties.Resolved
					? helpers.memoize(orderLink.URL, promiseFunc)
					: promiseFunc()
				).then(js => {
					this.props.ordersSubscriber(js.Properties);
					res(js.Properties);
				});
			});
		} else {
			return Promise.resolve(null);
		}
	}
	componentDidUpdate(prevProps, prevState, snapshot) {
		if (
			!prevProps.isActive &&
			this.props.isActive &&
			!this.mapDims[0] &&
			!this.mapDims[1]
		) {
			let mapEl = document.getElementById("map");
			this.mapDims = [mapEl.clientWidth, mapEl.clientHeight];
			this.snapshotSVG();
		}
		if (
			this.props.game.Properties.ID != prevProps.game.Properties.ID ||
			this.props.phase.Properties.PhaseOrdinal !=
				prevProps.phase.Properties.PhaseOrdinal
		) {
			this.setState({ game: this.props.game, phase: this.props.phase });
		}
		if (
			this.state.svgLoaded != prevState.svgLoaded ||
			!prevState.game ||
			!prevState.phase ||
			this.state.game.Properties.ID != prevState.game.Properties.ID ||
			this.state.phase.Properties.PhaseOrdinal !=
				prevState.phase.Properties.PhaseOrdinal
		) {
			if (this.state.phase.Links) {
				let silent = this.firstLoadFinished;
				if (!silent) {
					helpers.incProgress();
				}
				let promises = [this.loadOrdersPromise()];
				let optionsLink = this.state.phase.Links.find(l => {
					return l.Rel == "options";
				});
				if (optionsLink) {
					promises.push(
						helpers.memoize(optionsLink.URL, _ => {
							return helpers
								.safeFetch(
									helpers.createRequest(optionsLink.URL)
								)
								.then(resp => resp.json())
								.then(js => {
									return js.Properties;
								});
						})
					);
				} else {
					promises.push(Promise.resolve(null));
				}
				Promise.all(promises).then(values => {
					if (!silent) {
						helpers.decProgress();
						this.firstLoadFinished = true;
					}
					this.setState(
						(state, props) => {
							state = Object.assign({}, state);
							state.orders = values[0];
							state.options = values[1];
							return state;
						},
						_ => {
							this.updateMap();
						}
					);
				});
			}
		} else if (
			JSON.stringify(this.state.orders) !=
			JSON.stringify(prevState.orders)
		) {
			this.updateMap();
		}
		if (
			!prevState.game ||
			this.state.game.Properties.ID != prevState.game.Properties.ID
		) {
			this.setState(
				(state, props) => {
					const member = this.state.game.Properties.Members.find(
						e => {
							return e.User.Email == Globals.user.Email;
						}
					);
					state = Object.assign({}, state);
					state.svgLoaded = false;
					state.member = member;
					state.labPlayAs = member.Nation;
					state.variant = Globals.variants.find(v => {
						return (
							v.Properties.Name ==
							this.state.game.Properties.Variant
						);
					});
					return state;
				},
				_ => {
					let variantMapSVG =
						"/Variant/" +
						this.state.game.Properties.Variant +
						"/Map.svg";
					let promises = [
						helpers.memoize(variantMapSVG, _ => {
							return helpers
								.safeFetch(helpers.createRequest(variantMapSVG))
								.then(resp => resp.text());
						}),
						Promise.all(
							this.state.variant.Properties.UnitTypes.map(
								unitType => {
									let variantUnitSVG =
										"/Variant/" +
										this.state.game.Properties.Variant +
										"/Units/" +
										unitType +
										".svg";
									return helpers.memoize(
										variantUnitSVG,
										_ => {
											return helpers
												.safeFetch(
													helpers.createRequest(
														variantUnitSVG
													)
												)
												.then(resp => resp.text())
												.then(svg => {
													return {
														name: unitType,
														svg: svg
													};
												});
										}
									);
								}
							)
						)
					];
					Promise.all(promises).then(values => {
						let mapSVG = values[0];
						let mapEl = document.getElementById("map");
						mapEl.innerHTML = mapSVG;
						this.mapDims = [mapEl.clientWidth, mapEl.clientHeight];

						this.map = dippyMap($("#map"));
						panzoom(document.getElementById("map-container"), {
							bounds: true,
							boundsPadding: 0.5,
							onZoom: e => {
								document.getElementById("map").style.display =
									"none";
								document.getElementById(
									"mapSnapshot"
								).style.display = "flex";
							},
							onZoomend: e => {
								document.getElementById("map").style.display =
									"flex";
								document.getElementById(
									"mapSnapshot"
								).style.display = "none";
							}
						});

						let variantUnits = values[1];
						variantUnits.forEach(unitData => {
							let container = document.createElement("div");
							container.setAttribute(
								"id",
								"unit" + unitData.name
							);
							container.innerHTML = unitData.svg;
							document
								.getElementById("units-div")
								.appendChild(container);
						});
						this.setState({ svgLoaded: true });
					});
				}
			);
		}
	}
	// This function is wonky, because for historical
	// reasons the diplicity server provides phases in
	// different formats for 'start phase for variant'
	// and 'a phase of an actual game'.
	updateMap() {
		if (!this.state.svgLoaded) {
			return;
		}
		this.map.removeUnits();
		if (this.state.phase.Properties.Units instanceof Array) {
			this.state.phase.Properties.Units.forEach(unitData => {
				this.map.addUnit(
					"unit" + unitData.Unit.Type,
					unitData.Province,
					helpers.natCol(unitData.Unit.Nation, this.state.variant)
				);
			});
		} else {
			for (let prov in this.state.phase.Properties.Units) {
				let unit = this.state.phase.Properties.Units[prov];
				this.map.addUnit(
					"unit" + unit.Type,
					prov,
					helpers.natCol(unit.Nation, this.state.variant)
				);
			}
		}
		if (this.state.phase.Properties.Dislodgeds instanceof Array) {
			this.state.phase.Properties.Dislodgeds.forEach(disData => {
				this.map.addUnit(
					"unit" + disData.Dislodged.Type,
					disData.Province,
					helpers.natCol(
						disData.Dislodged.Nation,
						this.state.variant
					),
					true
				);
			});
		} else {
			for (let prov in this.state.phase.Properties.Dislodgeds) {
				let unit = this.state.phase.Properties.Units[prov];
				this.map.addUnit(
					"unit" + unit.Type,
					prov,
					helpers.natCol(unit.Nation, this.state.variant),
					true
				);
			}
		}
		let SCs = {};
		if (this.state.phase.Properties.SupplyCenters) {
			SCs = this.state.phase.Properties.SupplyCenters;
		} else {
			this.state.phase.Properties.SCs.forEach(scData => {
				SCs[scData.Province] = scData.Owner;
			});
		}
		for (let prov in this.state.variant.Properties.Graph.Nodes) {
			let node = this.state.variant.Properties.Graph.Nodes[prov];
			if (node.SC && SCs[prov]) {
				this.map.colorProvince(
					prov,
					helpers.natCol(SCs[prov], this.state.variant)
				);
			} else {
				this.map.hideProvince(prov);
			}
		}
		this.map.showProvinces();
		if (this.state.phase.Properties.Orders) {
			for (let nat in this.state.phase.Properties.Orders) {
				let orders = this.state.phase.Properties.Orders[nat];
				for (let prov in orders) {
					let order = orders[prov];
					this.map.addOrder(
						[prov] + order,
						helpers.natCol(nat, this.state.variant)
					);
				}
			}
		}
		this.renderOrders();
		this.snapshotSVG();
		this.acceptOrders();
	}
	renderOrders() {
		this.map.removeOrders();
		(this.state.orders || []).forEach(orderData => {
			this.map.addOrder(
				orderData.Properties.Parts,
				helpers.natCol(orderData.Properties.Nation, this.state.variant)
			);
		});
		if (this.state.phase.Properties.Resolutions instanceof Array) {
			this.state.phase.Properties.Resolutions.forEach(res => {
				if (res.Resolution != "OK") {
					this.map.addCross(res.Province, "#ff0000");
				}
			});
		}
	}
	acceptOrders() {
		if (Object.keys(this.state.options || {}).length > 0) {
			this.addOptionHandlers(this.state.options, []);
		} else {
			this.map.clearClickListeners();
		}
	}
	addOptionHandlers(options, parts) {
		if (Object.keys(options).length == 0) {
			helpers.incProgress();
			this.createOrder(parts).then(_ => {
				this.loadOrdersPromise().then(js => {
					helpers.decProgress();
					this.setState({ orders: js }, this.acceptOrders);
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
						options: Object.keys(options).concat("Clear"),
						onClick: ord => {
							if (ord == "Clear") {
								helpers.incProgress();
								this.deleteOrder(parts[0]).then(_ => {
									this.loadOrdersPromise().then(js => {
										helpers.decProgress();
										this.setState(
											{ orders: js },
											this.acceptOrders
										);
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
		if (!this.state.game || !this.state.phase) {
			return "";
		}
		return (
			<React.Fragment>
				{this.props.laboratoryMode ? (
					<div
						className={helpers.scopedClass(
							"background-color: white; display: flex;"
						)}
					>
						<MaterialUI.FormControlLabel
							key="edit-mode"
							control={
								<MaterialUI.Switch
									checked={this.state.labEditMode}
									onChange={ev => {
										this.setState({
											labEditMode: ev.target.checked
										});
									}}
								/>
							}
							label="Edit mode"
						/>
						<MaterialUI.FormControl
							key="play-as"
							className={helpers.scopedClass("flex-grow: 1;")}
						>
							<MaterialUI.InputLabel>
								Play as
							</MaterialUI.InputLabel>
							<MaterialUI.Select
								disabled={this.state.labEditMode}
								value={this.state.labPlayAs}
								onChange={ev => {
									this.setState({
										labPlayAs: ev.target.value
									});
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
					</div>
				) : (
					""
				)}
				<div className={helpers.scopedClass("overflow: hidden;")}>
					<div
						id="map-container"
						className={helpers.scopedClass("height: 100%;")}
					>
						<div
							className={helpers.scopedClass(
								"display: flex; flex-wrap: wrap"
							)}
							key="map"
							id="map"
						></div>
						<img
							id="mapSnapshot"
							key="mapSnapshot"
							className={helpers.scopedClass(
								"width: 100%; flex-wrap: wrap;"
							)}
							style={{
								display: "none"
							}}
						/>
						<div
							key="game-desc"
							className={helpers.scopedClass(`
								flex-basis: 100%;
								font-family:	"Libre Baskerville", "Cabin", Serif;
								font-size: small;
								padding: 10px;
								text-align: center;
								color: #FDE2B5;
								`)}
						>
							{helpers.gameDesc(this.state.game) +
								" - " +
								this.state.game.Properties.Variant}
						</div>
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
