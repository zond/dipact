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
		this.makeVariantPhase = this.makeVariantPhase.bind(this);
		this.acceptOrders = this.acceptOrders.bind(this);
		this.labResolve = this.labResolve.bind(this);
		this.labShare = this.labShare.bind(this);
		this.acceptEdits = this.acceptEdits.bind(this);
		this.handleLaboratoryCommand = this.handleLaboratoryCommand.bind(this);
		this.renderOrders = this.renderOrders.bind(this);
		this.updateMap = this.updateMap.bind(this);
		this.createOrder = this.createOrder.bind(this);
		this.deleteOrder = this.deleteOrder.bind(this);
		this.snapshotSVG = this.snapshotSVG.bind(this);
		this.loadOrdersPromise = this.loadOrdersPromise.bind(this);
		this.lastRenderedPhaseHash = 0;
		this.lastRenderedOrdersHash = 0;
		this.svgSerializer = new XMLSerializer();
		this.lastSnapshottedSVGHash = 0;
		this.mapDims = [null, null];
		this.map = null;
		this.orderDialog = null;
		this.firstLoadFinished = false;
	}
	labShare() {
		const hrefURL = new URL(window.location.href);
		const variantPhase = this.makeVariantPhase();
		const url =
			hrefURL.protocol +
			"//" +
			hrefURL.host +
			"/Game/" +
			this.state.game.Properties.ID +
			"/Lab/" +
			this.props.serializePhaseState({
				Properties: variantPhase
			});
		fetch(
			new Request(
				"https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=AIzaSyDxQpMuCYlu95_oG7FUCLFIYIIfvKz-4D8",
				{
					method: "POST",
					headers: {
						Accept: "application/json"
					},
					body: JSON.stringify({
						dynamicLinkInfo: {
							domainUriPrefix: "dipact.page.link",
							link: url,
							navigationInfo: {
								enableForcedRedirect: true
							}
						},
						suffix: {
							option: "SHORT"
						}
					})
				}
			)
		)
			.then(resp => resp.json())
			.then(js => {
				navigator.clipboard.writeText(js.shortLink).then(_ => {
					helpers.snackbar("URL copied to clipboard");
				});
			});
	}
	snapshotSVG() {
		if (!this.mapDims[0] || !this.mapDims[1]) {
			return;
		}
		let mapEl = document.getElementById("map");
		const svgXML = this.svgSerializer.serializeToString(mapEl.children[0]);
		const svgHash = helpers.hash(svgXML);
		if (svgHash != this.lastSerializedSVG) {
			this.lastSerializedSVG = svgHash;
			let serializedSVG = btoa(unescape(encodeURIComponent(svgXML)));
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
				if (snapshotEl) {
					snapshotEl.src = snapshotData;
				}
			});
		}
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
		this.updateMap();
		// Forward properties to state, if the state doesn't exist or the properties changed.
		if (
			!this.state.game ||
			this.props.game.Properties.ID != prevProps.game.Properties.ID ||
			!this.state.phase ||
			this.props.phase.Properties.PhaseOrdinal !=
				prevProps.phase.Properties.PhaseOrdinal ||
			this.props.laboratoryMode != this.state.laboratoryMode
		) {
			this.setState({
				game: this.props.game,
				svgLoaded:
					this.state.svgLoaded &&
					this.props.game.Properties.ID ==
						prevProps.game.Properties.ID,
				phase: this.props.phase,
				laboratoryMode: this.props.laboratoryMode
			});
		}
		// Get map dimensions if it's the first time we can get them.
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
		// If anything that requires rendering new orders or options has changed.
		if (
			this.state.laboratoryMode != prevState.laboratoryMode ||
			!prevState.game ||
			!prevState.phase ||
			this.state.game.Properties.ID != prevState.game.Properties.ID ||
			this.state.phase.Properties.PhaseOrdinal !=
				prevState.phase.Properties.PhaseOrdinal
		) {
			if (this.state.laboratoryMode) {
				// If we ARE in laboratory mode, reload orders if phase is "real".
				if (
					this.state.phase.Links &&
					this.state.phase.Properties.GameID
				) {
					this.loadOrdersPromise().then(orders => {
						this.setState({ orders: orders });
					});
				} else {
					// Otherwise use the orders in the phase, which we should have saved when we created it.
					const orders = [];
					Object.keys(
						this.state.phase.Properties.Orders || {}
					).forEach(nation => {
						Object.keys(
							this.state.phase.Properties.Orders[nation]
						).forEach(province => {
							orders.push({
								Properties: {
									Nation: nation,
									Parts: [province].concat(
										this.state.phase.Properties.Orders[
											nation
										][province]
									)
								}
							});
						});
					});
					this.setState({ orders: orders });
				}
			} else {
				// If we are NOT in laboratory mode, reload options AND orders.
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
						if (
							this.state.laboratoryMode &&
							!this.state.phase.Properties.GameID
						) {
							return;
						}
						this.setState({
							orders: values[0],
							options: values[1]
						});
					});
				}
			}
		}
		// Reload all the SVGs if the new state has a new game.
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
					const variant = Globals.variants.find(v => {
						return (
							v.Properties.Name ==
							this.state.game.Properties.Variant
						);
					});
					state = Object.assign({}, state);
					state.member = member;
					state.labPlayAs = member
						? member.Nation
						: variant.Properties.Nations[0];
					state.variant = variant;
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
		const phaseHash = helpers.hash(JSON.stringify(this.state.phase));
		if (phaseHash != this.lastRenderedPhaseHash) {
			this.lastRenderedPhaseHash = phaseHash;
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
		}
		this.renderOrders();
		this.snapshotSVG();
		this.acceptOrders();
	}
	renderOrders() {
		const ordersHash = helpers.hash(JSON.stringify(this.state.orders));
		if (ordersHash != this.lastRenderedOrdersHash) {
			this.lastRenderedOrdersHash = ordersHash;
			this.map.removeOrders();
			(this.state.orders || []).forEach(orderData => {
				this.map.addOrder(
					orderData.Properties.Parts,
					helpers.natCol(
						orderData.Properties.Nation,
						this.state.variant
					)
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
	}
	makeVariantPhase() {
		return {
			PhaseOrdinal: this.state.phase.Properties.PhaseOrdinal,
			Variant: this.state.variant.Properties.Name,
			Season: this.state.phase.Properties.Season,
			Year: this.state.phase.Properties.Year,
			Type: this.state.phase.Properties.Type,
			Units:
				this.state.phase.Properties.Units instanceof Array
					? this.state.phase.Properties.Units.reduce((sum, el) => {
							sum[el.Province] = el.Unit;
							return sum;
					  }, {})
					: this.state.phase.Properties.Units || {},
			SupplyCenters: this.state.phase.Properties.SCs
				? this.state.phase.Properties.SCs.reduce((sum, el) => {
						sum[el.Province] = el.Owner;
						return sum;
				  }, {})
				: this.state.phase.Properties.SupplyCenters || {},
			Dislodgeds:
				this.state.phase.Properties.Dislodgeds instanceof Array
					? this.state.phase.Properties.Dislodgeds.reduce(
							(sum, el) => {
								sum[el.Province] = el.Dislodged;
								return sum;
							},
							{}
					  )
					: this.state.phase.Properties.Dislodgeds || {},
			Dislodgers:
				this.state.phase.Properties.Dislodgers instanceof Array
					? this.state.phase.Properties.Dislodgers.reduce(
							(sum, el) => {
								sum[el.Province] = el.Dislodger;
								return sum;
							},
							{}
					  )
					: this.state.phase.Properties.Dislodgers || {},
			Orders: (this.state.orders || []).reduce((sum, el) => {
				const natOrders = sum[el.Properties.Nation] || {};
				natOrders[el.Properties.Parts[0]] = el.Properties.Parts.slice(
					1
				);
				sum[el.Properties.Nation] = natOrders;
				return sum;
			}, {}),
			Bounces:
				this.state.phase.Properties.Bounces instanceof Array
					? this.state.phase.Properties.Bounces.reduce((sum, el) => {
							sum[el.Province] = el.BounceList.split(",").reduce(
								(sum, el) => {
									sum[el] = true;
									return sum;
								},
								{}
							);
							return sum;
					  }, {})
					: this.state.phase.Properties.Bounces || {}
		};
	}
	acceptEdits() {
		const unitOptions = {};
		this.state.variant.Properties.UnitTypes.forEach(unitType => {
			unitOptions[unitType] = {
				Type: "LabCommand",
				Next: {}
			};
		});
		const nationUnitOptions = {
			Neutral: {
				Type: "LabCommand",
				Next: Object.assign({}, unitOptions)
			},
			None: { Type: "LabCommand", Next: {} }
		};
		const nationSCOptions = {
			Neutral: { Type: "LabCommand", Next: {} }
		};
		this.state.variant.Properties.Nations.forEach(nation => {
			nationSCOptions[nation] = {
				Type: "LabCommand",
				Next: {}
			};
			nationUnitOptions[nation] = {
				Type: "LabCommand",
				Next: Object.assign({}, unitOptions)
			};
		});
		Object.keys(this.state.variant.Properties.Graph.Nodes).forEach(
			superProv => {
				const provData = this.state.variant.Properties.Graph.Nodes[
					superProv
				];
				Object.keys(provData.Subs).forEach(subProv => {
					const name = superProv + (subProv ? "/" + subProv : "");
					this.map.addClickListener(
						name,
						prov => {
							this.map.clearClickListeners();
							const options = {
								Unit: {
									Type: "LabCommand",
									Next: Object.assign({}, nationUnitOptions)
								}
							};
							if (provData.SC) {
								options["SC"] = {
									Type: "LabCommand",
									Next: Object.assign({}, nationSCOptions)
								};
							}
							this.addOptionHandlers(options, ["edit", prov]);
						},
						{ touch: true }
					);
				});
			}
		);
	}
	labResolve() {
		const optionsLink = this.state.variant.Links.find(l => {
			return l.Rel == "resolve-state";
		});
		const variantPhase = this.makeVariantPhase();
		helpers
			.safeFetch(
				helpers.createRequest(optionsLink.URL, {
					method: optionsLink.Method,
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify(variantPhase)
				})
			)
			.then(res => res.json())
			.then(js => {
				js.Properties.PhaseOrdinal =
					(this.state.phase.Properties.PhaseOrdinal || 1) + 1;
				this.props.labPhaseResolve({ Properties: variantPhase }, js);
			});
	}
	acceptOrders() {
		this.map.clearClickListeners();
		if (this.state.laboratoryMode) {
			if (this.state.labEditMode) {
				this.acceptEdits();
			} else {
				const variantPhase = this.makeVariantPhase();
				const optionsLink = this.state.variant.Links.find(l => {
					return l.Rel == this.state.labPlayAs + "-options";
				});
				helpers
					.safeFetch(
						helpers.createRequest(optionsLink.URL, {
							method: optionsLink.Method,
							headers: {
								"Content-Type": "application/json"
							},
							body: JSON.stringify(variantPhase)
						})
					)
					.then(res => res.json())
					.then(js => {
						if (
							this.state.phase.Properties.PhaseOrdinal !=
							variantPhase.PhaseOrdinal
						) {
							return;
						}
						if (Object.keys(js.Properties).length > 0) {
							this.addOptionHandlers(js.Properties, []);
						}
					});
			}
		} else {
			if (Object.keys(this.state.options || {}).length > 0) {
				this.addOptionHandlers(this.state.options, []);
			}
		}
	}
	handleLaboratoryCommand(parts) {
		if (this.state.labEditMode) {
			if (parts[2] == "SC") {
				this.setState((state, props) => {
					state = Object.assign({}, state);
					state.phase = JSON.parse(JSON.stringify(state.phase));
					if (state.phase.Properties.SCs) {
						state.phase.Properties.SCs = state.phase.Properties.SCs.filter(
							sc => {
								return sc.Province != parts[1];
							}
						);
						if (parts[3] != "Neutral") {
							state.phase.Properties.SCs.push({
								Province: parts[1],
								Owner: parts[3]
							});
						}
					} else {
						delete (state.phase.Properties.SupplyCenters, parts[1]);
						if (parts[3] != "Neutral") {
							state.phase.Properties.SupplyCenters[parts[1]] =
								parts[3];
						}
					}
					return state;
				}, this.acceptOrders);
			} else if (parts[2] == "Unit") {
				this.setState((state, props) => {
					state = Object.assign({}, state);
					state.phase = JSON.parse(JSON.stringify(state.phase));
					if (state.phase.Properties.Units instanceof Array) {
						state.phase.Properties.Units = state.phase.Properties.Units.filter(
							unit => {
								return unit.Province != parts[1];
							}
						);
						if (parts[3] != "None") {
							state.phase.Properties.Units.push({
								Province: parts[1],
								Unit: { Type: parts[4], Nation: parts[3] }
							});
						}
					} else {
						delete (state.phase.Properties.Units, parts[1]);
						if (parts[3] != "None") {
							state.phase.Properties.Units[parts[1]] = {
								Type: parts[4],
								Nation: parts[3]
							};
						}
					}
					return state;
				}, this.acceptOrders);
			}
		} else {
			if (parts[0] == "Clear") {
				this.setState(
					{
						orders: this.state.orders.filter(order => {
							return order.Properties.Parts[0] != parts[1];
						})
					},
					this.acceptOrders
				);
			} else {
				this.setState((state, props) => {
					state = Object.assign({}, state);
					state.orders = state.orders.filter(order => {
						return order.Properties.Parts[0] != parts[0];
					});
					state.orders.push({
						Properties: {
							Parts: parts.slice(1),
							Nation: this.state.labPlayAs
						}
					});
					return state;
				}, this.acceptOrders);
			}
		}
	}
	addOptionHandlers(options, parts) {
		if (Object.keys(options).length == 0) {
			if (this.state.laboratoryMode) {
				this.handleLaboratoryCommand(parts);
				this.acceptOrders();
			} else {
				helpers.incProgress();
				this.createOrder(parts).then(_ => {
					this.loadOrdersPromise().then(js => {
						helpers.decProgress();
						this.setState({ orders: js }, this.acceptOrders);
					});
				});
			}
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
				case "LabCommand":
					this.orderDialog.setState({
						open: true,
						options: Object.keys(options).concat("Cancel"),
						onClose: this.acceptOrders,
						onClick: ord => {
							if (ord == "Cancel") {
								this.acceptOrders();
							} else {
								this.addOptionHandlers(
									options[ord].Next,
									parts.concat(ord)
								);
							}
						}
					});
					break;
				case "UnitType":
				case "OrderType":
					this.orderDialog.setState({
						open: true,
						options: Object.keys(options).concat([
							"Clear",
							"Cancel"
						]),
						onClose: this.acceptOrders,
						onClick: ord => {
							if (ord == "Clear") {
								if (this.state.laboratoryMode) {
									this.handleLaboratoryCommand(
										["Clear"].concat(parts)
									);
									this.acceptOrders();
								} else {
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
								}
							} else if (ord == "Cancel") {
								this.acceptOrders();
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
							label="Edit"
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
						<MaterialUI.Tooltip title="Share">
							<MaterialUI.IconButton onClick={this.labShare}>
								{helpers.createIcon("\ue80d")}
							</MaterialUI.IconButton>
						</MaterialUI.Tooltip>
						<MaterialUI.Tooltip title="Resolve">
							<MaterialUI.IconButton onClick={this.labResolve}>
								{helpers.createIcon("\ue044")}
							</MaterialUI.IconButton>
						</MaterialUI.Tooltip>
					</div>
				) : (
					""
				)}
				<div
					className={helpers.scopedClass(
						"height: 100%; overflow: hidden;"
					)}
				>
					<div id="map-container">
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
