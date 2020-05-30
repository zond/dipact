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
			corroboration: null,
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
		this.getSVGData = this.getSVGData.bind(this);
		this.snackbarIncompleteOrder = this.snackbarIncompleteOrder.bind(this);
		this.loadCorroboratePromise = this.loadCorroboratePromise.bind(this);
		this.filterOK = this.filterOK.bind(this);
		this.debugCount = this.debugCount.bind(this);
		this.infoClicked = this.infoClicked.bind(this);
		this.phaseSpecialStrokes = {};
		this.lastRenderedPhaseHash = 0;
		this.lastRenderedOrdersHash = 0;
		this.svgSerializer = new XMLSerializer();
		this.lastSnapshottedSVGHash = 0;
		this.mapDims = [null, null];
		this.map = null;
		this.orderDialog = null;
		this.firstLoadFinished = false;
		if (this.props.parentCB) {
			this.props.parentCB(this);
		}
	}
	infoClicked(prov) {
		prov = prov.split("/")[0];
		const infos = ["Province: " + prov];
		if (this.state.phase.Properties.SupplyCenters) {
			const owner = this.state.phase.Properties.SupplyCenters[prov];
			if (owner) {
				infos.push("Supply center: " + owner);
			}
		} else {
			this.state.phase.Properties.SCs.forEach(scData => {
				if (scData.Province.split("/")[0] == prov) {
					infos.push("Supply center: " + scData.Owner);
				}
			});
		}
		if (this.state.phase.Properties.Units instanceof Array) {
			this.state.phase.Properties.Units.forEach(unitData => {
				if (unitData.Province.split("/")[0] == prov) {
					infos.push(
						unitData.Unit.Type + ": " + unitData.Unit.Nation
					);
				}
			});
		} else {
			for (let unitProv in this.state.phase.Properties.Units) {
				const unit = this.state.phase.Properties.Units[unitProv];
				if (prov == unitProv.split("/")[0]) {
					infos.push(unit.Type + ": " + unit.Nation);
				}
			}
		}
		if (infos.length > 0) {
			helpers.snackbar(
				infos.map(info => {
					return <p key={info}>{info}</p>;
				}),
				1
			);
		}
	}
	snackbarIncompleteOrder(parts, types, nextType) {
		const words = [];
		if (parts.length != types.length) {
			throw "" + parts + " and " + types + " must be of same length!";
		}
		parts.forEach((part, idx) => {
			if (idx + 1 > parts.length || part != parts[idx + 1]) {
				words.push(part);
				if (
					(idx == types.length - 1 &&
						types[idx] == "Province" &&
						nextType == "Province") ||
					(idx + 1 < types.length &&
						types[idx] == "Province" &&
						types[idx + 1] == "Province")
				) {
					words.push("to");
				}
			}
		});
		let msg = words.join(" ").toLowerCase();
		if (nextType == "Done") {
			msg = "Saving " + msg;
		} else {
			if (msg) {
				msg += "...";
			}
		}
		if (msg) {
			helpers.snackbar(msg, 1);
		}
	}
	downloadMap() {
		this.getSVGData({
			width: 1280,
			force: true
		}).then(data => {
			if (data) {
				helpers.downloadDataURI(
					data,
					helpers.gameDesc(this.state.game) +
						" - " +
						helpers.phaseName(this.state.phase) +
						".png"
				);
			} else {
				helpers.snackbar("Unable to generate map image");
			}
		});
	}
	debugCount(tag) {
		if (this.props.debugCount) {
			this.props.debugCount(tag);
		}
	}
	labShare() {
		const hrefURL = new URL(location.href);
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
				helpers.copyToClipboard(js.shortLink).then(_ => {
					helpers.snackbar("URL copied to clipboard");
				});
				gtag("event", "lab_share");
			});
	}
	getSVGData(opts = {}) {
		return new Promise((res, rej) => {
			this.debugCount("getSVGData/called");
			if (!this.mapDims[0] || !this.mapDims[1]) {
				res(null);
			}
			const scale = opts.width ? opts.width / this.mapDims[0] : 1.0;
			this.debugCount("getSVGData/mapDims");
			let mapEl = document.getElementById("map");
			const svg = mapEl.children[0].cloneNode(true);
			svg.setAttribute("width", this.mapDims[0] * scale);
			svg.setAttribute("height", this.mapDims[1] * scale);
			const svgXML = this.svgSerializer.serializeToString(svg);
			const svgHash = helpers.hash(svgXML);
			if (opts.force || svgHash != this.lastSerializedSVG) {
				this.debugCount("getSVGData/differentHash");
				this.lastSerializedSVG = svgHash;
				let serializedSVG = btoa(unescape(encodeURIComponent(svgXML)));
				let snapshotImage = document.createElement("img");
				snapshotImage.style.width = this.mapDims[0] * scale;
				snapshotImage.style.height = this.mapDims[1] * scale;
				snapshotImage.src =
					"data:image/svg+xml;base64," + serializedSVG;
				snapshotImage.addEventListener("load", _ => {
					this.debugCount("getSVGData/loadedSnapshot");
					let snapshotCanvas = document.createElement("canvas");
					snapshotCanvas.setAttribute(
						"height",
						this.mapDims[1] * scale
					);
					snapshotCanvas.setAttribute(
						"width",
						this.mapDims[0] * scale
					);
					snapshotCanvas.style.height = this.mapDims[1];
					snapshotCanvas.style.width = this.mapDims[0];
					snapshotCanvas
						.getContext("2d")
						.drawImage(snapshotImage, 0, 0);
					res(snapshotCanvas.toDataURL("image/png"));
				});
			}
		});
	}
	snapshotSVG() {
		const snapshotEl = document.getElementById("mapSnapshot");
		if (snapshotEl) {
			this.getSVGData().then(data => {
				if (data) {
					snapshotEl.src = data;
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
					body: JSON.stringify({ Parts: parts })
				})
			);
		} else {
			return Promise.resolve(null);
		}
	}
	deleteOrder(prov) {
		let order = this.state.orders.find(o => {
			return o.Parts[0].split("/")[0] == prov.split("/")[0];
		});
		if (order) {
			return helpers.safeFetch(
				helpers.createRequest(
					"/Game/" +
						this.state.game.Properties.ID +
						"/Phase/" +
						this.state.phase.Properties.PhaseOrdinal +
						"/Order/" +
						order.Parts[0].replace("/" + "_"),
					{
						method: "DELETE"
					}
				)
			);
		} else {
			return Promise.resolve({});
		}
	}
	componentDidMount() {
		this.setState({ game: this.props.game, phase: this.props.phase });
	}
	loadCorroboratePromise() {
		let corroborateLink = this.state.phase.Links.find(l => {
			return l.Rel == "corroborate";
		});
		if (corroborateLink) {
			const promiseFunc = _ => {
				return helpers
					.safeFetch(helpers.createRequest(corroborateLink.URL))
					.then(resp => resp.json())
					.then(js => {
						return js;
					});
			};
			return new Promise((res, rej) => {
				(this.state.phase.Properties.Resolved
					? helpers.memoize(corroborateLink.URL, promiseFunc)
					: promiseFunc()
				).then(js => {
					this.props.corroborateSubscriber(js);
					res(js);
				});
			});
		} else {
			return Promise.resolve({ Properties: {} });
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
			this.debugCount("componentDidUpdate/forwardProps");
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
			this.debugCount("componentDidUpdate/gotMapDims");
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
			this.debugCount("componentDidUpdate/reRender");
			if (this.state.laboratoryMode) {
				// If we ARE in laboratory mode, reload orders if phase is "real".
				if (
					this.state.phase.Links &&
					this.state.phase.Properties.GameID
				) {
					this.loadCorroboratePromise().then(corroboration => {
						this.setState({
							orders: corroboration.Properties.Orders
						});
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
								Nation: nation,
								Parts: [province].concat(
									this.state.phase.Properties.Orders[nation][
										province
									]
								)
							});
						});
					});
					this.setState({ orders: orders });
				}
			} else {
				this.debugCount("componentDidUpdate/reRenderNormal");
				// If we are NOT in laboratory mode, reload options AND orders.
				if (this.state.phase.Links) {
					let silent = this.firstLoadFinished;
					if (!silent) {
						helpers.incProgress();
					}
					let promises = [this.loadCorroboratePromise()];
					let optionsLink = this.state.phase.Links.find(l => {
						return l.Rel == "options";
					});
					if (optionsLink) {
						this.debugCount("componentDidUpdate/reRenderOptions");
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
						this.debugCount(
							"componentDidUpdate/reRenderNormalSuccess"
						);
						this.setState({
							orders: values[0].Properties.Orders,
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
			this.debugCount("componentDidUpdate/loadSVGs");
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
					state.labPlayAs =
						member && member.Nation
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
						Object.keys(
							this.state.variant.Properties.Graph.Nodes
						).forEach(superProv => {
							Object.keys(
								this.state.variant.Properties.Graph.Nodes[
									superProv
								].Subs
							).forEach(subProv => {
								let prov = superProv;
								if (subProv) {
									prov = prov + "/" + subProv;
								}
								this.map.addClickListener(
									prov,
									this.infoClicked,
									{
										nohighlight: true,
										permanent: true,
										touch: true
									}
								);
							});
						});
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
						gtag("set", {
							page_title: "DipMap",
							page_location: location.href
						});
						gtag("event", "page_view");
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
		this.debugCount("updateMap/called");
		if (!this.state.svgLoaded) {
			return;
		}
		this.debugCount("updateMap/hasSVGs");
		const phaseHash = helpers.hash(JSON.stringify(this.state.phase));
		if (phaseHash != this.lastRenderedPhaseHash) {
			this.lastRenderedPhaseHash = phaseHash;
			this.debugCount("updateMap/differentPhase");

			this.phaseSpecialStrokes = {};
			const SCs = {};
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
					const col = helpers.natCol(SCs[prov], this.state.variant);
					if (helpers.brightnessByColor(col) < 0.5) {
						this.phaseSpecialStrokes[prov] = "#ffffff";
						this.map.colorSC(prov, "#ffffff");
					}
					this.map.colorProvince(prov, col);
					this.debugCount("updateMap/coloredProvince/" + col);
				} else {
					this.map.hideProvince(prov);
					this.debugCount("updateMap/hidProvince");
				}
			}
			this.map.showProvinces();
			this.debugCount("updateMap/renderedProvinces");

			this.map.removeUnits();
			if (this.state.phase.Properties.Units instanceof Array) {
				this.state.phase.Properties.Units.forEach(unitData => {
					const superProv = unitData.Province.split("/")[0];
					this.map.addUnit(
						"unit" + unitData.Unit.Type,
						unitData.Province,
						helpers.natCol(
							unitData.Unit.Nation,
							this.state.variant
						),
						false,
						false,
						"#units",
						{ stroke: this.phaseSpecialStrokes[superProv] }
					);
					this.debugCount("updateMap/renderedUnit");
				});
			} else {
				for (let prov in this.state.phase.Properties.Units) {
					let unit = this.state.phase.Properties.Units[prov];
					const superProv = prov.split("/")[0];
					this.map.addUnit(
						"unit" + unit.Type,
						prov,
						helpers.natCol(unit.Nation, this.state.variant),
						false,
						false,
						"#units",
						{ stroke: this.phaseSpecialStrokes[superProv] }
					);
					this.debugCount("updateMap/renderedVariantUnit");
				}
			}
			this.debugCount("updateMap/renderedUnits");

			if (this.state.phase.Properties.Dislodgeds instanceof Array) {
				this.state.phase.Properties.Dislodgeds.forEach(disData => {
					const superProv = disData.Province.split("/")[0];
					this.map.addUnit(
						"unit" + disData.Dislodged.Type,
						disData.Province,
						helpers.natCol(
							disData.Dislodged.Nation,
							this.state.variant
						),
						true,
						false,
						"#units",
						{ stroke: this.phaseSpecialStrokes[superProv] }
					);
					this.debugCount("updateMap/renderedDislodged");
				});
			} else {
				for (let prov in this.state.phase.Properties.Dislodgeds) {
					const superProv = prov.split("/")[0];
					let unit = this.state.phase.Properties.Units[prov];
					this.map.addUnit(
						"unit" + unit.Type,
						prov,
						helpers.natCol(unit.Nation, this.state.variant),
						true,
						false,
						"#units",
						{ stroke: this.phaseSpecialStrokes[superProv] }
					);
					this.debugCount("updateMap/renderedVariantDislodged");
				}
			}
		}
		this.renderOrders();
		this.snapshotSVG();
		this.acceptOrders();
	}
	renderOrders() {
		this.debugCount("renderOrders/called");
		const ordersHash = helpers.hash(
			JSON.stringify([
				this.state.orders,
				this.state.phase.Properties.Orders
			])
		);
		if (ordersHash != this.lastRenderedOrdersHash) {
			this.lastRenderedOrdersHash = ordersHash;
			this.debugCount("renderOrders/differentOrders");
			this.map.removeOrders();

			if (this.state.phase.Properties.Orders) {
				for (let nat in this.state.phase.Properties.Orders) {
					let orders = this.state.phase.Properties.Orders[nat];
					for (let prov in orders) {
						const superProv = prov.split("/")[0];
						let order = orders[prov];
						this.map.addOrder(
							[prov] + order,
							helpers.natCol(nat, this.state.variant),
							{ stroke: this.phaseSpecialStrokes[superProv] }
						);
						this.debugCount("renderOrders/renderedVariantOrder");
					}
				}
			}

			(this.state.orders || []).forEach(orderData => {
				const superProv = orderData.Parts[0].split("/")[0];
				this.map.addOrder(
					orderData.Parts,
					helpers.natCol(orderData.Nation, this.state.variant),
					{ stroke: this.phaseSpecialStrokes[superProv] }
				);
				this.debugCount("renderOrders/renderedOrder");
			});
			if (this.state.phase.Properties.Resolutions instanceof Array) {
				this.state.phase.Properties.Resolutions.forEach(res => {
					if (res.Resolution != "OK") {
						this.map.addCross(res.Province, "#ff0000");
					}
				});
				this.debugCount("renderOrders/renderedResolution");
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
				const natOrders = sum[el.Nation] || {};
				natOrders[el.Parts[0]] = el.Parts.slice(1);
				sum[el.Nation] = natOrders;
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
							this.addOptionHandlers(
								options,
								["edit", prov],
								["LabCommand", "Province"]
							);
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
				gtag("event", "lab_resolve");
				js.Properties.PhaseOrdinal =
					(this.state.phase.Properties.PhaseOrdinal || 1) + 1;
				this.props.labPhaseResolve({ Properties: variantPhase }, js);
			});
	}
	acceptOrders() {
		this.debugCount("acceptOrders/called");
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
							this.addOptionHandlers(js.Properties, [], []);
						}
					});
			}
		} else {
			if (Object.keys(this.state.options || {}).length > 0) {
				this.debugCount("acceptOrders/hasOptions");
				this.addOptionHandlers(this.state.options, [], []);
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
							return (
								order.Parts[0].split("/")[0] !=
								parts[1].split("/")[0]
							);
						})
					},
					this.acceptOrders
				);
			} else {
				this.setState((state, props) => {
					state = Object.assign({}, state);
					state.orders = state.orders.filter(order => {
						return order.Parts[0] != parts[0];
					});
					state.orders.push({
						Parts: parts,
						Nation: this.state.labPlayAs
					});
					return state;
				}, this.acceptOrders);
			}
		}
	}
	filterOK(filter, prov) {
		const parts = filter.split(":");
		if (parts[0] == "MAX") {
			if (this.state.orders) {
				if (
					this.state.orders.find(o => {
						return o.Parts[0] == prov;
					})
				) {
					return true;
				}
				if (
					this.state.orders.filter(o => {
						return o.Parts[1] == parts[1];
					}).length > Number.parseInt(parts[2])
				) {
					return false;
				}
			}
			return true;
		}
		return true;
	}
	addOptionHandlers(options, parts, types) {
		this.debugCount("addOptionsHandlers/called");
		if (Object.keys(options).length == 0) {
			this.debugCount("addOptionsHandlers/orderDone");
			if (this.state.laboratoryMode) {
				this.handleLaboratoryCommand(parts);
				this.acceptOrders();
			} else {
				this.snackbarIncompleteOrder(parts, types, "Done"),
					helpers.incProgress();
				this.debugCount("addOptionsHandlers/regularOrder");
				this.createOrder(parts).then(resp => {
					if (resp.status == 412) {
						helpers.snackbar(
							"The server claims you are not able to edit orders any more - maybe the phase has resolved?"
						);
						return;
					}
					gtag("event", "create_order");
					this.debugCount("addOptionsHandlers/orderCreated");
					this.loadCorroboratePromise().then(corr => {
						this.debugCount("addOptionsHandlers/newOrdersLoaded");
						helpers.decProgress();
						this.setState(
							{ orders: corr.Properties.Orders },
							this.acceptOrders
						);
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
			this.snackbarIncompleteOrder(parts, types, type);
			this.debugCount("addOptionsHandlers/type/" + type);
			switch (type) {
				case "Province":
					for (let prov in options) {
						const filter = options[prov].Filter;
						if (!filter || this.filterOK(filter, prov)) {
							this.map.addClickListener(
								prov,
								prov => {
									this.map.clearClickListeners();
									this.debugCount(
										"addOptionshandler/" + prov + "Clicked"
									);
									this.addOptionHandlers(
										options[prov].Next,
										parts.concat(prov),
										types.concat(type)
									);
								},
								{ touch: true }
							);
							this.debugCount(
								"addOptionsHandlers/addedClickListener"
							);
						}
						this.debugCount("addOptionsHandlers/checkedFilterOK");
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
									parts.concat(ord),
									types.concat(type)
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
							this.debugCount(
								"addOptionshandler/selectedOrder" + ord
							);
							if (ord == "Clear") {
								if (this.state.laboratoryMode) {
									this.handleLaboratoryCommand(
										["Clear"].concat(parts)
									);
									this.acceptOrders();
								} else {
									helpers.incProgress();
									this.deleteOrder(parts[0]).then(_ => {
										gtag("event", "delete_order");
										this.loadCorroboratePromise().then(
											corr => {
												helpers.decProgress();
												this.setState(
													{
														orders:
															corr.Properties
																.Orders
													},
													this.acceptOrders
												);
											}
										);
									});
								}
							} else if (ord == "Cancel") {
								this.acceptOrders();
							} else {
								this.addOptionHandlers(
									options[ord].Next,
									parts.concat(ord),
									types.concat(type)
								);
							}
						}
					});
					this.debugCount("addOptionsHandlers/openedOrderDialog");
					break;
				case "SrcProvince":
					let srcProvince = Object.keys(options)[0];
					parts[0] = srcProvince;
					this.addOptionHandlers(
						options[srcProvince].Next,
						parts,
						types
					);
					this.debugCount("addOptionsHandlers/assignedSrcProvince");
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
