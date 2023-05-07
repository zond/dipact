/* eslint-disable no-restricted-globals */
import React from "react";
import gtag from "ga-gtag";
import $ from "jquery";

import * as helpers from "../helpers";
import Globals from "../Globals";
import OrderDialog from "./OrderDialog";
import { dippyMap } from "../static/js/dippymap";
import PZ from "../static/js/pz.js";

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
			labPlayAs: "",
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
		this.currentNation = this.currentNation.bind(this);
		this.debugCount = this.debugCount.bind(this);
		this.infoClicked = this.infoClicked.bind(this);
		this.setMapSubtitle = this.setMapSubtitle.bind(this);
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

	currentNation() {
		if (this.state.laboratoryMode) {
			return this.state.labPlayAs;
		} else if (this.state.member) {
			return this.state.member.Nation;
		} else {
			return "";
		}
	}
	setMapSubtitle() {
		const svgEl = document.getElementById("map").children[0];
		if (!svgEl) {
			return;
		}
		let dipMapTitle = document.getElementById("dip-map-title");
		if (!dipMapTitle) {
			const addToBottom = svgEl.viewBox.baseVal.height * 0.07;
			const spacing = addToBottom * 0.12;
			const realEstate = addToBottom - spacing;
			const titleRealEstate = realEstate * 0.66;
			// I'm assuming 1/3 of the font size can stretch below the base line.
			const titleFontSize = Math.floor(titleRealEstate * 0.66);
			const promoRealEstate = realEstate - titleRealEstate;
			const promoFontSize = Math.floor(promoRealEstate * 0.66);

			const container = document.createElementNS(
				"http://www.w3.org/2000/svg",
				"g"
			);
			const backgroundBox = document.createElementNS(
				"http://www.w3.org/2000/svg",
				"rect"
			);
			backgroundBox.setAttribute("y", svgEl.viewBox.baseVal.height);
			backgroundBox.setAttribute("x", svgEl.viewBox.baseVal.x);
			backgroundBox.setAttribute("width", svgEl.viewBox.baseVal.width);
			backgroundBox.setAttribute("height", addToBottom);
			backgroundBox.setAttribute("fill", "black");
			container.appendChild(backgroundBox);
			dipMapTitle = document.createElementNS(
				"http://www.w3.org/2000/svg",
				"text"
			);
			dipMapTitle.setAttribute("x", svgEl.viewBox.baseVal.x);
			dipMapTitle.setAttribute(
				"y",
				svgEl.viewBox.baseVal.height + spacing + titleFontSize
			);
			dipMapTitle.style.fill = "#fde2b5";
			dipMapTitle.style.fontSize = titleFontSize + "px";
			dipMapTitle.style.fontFamily =
				'"Libre Baskerville", "Cabin", Serif';
			dipMapTitle.setAttribute("id", "dip-map-title");
			container.appendChild(dipMapTitle);
			const promo = document.createElementNS(
				"http://www.w3.org/2000/svg",
				"text"
			);
			promo.setAttribute("x", svgEl.viewBox.baseVal.x);
			promo.setAttribute(
				"y",
				svgEl.viewBox.baseVal.height +
					spacing +
					titleRealEstate +
					promoFontSize
			);
			promo.style.fill = "#fde2b5";
			promo.style.fontSize = promoFontSize + "px";
			promo.style.fontFamily = '"Libre Baskerville", "Cabin", Serif';
			promo.innerHTML = "https://diplicity.com";
			container.appendChild(promo);
			const heightChange =
				(svgEl.viewBox.baseVal.height + addToBottom) /
				svgEl.viewBox.baseVal.height;
			this.mapDims[1] *= heightChange;
			svgEl.viewBox.baseVal.height =
				svgEl.viewBox.baseVal.height + addToBottom;
			svgEl.appendChild(container);
		}
		dipMapTitle.innerHTML =
			helpers.gameDesc(this.state.game) +
			" - " +
			helpers.phaseName(this.state.phase);
	}
	infoClicked(prov) {
		prov = prov.split("/")[0];
		let info = helpers.provName(this.props.variant, prov);
		if (this.state.phase.Properties.SupplyCenters) {
			const owner = this.state.phase.Properties.SupplyCenters[prov];
			if (owner) {
				info += "(" + owner + ")";
			}
		} else {
			this.state.phase.Properties.SCs.forEach((scData) => {
				if (scData.Province.split("/")[0] === prov) {
					info += " (" + scData.Owner + ")";
				}
			});
		}
		if (this.state.phase.Properties.Units instanceof Array) {
			this.state.phase.Properties.Units.forEach((unitData) => {
				if (unitData.Province.split("/")[0] === prov) {
					info +=
						", " +
						unitData.Unit.Type +
						" (" +
						unitData.Unit.Nation +
						")";
				}
			});
		} else {
			for (let unitProv in this.state.phase.Properties.Units) {
				const unit = this.state.phase.Properties.Units[unitProv];
				if (prov === unitProv.split("/")[0]) {
					info += ", " + unit.Type + " (" + unit.Nation + ")";
				}
			}
		}
		helpers.snackbar(info, 1);
	}
	snackbarIncompleteOrder(parts, nextType) {
		let msg = helpers.humanizeOrder(this.state.variant, parts, nextType);
		if (nextType === "Done") {
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
			force: true,
		}).then((data) => {
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
				Properties: variantPhase,
			});
		fetch(
			new Request(
				"https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=AIzaSyDxQpMuCYlu95_oG7FUCLFIYIIfvKz-4D8",
				{
					method: "POST",
					headers: {
						Accept: "application/json",
					},
					body: JSON.stringify({
						dynamicLinkInfo: {
							domainUriPrefix: "dipact.page.link",
							link: url,
							navigationInfo: {
								enableForcedRedirect: true,
							},
						},
						suffix: {
							option: "SHORT",
						},
					}),
				}
			)
		)
			.then((resp) => resp.json())
			.then((js) => {
				helpers.copyToClipboard(js.shortLink).then(
					(_) => {
						helpers.snackbar("Copied URL to clipboard");
					},
					(err) => {
						console.log(err);
					}
				);
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
			const mapEl = document.getElementById("map");
			const svg = mapEl.children[0].cloneNode(true);
			svg.setAttribute("width", this.mapDims[0] * scale);
			svg.setAttribute("height", this.mapDims[1] * scale);
			const svgXML = this.svgSerializer.serializeToString(svg);
			const svgHash = helpers.hash(svgXML);
			if (opts.force || svgHash !== this.lastSerializedSVG) {
				this.debugCount("getSVGData/differentHash");
				this.lastSerializedSVG = svgHash;
				const serializedSVG = btoa(
					unescape(encodeURIComponent(svgXML))
				);
				const snapshotImage = document.createElement("img");
				snapshotImage.style.width = this.mapDims[0] * scale;
				snapshotImage.style.height = this.mapDims[1] * scale;
				snapshotImage.src =
					"data:image/svg+xml;base64," + serializedSVG;
				snapshotImage.addEventListener("load", (_) => {
					this.debugCount("getSVGData/loadedSnapshot");
					if ("createImageBitmap" in window) {
						createImageBitmap(
							snapshotImage,
							0,
							0,
							snapshotImage.width,
							snapshotImage.height
						).then((bitmap) => {
							const snapshotCanvas =
								document.createElement("canvas");
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
								.getContext("bitmaprenderer")
								.transferFromImageBitmap(bitmap);
							res(snapshotCanvas.toDataURL("image/png"));
						});
					} else {
						const snapshotCanvas = document.createElement("canvas");
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
					}
				});
			}
		});
	}
	snapshotSVG() {
		const snapshotEl = document.getElementById("mapSnapshot");
		if (snapshotEl && this.mapDims[0] > 0 && this.mapDims[1] > 0) {
			this.getSVGData().then((data) => {
				if (data) {
					snapshotEl.src = data;
				}
			});
		}
	}
	createOrder(parts) {
		const setOrderLink = this.state.phase.Links.find((l) => {
			return l.Rel === "create-and-corroborate";
		});
		if (setOrderLink) {
			return helpers
				.safeFetch(
					helpers.createRequest(setOrderLink.URL, {
						method: setOrderLink.Method,
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({ Parts: parts }),
					})
				)
				.then((resp) => {
					if (this.state.member.NewestPhaseState.OnProbation) {
						this.props.onLeaveProbation();
					}
					return Promise.resolve(resp);
				});
		} else {
			return Promise.resolve(null);
		}
	}
	deleteOrder(prov) {
		const order = this.state.orders.find((o) => {
			return o.Parts[0].split("/")[0] === prov.split("/")[0];
		});
		if (order) {
			return helpers.safeFetch(
				helpers.createRequest(
					"/Game/" +
						this.state.game.Properties.ID +
						"/Phase/" +
						this.state.phase.Properties.PhaseOrdinal +
						"/Order/" +
						order.Parts[0].replace("/", "_"),
					{
						method: "DELETE",
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
		const corroborateLink = this.state.phase.Links.find((l) => {
			return l.Rel === "corroborate";
		});
		if (corroborateLink) {
			const promiseFunc = (_) => {
				return helpers
					.safeFetch(helpers.createRequest(corroborateLink.URL))
					.then((resp) => resp.json())
					.then((js) => {
						return js;
					});
			};
			return new Promise((res, rej) => {
				(this.state.phase.Properties.Resolved
					? helpers.memoize(corroborateLink.URL, promiseFunc)
					: promiseFunc()
				).then((js) => {
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
			this.props.game.Properties.ID !== prevProps.game.Properties.ID ||
			this.props.phase.Links !== prevProps.phase.Links ||
			!this.state.phase ||
			this.props.phase.Properties.PhaseOrdinal !==
				prevProps.phase.Properties.PhaseOrdinal ||
			this.props.laboratoryMode !== this.state.laboratoryMode ||
			this.props.game.Started !== prevProps.game.Started
		) {
			this.debugCount("componentDidUpdate/forwardProps");
			this.setState({
				game: this.props.game,
				member: (this.props.game.Properties.Members || []).find((e) => {
					return e.User.Email === Globals.user.Email;
				}),
				svgLoaded:
					this.state.svgLoaded &&
					this.props.game.Properties.ID ===
						prevProps.game.Properties.ID,
				phase: this.props.phase,
				laboratoryMode: this.props.laboratoryMode,
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
			const mapEl = document.getElementById("map");
			this.mapDims = [mapEl.clientWidth, mapEl.clientHeight];
			this.snapshotSVG();
		}
		// If anything that requires rendering new orders or options has changed.
		if (
			this.state.laboratoryMode !== prevState.laboratoryMode ||
			!prevState.game ||
			!prevState.phase ||
			this.state.phase.Links !== prevState.phase.Links ||
			this.state.game.Properties.ID !== prevState.game.Properties.ID ||
			this.state.phase.Properties.PhaseOrdinal !==
				prevState.phase.Properties.PhaseOrdinal
		) {
			this.debugCount("componentDidUpdate/reRender");
			if (this.state.laboratoryMode) {
				// If we ARE in laboratory mode, reload orders if phase is "real".
				if (
					this.state.phase.Links &&
					this.state.phase.Properties.GameID
				) {
					this.loadCorroboratePromise().then((corroboration) => {
						this.setState({
							orders: corroboration.Properties.Orders,
						});
					});
				} else {
					// Otherwise use the orders in the phase, which we should have saved when we created it.
					const orders = [];
					Object.keys(
						this.state.phase.Properties.Orders || {}
					).forEach((nation) => {
						Object.keys(
							this.state.phase.Properties.Orders[nation]
						).forEach((province) => {
							orders.push({
								Nation: nation,
								Parts: [province].concat(
									this.state.phase.Properties.Orders[nation][
										province
									]
								),
							});
						});
					});
					this.setState({ orders: orders });
				}
			} else {
				this.debugCount("componentDidUpdate/reRenderNormal");
				// If we are NOT in laboratory mode, reload options AND orders.
				if (this.state.phase.Links) {
					const silent = this.firstLoadFinished;
					if (!silent) {
						helpers.incProgress();
					}
					const promises = [this.loadCorroboratePromise()];
					const optionsLink = this.state.phase.Links.find((l) => {
						return l.Rel === "options";
					});
					if (optionsLink) {
						this.debugCount("componentDidUpdate/reRenderOptions");
						promises.push(
							helpers.memoize(optionsLink.URL, (_) => {
								return helpers
									.safeFetch(
										helpers.createRequest(optionsLink.URL)
									)
									.then((resp) => resp.json())
									.then((js) => {
										return js.Properties;
									});
							})
						);
					} else {
						promises.push(Promise.resolve(null));
					}
					Promise.all(promises).then((values) => {
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
							options: values[1],
						});
					});
				}
			}
		}
		// Reload all the SVGs if the new state has a new game.
		if (
			!prevState.game ||
			this.state.game.Properties.ID !== prevState.game.Properties.ID
		) {
			this.debugCount("componentDidUpdate/loadSVGs");
			this.setState(
				(state, props) => {
					const member = (
						this.state.game.Properties.Members || []
					).find((e) => {
						return e.User.Email === Globals.user.Email;
					});
					const variant = Globals.variants.find((v) => {
						return (
							v.Properties.Name ===
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
				(_) => {
					const variantMapSVG =
						"/Variant/" +
						this.state.game.Properties.Variant +
						"/Map.svg";
					const promises = [
						helpers.memoize(variantMapSVG, (_) => {
							return helpers
								.safeFetch(helpers.createRequest(variantMapSVG))
								.then((resp) => resp.text());
						}),
						Promise.all(
							this.state.variant.Properties.UnitTypes.map(
								(unitType) => {
									const variantUnitSVG =
										"/Variant/" +
										this.state.game.Properties.Variant +
										"/Units/" +
										unitType +
										".svg";
									return helpers.memoize(
										variantUnitSVG,
										(_) => {
											return helpers
												.safeFetch(
													helpers.createRequest(
														variantUnitSVG
													)
												)
												.then((resp) => resp.text())
												.then((svg) => {
													return {
														name: unitType,
														svg: svg,
													};
												});
										}
									);
								}
							)
						),
					];
					Promise.all(promises).then((values) => {
						const mapSVG = values[0];
						const mapEl = document.getElementById("map");
						mapEl.innerHTML = mapSVG;
						this.mapDims = [mapEl.clientWidth, mapEl.clientHeight];

						this.map = dippyMap($("#map"));
						Object.keys(
							this.state.variant.Properties.Graph.Nodes
						).forEach((superProv) => {
							Object.keys(
								this.state.variant.Properties.Graph.Nodes[
									superProv
								].Subs
							).forEach((subProv) => {
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
										touch: true,
									}
								);
							});
						});

						const showSnapshot = (e) => {
							document.getElementById("map").style.display =
								"none";
							document.getElementById(
								"mapSnapshot"
							).style.display = "flex";
						};
						const showSVG = (e) => {
							document.getElementById("map").style.display =
								"flex";
							document.getElementById(
								"mapSnapshot"
							).style.display = "none";
						};
						new PZ({
							pzid: "dip-map",
							minScale: 0.5,
							maxScale: 20,
							maxTrans: 0.5,
							el: document.getElementById("map-container"),
							viewPort: document.getElementById("map-viewport"),
							onZoomStart: showSnapshot,
							onZoomEnd: showSVG,
							onPanStart: showSnapshot,
							onPanEnd: showSVG,
						});

						const variantUnits = values[1];
						variantUnits.forEach((unitData) => {
							const container = document.createElement("div");
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
							page_location: location.href,
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
		this.setMapSubtitle();
		this.debugCount("updateMap/hasSVGs");
		const phaseHash = helpers.hash(JSON.stringify(this.state.phase));
		const nodes = this.state.variant.Properties.Graph.Nodes;

		if (phaseHash !== this.lastRenderedPhaseHash) {
			this.lastRenderedPhaseHash = phaseHash;
			this.debugCount("updateMap/differentPhase");

			this.phaseSpecialStrokes = {};
			let SCs = {};
			if (this.state.phase.Properties.SupplyCenters) {
				SCs = this.state.phase.Properties.SupplyCenters;
			} else {
				this.state.phase.Properties.SCs.forEach((scData) => {
					SCs[scData.Province] = scData.Owner;
				});
			}
			for (let prov in nodes) {
				const node = nodes[prov];
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

			//Don't do any map colouring if feature is turned off.

			if (
				JSON.parse(localStorage.getItem("colourNonSCs")) === true ||
				JSON.parse(localStorage.getItem("colourNonSCs")) === null
			) {
				//Here we check each non-SC and non-Sea territory. If all surrounding SCs are of the same power and none is "Neutral", colour them that power.
				//Get all nodes, disqualify Sea and SC, and per node collect the edges in an array.

				for (let prov in nodes) {
					const node = nodes[prov];
					if (!node.SC && node.Subs[""].Flags.Land) {
						const borderProvs = [];
						for (let edge in node.Subs[""].Edges) {
							const edgenode = nodes[edge];
							if (typeof edgenode !== "undefined") {
								if (edgenode.SC) {
									borderProvs.push(SCs[edgenode.Name]);
								}
							}
						}

						// check if all members of array are equal/not neutral.
						const compareProv = borderProvs.find(
							(element) => element !== undefined
						);

						let shouldDraw = borderProvs.every(
							(prov) => prov === compareProv || prov === "Neutral"
						);

						const countNeutral = borderProvs.filter(
							(prov) => prov === undefined || prov === "Neutral"
						).length;

						if (
							countNeutral === borderProvs.length ||
							countNeutral > 0
						) {
							shouldDraw = false;
						}

						//if all equal, draw the colour.
						if (shouldDraw) {
							const col = helpers.natCol(
								borderProvs[0],
								this.state.variant
							);
							this.map.colorProvince(prov, col);
						}
						//if by the default rule we don't draw it, check if "special" rules apply.
						else {
							//Need to escape if starting provinces have not been defined
							if (
								this.props.variant.Properties
									.ExtraDominanceRules != null
							) {
								//if prov is startingprovince

								if (
									prov in
									this.props.variant.Properties
										.ExtraDominanceRules
								) {
									//Cycle through all startingprovince dependencies
									let shouldEventuallyDraw = true;
									for (const influencedprov of Object.entries(
										this.props.variant.Properties
											.ExtraDominanceRules[prov]
											.Dependencies
									)) {
										//Check if no SC owner, change to neutral
										let tempSC;
										if (
											typeof SCs[influencedprov[0]] ===
											"undefined"
										) {
											tempSC = "Neutral";
										} else {
											tempSC = SCs[influencedprov[0]];
										}

										// check if all SCs follow the starting province rule.
										// If not because they're not neutral, check the neutral one is owned by the favouring country (should have no effect)
										// If one is owned by someone else than defined (neutral not being the favouring country), don't draw
										if (
											influencedprov[1] !== tempSC &&
											tempSC !==
												this.props.variant.Properties
													.ExtraDominanceRules[prov]
													.Nation
										) {
											shouldEventuallyDraw = false;
											break;
										}
									}

									//Check if we should STILL draw it or not.
									if (shouldEventuallyDraw) {
										const col = helpers.natCol(
											this.props.variant.Properties
												.ExtraDominanceRules[prov]
												.Nation,
											this.state.variant
										);
										this.map.colorProvince(prov, col);
									} else {
										this.map.hideProvince(prov);
									}
								}
							}
						}
					}
				}
			}

			this.map.showProvinces();
			this.debugCount("updateMap/renderedProvinces");

			this.map.removeUnits();
			if (this.state.phase.Properties.Units instanceof Array) {
				this.state.phase.Properties.Units.forEach((unitData) => {
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
					const unit = this.state.phase.Properties.Units[prov];
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
				this.state.phase.Properties.Dislodgeds.forEach((disData) => {
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
					const unit = this.state.phase.Properties.Units[prov];
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
				this.state.phase.Properties.Orders,
			])
		);
		if (ordersHash !== this.lastRenderedOrdersHash) {
			this.lastRenderedOrdersHash = ordersHash;
			this.debugCount("renderOrders/differentOrders");
			this.map.removeOrders();

			if (this.state.phase.Properties.Orders) {
				for (let nat in this.state.phase.Properties.Orders) {
					const orders = this.state.phase.Properties.Orders[nat];

					for (let prov in orders) {
						const superProv = prov.split("/")[0];
						const order = orders[prov];

						//TODO what is this? Also needs to have resolution added
						this.map.addOrder(
							[prov] + order,
							helpers.natCol(nat, this.state.variant),
							{ stroke: this.phaseSpecialStrokes[superProv] }
						);
						this.debugCount("renderOrders/renderedVariantOrder");
					}
				}
			}

			//Here we resort the orders so Move is drawn last (on top)
			const valueMap = {
				Move: 5,
				Hold: 4,
				Convoy: 3,
				MoveViaConvoy: 2,
				Support: 1,
			};

			if (this.state.orders != null || this.state.orders != undefined) {
				this.state.orders.sort(
					(a, b) => valueMap[a.Parts[1]] - valueMap[b.Parts[1]]
				);
			}

			(this.state.orders || []).forEach((orderData) => {
				const superProv = orderData.Parts[0].split("/")[0];
				//        console.log("Processing province: " + superProv);
				var failOrder = false;

				//Check the resolution is true
				if (
					Array.isArray(this.state.phase.Properties.Resolutions) &&
					this.state.phase.Properties.Resolutions !== null
				) {
					const resolutionIndex =
						this.state.phase.Properties.Resolutions.findIndex(
							(item) => item.Province.indexOf(superProv) != -1
						);
					if (
						resolutionIndex !== -1 &&
						this.state.phase.Properties.Resolutions[resolutionIndex]
							.Resolution !== "OK"
					) {
						failOrder = true;
					}
				}
				console.log(orderData.Parts);
				//When the order is a move order but the province is not adjacent, replace by moveviaconvoy
				if (orderData.Parts[1] === "Move" && !failOrder) {
					var graphNodes =
						this.state.variant.Properties.Graph.Nodes[
							orderData.Parts[0]
						];

					if (
						!graphNodes?.Subs?.[""]?.Edges?.hasOwnProperty(
							orderData.Parts[2]
						)
					) {
						//Not adjacent, so change to MoveViaConvoy
						orderData.Parts[1] = "MoveViaConvoy";
					}
				}
				console.log(orderData.Parts);

				// IF THIS UNIT IS A CONVOY AND WE'RE POST-RESOLUTION, DEFINE THE FASTEST ROUTE
				if (
					(orderData.Parts[1] === "MoveViaConvoy" &&
						this.state.phase.Properties.Resolved === true) ||
					(orderData.Parts[1] === "Convoy" &&
						this.state.phase.Properties.Resolved === true)
				) {
					console.log("executing fastestpath");
					if (orderData.Parts[1] === "MoveViaConvoy") {
						//Create list of all participating convoys
						var convoyParticipants = this.state.orders
							.filter(
								(obj) =>
									obj.Parts[1] === "Convoy" &&
									obj.Parts[2] === orderData.Parts[0] &&
									obj.Parts[3] === orderData.Parts[2]
							)
							.map((element) => element.Parts[0]);

						//Add the start and end Participants in preparation of Dijkstra
						convoyParticipants.push(orderData.Parts[0]);
						convoyParticipants.push(orderData.Parts[2]);
					} else if (orderData.Parts[1] === "Convoy") {
						//Create list of all participating convoys
						var convoyParticipants = this.state.orders
							.filter(
								(obj) =>
									obj.Parts[1] === "Convoy" &&
									obj.Parts[2] === orderData.Parts[2] &&
									obj.Parts[3] === orderData.Parts[3]
							)
							.map((element) => element.Parts[0]);
						//Add the start and end Participants in preparation of Dijkstra
						convoyParticipants.push(orderData.Parts[2]);
						convoyParticipants.push(orderData.Parts[3]);
					}

					/////////////////////// Use Dijsktra's algorithm to calculate the fastest path

					//Copy the Nodes to make them accessible in the function
					const edgesMap = this.state.variant.Properties.Graph.Nodes;
					var fastestPath;

					function findPath(
						startProvince,
						endProvince,
						participatingProvinces
					) {
						class PriorityQueue {
							constructor() {
								this.items = [];
							}

							enqueue(element, priority) {
								const item = { element, priority };
								let added = false;
								for (let i = 0; i < this.items.length; i++) {
									if (
										item.priority < this.items[i].priority
									) {
										this.items.splice(i, 0, item);
										added = true;
										break;
									}
								}
								if (!added) {
									this.items.push(item);
								}
							}

							dequeue() {
								return this.items.shift().element;
							}

							isEmpty() {
								return this.items.length === 0;
							}
						}

						// Create a priority queue to store the nodes to be explored
						let queue = new PriorityQueue();

						// Create a map to store the distance from the start node to each node
						let distances = new Map();

						// Create a map to store the previous node in the optimal path from the start node to each node
						let previous = new Map();

						// Initialize the distance map and queue with the start node
						distances.set(startProvince, 0);
						queue.enqueue(startProvince, 0);

						// Loop until we have found the end node or the queue is empty
						while (!queue.isEmpty()) {
							// Get the node with the smallest distance from the start node
							let currentProvince = queue.dequeue();

							// If we have found the end node, construct and return the optimal path
							if (currentProvince === endProvince) {
								let path = [];
								while (previous.has(currentProvince)) {
									path.unshift(currentProvince);
									currentProvince =
										previous.get(currentProvince);
								}
								path.unshift(startProvince);
								return path;
							}

							// Get the neighboring nodes of the current node
							//let neighbors = connectedProvinces.find(p => p.province === currentProvince).Connect;

							let edges =
								edgesMap[currentProvince].Subs[""].Edges;
							const neighbors = Object.keys(edges);

							// Loop through the neighboring nodes
							for (let neighbor of neighbors) {
								// Check if the neighbor is a participating province
								if (
									!participatingProvinces.includes(neighbor)
								) {
									continue;
								}

								// Compute the distance from the start node to the neighbor
								let distance =
									distances.get(currentProvince) + 1;

								// Update the distance and previous maps if we have found a shorter path to the neighbor
								if (
									!distances.has(neighbor) ||
									distance < distances.get(neighbor)
								) {
									distances.set(neighbor, distance);
									previous.set(neighbor, currentProvince);
									let priority =
										distance +
										heuristic(neighbor, endProvince); // Using heuristic function that estimates the remaining distance
									queue.enqueue(neighbor, priority);
								}
							}
						}

						// If we have explored all nodes and have not found a path, return null
						return null;
					}

					// Define a simple heuristic function that estimates the remaining distance
					function heuristic(node, endNode) {
						return 1; // Assuming all edges have equal distance
					}

					// Invoke Dijkstra to find the fastest path
					let participatingProvinces = convoyParticipants;
					let connectedProvinces =
						this.state.variant.Properties.Graph.Nodes;
					var startProvince;
					var endProvince;
					if (orderData.Parts[1] === "MoveViaConvoy") {
						startProvince = orderData.Parts[0];
						endProvince = orderData.Parts[2];
					} else if (orderData.Parts[1] === "Convoy") {
						startProvince = orderData.Parts[2];
						endProvince = orderData.Parts[3];
					}
					console.log("now really executing");
					console.log(startProvince);
					console.log(endProvince);
					console.log(participatingProvinces);
					console.log(connectedProvinces);
					fastestPath = findPath(
						startProvince,
						endProvince,
						participatingProvinces,
						connectedProvinces
					);
				}

				var convoyOrder = [];
				if (
					orderData.Parts[1] === "MoveViaConvoy" &&
					this.state.phase.Properties.Resolved === true
				) {
					convoyOrder.push(orderData.Parts[0]);
					convoyOrder.push(orderData.Parts[1]);
					fastestPath
						.slice(1)
						.forEach((element) => convoyOrder.push(element));
				}

				if (
					orderData.Parts[1] === "Convoy" &&
					this.state.phase.Properties.Resolved === true
				) {
					convoyOrder.push(orderData.Parts[0]);
					convoyOrder.push(orderData.Parts[1]);
					fastestPath.forEach((element) => convoyOrder.push(element));
				}

				//TODO: NEED TO DOUBLE CHECK PROVINCES AND "SC" AND "EC"S
				//TODO: NEED TO ADD 'SUPPORT HOLD' SUPPORT

				//Check and add collisions (if two orders or supports are colliding)

				var collides = false;

				if (
					orderData.Parts[1] === "Move" &&
					this.state.orders.find(
						(obj) =>
							obj.Parts[2] === orderData.Parts[0] &&
							obj.Parts[1] === "Move" &&
							obj.Parts[0] === orderData.Parts[2]
					)?.Parts[0] === orderData.Parts[2]
				) {
					collides = true;
				}
				//Check if a support order supports a move that is colliding (in that case, this move should indent: both moves will indent so both support should. The mirrored support will have the same result)
				if (
					orderData.Parts[1] === "Support" &&
					this.state.orders.find(
						(obj) =>
							obj.Parts[0] === orderData.Parts[2] &&
							obj.Parts[1] === "Move" &&
							obj.Parts[2] === orderData.Parts[3]
					)?.Parts[2] === orderData.Parts[3] &&
					this.state.orders.find(
						(obj) =>
							obj.Parts[0] === orderData.Parts[3] &&
							obj.Parts[1] === "Move" &&
							obj.Parts[2] === orderData.Parts[2]
					)?.Parts[2] === orderData.Parts[2]
				) {
					collides = true;
				} else if (
					// If a support does NOT support a colliding move (meaning 1 or no orders);
					orderData.Parts[1] === "Support" &&
					this.state.orders.find(
						(obj) =>
							obj.Parts[0] === orderData.Parts[3] &&
							obj.Parts[1] === "Support" &&
							obj.Parts[2] === orderData.Parts[2] &&
							obj.Parts[3] === orderData.Parts[0]
					)?.Parts[3] === orderData.Parts[0]
				) {
					//then check if the supports themselves collide. If they collide,
					if (
						!(
							this.state.orders.find(
								(obj) =>
									obj.Parts[0] === orderData.Parts[2] &&
									obj.Parts[1] === "Move" &&
									obj.Parts[2] === orderData.Parts[3]
							)?.Parts[2] === orderData.Parts[3]
						)
					) {
						// then check if THIS support is NOT supporting a real move. If not,

						// indent: this means either the other is (and this one should indent) or both are (and both should indent)
						//console.log("Double Support, I'm indenting");
						collides = true;
					} else if (
						this.state.orders.find(
							(obj) =>
								obj.Parts[0] === orderData.Parts[2] &&
								obj.Parts[1] === "Move" &&
								obj.Parts[2] === orderData.Parts[3]
						)?.Parts[2] === orderData.Parts[3]
					) {
						//console.log("Double support, I'm NOT indenting");
					}
				}

				if (
					(orderData.Parts[1] === "MoveViaConvoy" &&
						this.state.phase.Properties.Resolved === true) ||
					(orderData.Parts[1] === "Convoy" &&
						this.state.phase.Properties.Resolved === true)
				) {
					this.map.addOrder(
						convoyOrder,
						helpers.natCol(orderData.Nation, this.state.variant),
						{ stroke: this.phaseSpecialStrokes[superProv] },
						failOrder,
						collides
					);
				} else {
					this.map.addOrder(
						orderData.Parts,
						helpers.natCol(orderData.Nation, this.state.variant),
						{ stroke: this.phaseSpecialStrokes[superProv] },
						failOrder,
						collides
					);
				}
				this.debugCount("renderOrders/renderedOrder");
			});

			//TODO: This is where they set the cross if the order is not okay. I've moved this away, but this is saved in case it's needed to double check
			/*
			if (this.state.phase.Properties.Resolutions instanceof Array) {
				this.state.phase.Properties.Resolutions.forEach((res) => {
					if (res.Resolution !== "OK") {
						this.map.addCross(res.Province, "#ffffff");
					}
				});
				this.debugCount("renderOrders/renderedResolution");
			}
*/

			if (this.state.phase.Properties.ForceDisbands instanceof Array) {
				this.state.phase.Properties.ForceDisbands.forEach((prov) => {
					this.map.addCross(prov, "#ff6600");
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
					: this.state.phase.Properties.Bounces || {},
		};
	}
	acceptEdits() {
		const unitOptions = {};
		this.state.variant.Properties.UnitTypes.forEach((unitType) => {
			unitOptions[unitType] = {
				Type: "LabCommand",
				Next: {},
			};
		});
		const nationUnitOptions = {
			Neutral: {
				Type: "LabCommand",
				Next: Object.assign({}, unitOptions),
			},
			None: { Type: "LabCommand", Next: {} },
		};
		const nationSCOptions = {
			Neutral: { Type: "LabCommand", Next: {} },
		};
		this.state.variant.Properties.Nations.forEach((nation) => {
			nationSCOptions[nation] = {
				Type: "LabCommand",
				Next: {},
			};
			nationUnitOptions[nation] = {
				Type: "LabCommand",
				Next: Object.assign({}, unitOptions),
			};
		});
		Object.keys(this.state.variant.Properties.Graph.Nodes).forEach(
			(superProv) => {
				const provData =
					this.state.variant.Properties.Graph.Nodes[superProv];
				Object.keys(provData.Subs).forEach((subProv) => {
					const name = superProv + (subProv ? "/" + subProv : "");
					this.map.addClickListener(
						name,
						(prov) => {
							this.map.clearClickListeners();
							const options = {
								Unit: {
									Type: "LabCommand",
									Next: Object.assign({}, nationUnitOptions),
								},
							};
							if (provData.SC) {
								options["SC"] = {
									Type: "LabCommand",
									Next: Object.assign({}, nationSCOptions),
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
		const optionsLink = this.state.variant.Links.find((l) => {
			return l.Rel === "resolve-state";
		});
		const variantPhase = this.makeVariantPhase();
		helpers
			.safeFetch(
				helpers.createRequest(optionsLink.URL, {
					method: optionsLink.Method,
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(variantPhase),
				})
			)
			.then((res) => res.json())
			.then((js) => {
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
				variantPhase.Orders = {};
				const optionsLink = this.state.variant.Links.find((l) => {
					return l.Rel === this.state.labPlayAs + "-options";
				});
				helpers
					.safeFetch(
						helpers.createRequest(optionsLink.URL, {
							method: optionsLink.Method,
							headers: {
								"Content-Type": "application/json",
							},
							body: JSON.stringify(variantPhase),
						})
					)
					.then((res) => res.json())
					.then((js) => {
						if (
							this.state.phase.Properties.PhaseOrdinal !==
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
				this.debugCount("acceptOrders/hasOptions");
				this.addOptionHandlers(this.state.options, []);
			}
		}
	}
	handleLaboratoryCommand(parts) {
		if (this.state.labEditMode) {
			if (parts[2] === "SC") {
				this.setState((state, props) => {
					state = Object.assign({}, state);
					state.phase = JSON.parse(JSON.stringify(state.phase));
					if (state.phase.Properties.SCs) {
						state.phase.Properties.SCs =
							state.phase.Properties.SCs.filter((sc) => {
								return sc.Province !== parts[1].split("/")[0];
							});
						if (parts[3] !== "Neutral") {
							state.phase.Properties.SCs.push({
								Province: parts[1].split("/")[0],
								Owner: parts[3],
							});
						}
					} else {
						delete (state.phase.Properties.SupplyCenters,
						parts[1].split("/")[0]);
						if (parts[3] !== "Neutral") {
							state.phase.Properties.SupplyCenters[
								parts[1].split("/")[0]
							] = parts[3];
						}
					}
					return state;
				}, this.acceptOrders);
			} else if (parts[2] === "Unit") {
				this.setState((state, props) => {
					state = Object.assign({}, state);
					state.phase = JSON.parse(JSON.stringify(state.phase));
					if (state.phase.Properties.Units instanceof Array) {
						state.phase.Properties.Units =
							state.phase.Properties.Units.filter((unit) => {
								return (
									unit.Province !== parts[1] &&
									unit.Province.split("/")[0] !==
										parts[1].split("/")[0]
								);
							});
						if (parts[3] !== "None") {
							const prov =
								parts[4] === "Army"
									? parts[1].split("/")[0]
									: parts[1];
							state.phase.Properties.Units.push({
								Province: prov,
								Unit: { Type: parts[4], Nation: parts[3] },
							});
						}
					} else {
						delete (state.phase.Properties.Units, parts[1]);
						delete (state.phase.Properties.Units,
						parts[1].split("/")[0]);
						if (parts[3] !== "None") {
							const prov =
								parts[4] === "Army"
									? parts[1].split("/")[0]
									: parts[1];
							state.phase.Properties.Units[prov] = {
								Type: parts[4],
								Nation: parts[3],
							};
						}
					}
					return state;
				}, this.acceptOrders);
			}
		} else {
			if (parts[0] === "Clear") {
				this.setState(
					{
						orders: (this.state.orders || []).filter((order) => {
							return (
								order.Parts[0].split("/")[0] !==
								parts[1].split("/")[0]
							);
						}),
					},
					this.acceptOrders
				);
			} else {
				this.setState((state, props) => {
					state = Object.assign({}, state);
					state.orders = (state.orders || []).filter((order) => {
						return order.Parts[0] !== parts[0];
					});
					state.orders.push({
						Parts: parts,
						Nation: this.state.labPlayAs,
					});
					return state;
				}, this.acceptOrders);
			}
		}
	}
	filterOK(filter, prov) {
		const parts = filter.split(":");
		if (parts[0] === "MAX") {
			if (this.state.orders) {
				if (
					this.state.orders.find((o) => {
						return o.Parts[0] === prov;
					})
				) {
					return true;
				}
				if (
					(this.state.orders || []).filter((o) => {
						return (
							o.Parts[1] === parts[1] &&
							o.Nation === this.currentNation()
						);
					}).length > Number.parseInt(parts[2])
				) {
					return false;
				}
			}
			return true;
		}
		return true;
	}
	addOptionHandlers(options, parts) {
		this.debugCount("addOptionsHandlers/called");
		if (Object.keys(options).length === 0) {
			this.debugCount("addOptionsHandlers/orderDone");
			if (this.state.laboratoryMode) {
				this.handleLaboratoryCommand(parts);
				this.acceptOrders();
			} else {
				this.snackbarIncompleteOrder(parts, "Done");
				helpers.incProgress();
				this.debugCount("addOptionsHandlers/regularOrder");
				this.createOrder(parts).then((resp) => {
					if (resp.status === 412) {
						helpers.decProgress();
						helpers.snackbar(
							"The server claims you are not able to edit orders any more - maybe the phase has resolved?"
						);
						return;
					}
					gtag("event", "create_order");
					this.debugCount("addOptionsHandlers/orderCreated");
					resp.json().then((corr) => {
						this.props.corroborateSubscriber(corr);
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
				if (type === null) {
					type = options[option].Type;
				} else if (type !== options[option].Type) {
					throw Error(
						"Can't use multiple types in the same level of options."
					);
				}
			}
			this.snackbarIncompleteOrder(parts, type);
			this.debugCount("addOptionsHandlers/type/" + type);
			switch (type) {
				case "Province":
					for (let prov in options) {
						const filter = options[prov].Filter;
						if (
							!filter ||
							(this.state.orders &&
								this.state.orders.find((o) => {
									return (
										o.Parts[0].split("/")[0] ===
										prov.split("/")[0]
									);
								})) ||
							this.filterOK(filter, prov)
						) {
							this.map.addClickListener(
								prov,
								(prov) => {
									this.map.clearClickListeners();
									this.debugCount(
										"addOptionshandler/" + prov + "Clicked"
									);
									this.addOptionHandlers(
										options[prov].Next,
										parts.concat(prov)
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
						onClick: (ord) => {
							if (ord === "Cancel") {
								this.acceptOrders();
							} else {
								this.addOptionHandlers(
									options[ord].Next,
									parts.concat(ord)
								);
							}
						},
					});
					break;
				case "UnitType":
				case "OrderType":
					this.orderDialog.setState({
						open: true,
						options: Object.keys(options).concat([
							"Clear",
							"Cancel",
						]),
						onClose: this.acceptOrders,
						onClick: (ord) => {
							this.debugCount(
								"addOptionshandler/selectedOrder" + ord
							);
							if (ord === "Clear") {
								if (this.state.laboratoryMode) {
									this.handleLaboratoryCommand(
										["Clear"].concat(parts)
									);
									this.acceptOrders();
								} else {
									helpers.incProgress();
									this.deleteOrder(parts[0]).then((_) => {
										gtag("event", "delete_order");
										this.loadCorroboratePromise().then(
											(corr) => {
												helpers.decProgress();
												this.setState(
													{
														orders: corr.Properties
															.Orders,
													},
													this.acceptOrders
												);
											}
										);
									});
								}
							} else if (ord === "Cancel") {
								this.acceptOrders();
							} else {
								this.addOptionHandlers(
									options[ord].Next,
									parts.concat(ord)
								);
							}
						},
					});
					this.debugCount("addOptionsHandlers/openedOrderDialog");
					break;
				case "SrcProvince":
					const srcProvince = Object.keys(options)[0];
					parts[0] = srcProvince;
					this.addOptionHandlers(options[srcProvince].Next, parts);
					this.debugCount("addOptionsHandlers/assignedSrcProvince");
					break;
				default:
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
				<div
					id="map-viewport"
					style={{
						height: "100%",
						overflow: "hidden",
					}}
				>
					<div id="map-container">
						<div
							style={{
								display: "flex",
								flexWrap: "wrap",
							}}
							key="map"
							id="map"
						></div>
						<img
							id="mapSnapshot"
							key="mapSnapshot"
							alt="Map snapshot"
							style={{
								width: "100%",
								flexWrap: "wrap",
								display: "none",
							}}
						/>
					</div>
				</div>
				<div
					key="units-div"
					style={{ display: "none" }}
					id="units-div"
				></div>
				<OrderDialog
					parentCB={(c) => {
						this.orderDialog = c;
					}}
					key="order-dialog"
				/>
			</React.Fragment>
		);
	}
}
