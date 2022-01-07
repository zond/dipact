import $ from "jquery";
import makeStyles from '@mui/styles/makeStyles';
import { useEffect, useState } from "react";

import * as helpers from "../helpers";
import {
  Order,
  Phase,
  Unit,
  UnitState,
} from "../store/types";
import { dippyMap } from "../static/js/dippymap";
import {
  CommandType,
  filterOk,
  handleLaboratoryOrderCommand,
  handleLaboratoryPhaseCommand,
  parseCommand,
} from "../utils/map";

const useStyles = makeStyles(() => ({
  viewport: {
    height: "100%",
    overflow: "hidden",
  },
  map: {
    display: "flex",
    flexWrap: "wrap",
  },
  mapSnapshot: {
    width: "100%",
    flexWrap: "wrap",
    display: "none",
  },
  unitsDiv: {
    display: "none",
  },
}));

type MapDims = { x: number | null; y: number | null };


type MapPhase = Omit<Phase, "Units"> & {
  SupplyCenters: { [key: string]: string };
  Units: UnitState[] | { [key: string]: Unit };
};

type Opt = {
  Type?: string;
  Filter?: string;
  Next: { [key: string]: Opt };
};

const DipMap = () => {
  // const [svgLoaded, setSvgLoaded] = useState(true);
  // const [lastRenderedPhaseHash, setLastRenderedPhaseHash] = useState<
  //   number | null
  // >(null);
  // const [lastRenderedOrdersHash, setLastRenderedOrdersHash] = useState<
  //   number | null
  // >(null);
  // const [lastSerializedSVG, setLastSerializedSVG] = useState<number | null>(
  //   null
  // );

  // TODO typing
  // const [
  //   phaseSpecialStrokes,
  //   setPhaseSpecialStrokes,
  // ] = useState<PhaseSpecialStrokes>({});


  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [mapDims, setMapDims] = useState<MapDims>({ x: null, y: null });

  // const [options, setOptions] = useState<Options>({});

  // const svgSerializer = new XMLSerializer();

  // Props
  const currentNation = "";
  const initialPhase: Phase = {
    PhaseOrdinal: 1,
    Season: "",
    Year: 1,
    Type: "",
    Resolved: false,
    CreatedAt: "",
    CreatedAgo: 1,
    ResolvedAt: "",
    ResolvedAgo: 1,
    DeadlineAt: "",
    NextDeadlineIn: 1,
    UnitsJSON: "",
    SCsJSON: "",
    GameID: "",
    Units: [],
    SCs: [],
    Dislodgeds: null,
    Dislodgers: null,
    ForceDisbands: null,
    Bounces: null,
    Resolutions: null,
    Host: "",
    SoloSCCount: 1,
    PreliminaryScores: [],
  };


  const classes = useStyles();

  const [phase, setPhase] = useState<MapPhase>({
    ...initialPhase,
    SupplyCenters: {},
  });

  const [orders, setOrders] = useState<Order[]>([
    {
      GameID: "game123",
      PhaseOrdinal: 10,
      Nation: "France",
      Parts: ["par", "Build", "Army"],
    },
  ]);

  // TODO

  // TODO

  const laboratoryMode = false;
  const labEditMode = false;
  const labPlayAs = "France";

  const map = dippyMap($("#map"));

  // TODO this could be replaced with normal react

  

  const handleLaboratoryCommand = (parts: string[]) => {
    const parsedCommand = parseCommand(parts);
    if (labEditMode) {
      if ([CommandType.SC, CommandType.Unit].includes(parsedCommand.type)) {
        const newPhase = handleLaboratoryPhaseCommand(phase, parts);
        setPhase(newPhase);
      }
    } else {
      const newOrders = handleLaboratoryOrderCommand(orders, parts, labPlayAs);
      setOrders(newOrders);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const addOptionHandlers = (
    options: { [key: string]: Opt },
    parts: string[]
  ) => {
    if (Object.keys(options).length === 0) {
      if (laboratoryMode) {
        handleLaboratoryCommand(parts);
      } else {
        // this.snackbarIncompleteOrder(parts, "Done");
        helpers.incProgress();
        // TODO how do we know this is a regular order?
        // TODO Create order
        // this.createOrder(parts).then((resp) => {
        //   if (resp.status === 412) {
        //     helpers.decProgress();
        //     helpers.snackbar(
        //       "The server claims you are not able to edit orders any more - maybe the phase has resolved?"
        //     );
        //     return;
        //   }
        //   gtag("event", "create_order");
        // resp.json().then((corr) => {
        //   this.props.corroborateSubscriber(corr);
        //   this.debugCount("addOptionsHandlers/newOrdersLoaded");
        //   helpers.decProgress();
        //   this.setState(
        //     { orders: corr.Properties.Orders },
        //     this.acceptOrders
        //   );
        // });
        // });
      }
    } else {
      let type: null | string = null;
      for (let option in options) {
        if (type === null) {
          type = options[option].Type || null;
        } else if (type !== options[option].Type) {
          throw Error("Can't use multiple types in the same level of options.");
        }
      }
      switch (type) {
        case "Province":
          for (let prov in options) {
            const filter = options[prov].Filter;
            if (
              !filter ||
              (orders &&
                orders.find((o) => {
                  return o.Parts[0].split("/")[0] === prov.split("/")[0];
                })) ||
              filterOk(filter, prov, orders, currentNation)
            ) {
              map.addClickListener(
                prov,
                (prov: string) => {
                  map.clearClickListeners();
                  // addOptionHandlers(options[prov].Next, parts.concat(prov));
                },
                { touch: true }
              );
            }
          }
          break;
        case "LabCommand":
          // this.orderDialog.setState({
          //   open: true,
          //   options: Object.keys(options).concat("Cancel"),
          //   onClose: this.acceptOrders,
          //   onClick: (ord) => {
          //     if (ord === "Cancel") {
          //       this.acceptOrders();
          //     } else {
          //       this.addOptionHandlers(options[ord].Next, parts.concat(ord));
          //     }
          //   },
          // });
          break;
        case "UnitType":
        case "OrderType":
          // this.orderDialog.setState({
          //   open: true,
          //   options: Object.keys(options).concat(["Clear", "Cancel"]),
          //   onClose: this.acceptOrders,
          //   onClick: (ord) => {
          //     this.debugCount("addOptionshandler/selectedOrder" + ord);
          //     if (ord === "Clear") {
          //       if (this.state.laboratoryMode) {
          //         this.handleLaboratoryCommand(["Clear"].concat(parts));
          //         this.acceptOrders();
          //       } else {
          //         helpers.incProgress();
          //         this.deleteOrder(parts[0]).then((_) => {
          //           gtag("event", "delete_order");
          //           this.loadCorroboratePromise().then((corr) => {
          //             helpers.decProgress();
          //             this.setState(
          //               {
          //                 orders: corr.Properties.Orders,
          //               },
          //               this.acceptOrders
          //             );
          //           });
          //         });
          //       }
          //     } else if (ord === "Cancel") {
          //       this.acceptOrders();
          //     } else {
          //       this.addOptionHandlers(options[ord].Next, parts.concat(ord));
          //     }
          //   },
          // });
          break;
        case "SrcProvince":
          const srcProvince = Object.keys(options)[0];
          parts[0] = srcProvince;
          // addOptionHandlers(options[srcProvince].Next, parts);
          break;
        default:
          break;
      }
    }
  };


  // const updateMap = () => {
  //   if (!svgLoaded) return; // TODO explainer comment

  //   const phaseHash = hash(JSON.stringify(phase));
  //   console.log(phaseHash);
  //   const nodes = variant.Start?.Graph.Nodes;

  //   // TODO use compare?
  //   if (phaseHash !== lastRenderedPhaseHash) {
  //     setLastRenderedPhaseHash(phaseHash);
  //     let tempPhaseSpecialStrokes: { [key: string]: string } = {};
  //     let SCs: { [key: string]: string } = {};

  //     phase.SCs.forEach((supplyCenter) => {
  //       SCs[supplyCenter.Province] = supplyCenter.Owner;
  //     });

  //     for (let prov in nodes) {
  //       const node = nodes[prov]; // TODO what's this about?
  //       if (node.SC && SCs[prov]) {
  //         const color = helpers.natCol(SCs[prov], variant);
  //         if (helpers.brightnessByColor(color) || 0 < 0.5) {
  //           // TODO fix
  //           tempPhaseSpecialStrokes[prov] = "#ffffff";
  //           map.colorSC(prov, "ffffff");
  //           // this.map.colorSC(prov, "ffffff"); TODO
  //         }
  //         map.colorProvince(prov, color);
  //       } else {
  //         map.hideProvince(prov);
  //       }
  //     }

  //     // colourNonSCs logic starts here
  //     const colourNonSCs = localStorage.getItem("colorNonSCs");

  //     // The user has teh colour non scs rule set to true (or default which is true)
  //     if (colourNonSCs === "true" || !colourNonSCs) {
  //       // Here we check each non-SC and non-Sea territory. If all surrounding SCs are of the same power and none is "Neutral", colour them that power.
  //       // Get all nodes, disqualify Sea and SC, and per node collect the edges in an array.

  //       // TODO is nodes ever undefined?
  //       if (nodes) {
  //         Object.values(nodes).forEach((node) => {
  //           const flags = node.Subs[""].Flags;
  //           const edgeKeys = Object.keys(node.Subs[""].Edges);

  //           // If node is a non-sc land province
  //           if (!node.SC && flags.Land) {
  //             // Get all provinces bordering this province that are not undefined and which have a supply center
  //             const borderProvs = edgeKeys
  //               .map((edgeKey) => nodes[edgeKey])
  //               .filter(
  //                 (edgeNode) => typeof edgeNode !== "undefined" && edgeNode.SC
  //               )
  //               .map((edgeNode) => SCs[edgeNode.Name]);

  //             // find the first province that is not undefined
  //             const compareProv = borderProvs.find(
  //               (prov) => prov !== undefined
  //             );

  //             // Only draw province if it is the compare province or neutral
  //             let shouldDraw = borderProvs.every(
  //               (prov) => prov === compareProv || prov === "Neutral"
  //             );

  //             const countNeutral = borderProvs.filter(
  //               (prov) => prov === undefined
  //             ).length;

  //             if (countNeutral === borderProvs.length || countNeutral > 0) {
  //               shouldDraw = false;
  //             }

  //             if (shouldDraw) {
  //               const color = helpers.natCol(borderProvs[0], variant);
  //               map.colorProvince(node.Name, color);
  //             } else {
  //               // Default rule doesn't apply so check for extra dominance rules
  //               const extraDominanceRules = variant.ExtraDominanceRules;
  //               if (extraDominanceRules !== null) {
  //                 // if prov is starting province
  //                 if (node.Name in extraDominanceRules) {
  //                   const rule = extraDominanceRules[node.Name];
  //                   const dependencies = rule.Dependencies;
  //                   const shouldEventuallyDraw = Object.entries(
  //                     dependencies
  //                   ).every(([dependencyProv, nation]) => {
  //                     const tempSC = SCs[dependencyProv] || "Neutral";
  //                     return !(nation !== tempSC && tempSC !== rule.Nation);
  //                   });
  //                   if (shouldEventuallyDraw) {
  //                     const color = helpers.natCol(rule.Nation, variant);
  //                     map.colorProvince(node.Name, color);
  //                   } else {
  //                     map.hideProvince(node.Name);
  //                   }
  //                 }
  //               }
  //             }
  //           }
  //         });
  //       }
  //     }

  //     // TODO explainer
  //     map.showProvinces();

  //     // TODO explainer
  //     map.removeUnits();

  //     // render units logic starts here
  //     // phase can be from variant or phase...
  //     const units = phase.Units as UnitState[] | { [key: string]: Unit };

  //     if (units instanceof Array) {
  //       units.forEach((unit) => {
  //         const superProv = unit.Province.split("/")[0];
  //         map.addUnit(
  //           "unit" + unit.Unit.Type,
  //           unit.Province,
  //           helpers.natCol(unit.Unit.Nation, variant),
  //           false,
  //           false,
  //           "#units",
  //           { stroke: phaseSpecialStrokes[superProv] }
  //         );
  //       });
  //     } else {
  //       Object.entries(units).forEach(([prov, unit]) => {
  //         const superProv = prov.split("/")[0];
  //         map.addUnit(
  //           "unit" + unit.Type,
  //           prov,
  //           helpers.natCol(unit.Nation, variant),
  //           false,
  //           false,
  //           "#units",
  //           { stroke: phaseSpecialStrokes[superProv] }
  //         );
  //       });
  //     }

  //     // render dislodgeds logic starts here
  //     // phase can be from variant or phase...
  //     const dislodgeds = phase.Dislodgeds as
  //       | Dislodged[]
  //       | { [key: string]: Unit };
  //     if (dislodgeds instanceof Array) {
  //       dislodgeds.forEach((dislodged) => {
  //         const superProv = dislodged.Province.split("/")[0];
  //         map.addUnit(
  //           "unit" + dislodged.Dislodged.Type,
  //           dislodged.Province,
  //           helpers.natCol(dislodged.Dislodged.Nation, variant),
  //           true,
  //           false,
  //           "#units",
  //           { stroke: phaseSpecialStrokes[superProv] }
  //         );
  //       });
  //     } else {
  //       Object.entries(dislodgeds).forEach(([prov, dislodged]) => {
  //         const superProv = prov.split("/")[0];
  //         const unit = dislodged;
  //         map.addUnit(
  //           "unit" + unit.Type,
  //           prov,
  //           helpers.natCol(unit.Nation, variant),
  //           true,
  //           false,
  //           "#units",
  //           { stroke: phaseSpecialStrokes[superProv] }
  //         );
  //       });
  //     }

  //     // render orders logic starts here
  //     const ordersHash = helpers.hash(
  //       // JSON.stringify([orders, phase.Orders])
  //       JSON.stringify([orders])
  //     );
  //     if (ordersHash !== lastRenderedOrdersHash) {
  //       setLastRenderedOrdersHash(ordersHash);
  //       map.removeOrders();

  //       (orders || []).forEach((order) => {
  //         const superProv = order.Parts[0].split("/")[0];
  //         map.addOrder(order.Parts, helpers.natCol(order.Nation, variant), {
  //           stroke: phaseSpecialStrokes[superProv],
  //         });
  //       });

  //       if (phase.Resolutions instanceof Array) {
  //         phase.Resolutions.forEach((res) => {
  //           if (res.Resolution !== "OK") {
  //             map.addCross(res.Province, "#ff0000"); // TODO remove hard coding
  //           }
  //         });
  //       }

  //       if (phase.ForceDisbands instanceof Array) {
  //         phase.ForceDisbands.forEach((prov) => {
  //           map.addCross(prov, "#ff6600"); // TODO remove hard coding
  //           map.addBox(prov, 4, "#ff6600"); // TODO remove hard coding
  //         });
  //       }
  //     }

  //     // Snapshot logic
  //     const snapshotEl = document.getElementById(
  //       "mapSnapshot"
  //     ) as HTMLImageElement;
  //     if (
  //       snapshotEl &&
  //       mapDims.x &&
  //       mapDims.x > 0 &&
  //       mapDims.y &&
  //       mapDims.y > 0
  //     ) {
  //       getSVGData().then((data) => {
  //         if (data) {
  //           snapshotEl.src = data;
  //         }
  //       });
  //     }

  //     // Accept orders logic
  //     map.clearClickListeners();

  //     if (Object.keys(options || {}).length > 0) {
  //       // addOptionHandlers(options, []);
  //     }
  //   }
  // };

  useEffect(() => {
    const mapEl = document.getElementById("map");
    if (mapEl) {
      setMapDims({ x: mapEl.clientWidth, y: mapEl.clientHeight });
      // snapshowSVG()
    }
  }, []);

  useEffect(() => {
    if (laboratoryMode) {
      // if we ARE in laboratory mode, reload orders if phase is "real"
      if (phase && phase.GameID) {
        // loadCorroboratePromise().then((corroboration) => setOrders(corroboration.Orders))
      }
      // Otherwise use the orders in the phase, which we should have saved when we created it.

      // const orders = [];
      // Object.keys(phase.Orders || {}).forEach((nation) => {
      //   Object.keys(phase.Orders[nation]).forEach((province) => {
      //     orders.push({
      //       Nation: nation,
      //       Parts: [province].concat(phase.Orders[nation][province]),
      //     });
      //   });
      // });
      // setOrders(orders);
    }
  }, [laboratoryMode, phase, phase.PhaseOrdinal]);

  useEffect(() => {
    // if (map) {
    //   updateMap();
    // }
    // Get map dimensions if it's the first time we can get them.
    // // If anything that requires rendering new orders or options has changed.
    // 	this.debugCount("componentDidUpdate/reRender");
    // 	if (this.state.laboratoryMode) {
    // 		// If we ARE in laboratory mode, reload orders if phase is "real".
    // 		if (this.state.phase.Links && this.state.phase.Properties.GameID) {
    // 			this.loadCorroboratePromise().then((corroboration) => {
    // 				this.setState({
    // 					orders: corroboration.Properties.Orders,
    // 				});
    // 			});
    // 		} else {
    // 			// Otherwise use the orders in the phase, which we should have saved when we created it.
    // 			const orders = [];
    // 			Object.keys(this.state.phase.Properties.Orders || {}).forEach(
    // 				(nation) => {
    // 					Object.keys(this.state.phase.Properties.Orders[nation]).forEach(
    // 						(province) => {
    // 							orders.push({
    // 								Nation: nation,
    // 								Parts: [province].concat(
    // 									this.state.phase.Properties.Orders[nation][province]
    // 								),
    // 							});
    // 						}
    // 					);
    // 				}
    // 			);
    // 			this.setState({ orders: orders });
    // 		}
    // 	} else {
    // 		this.debugCount("componentDidUpdate/reRenderNormal");
    // 		// If we are NOT in laboratory mode, reload options AND orders.
    // 		if (this.state.phase.Links) {
    // 			const silent = this.firstLoadFinished;
    // 			if (!silent) {
    // 				helpers.incProgress();
    // 			}
    // 			const promises = [this.loadCorroboratePromise()];
    // 			const optionsLink = this.state.phase.Links.find((l) => {
    // 				return l.Rel === "options";
    // 			});
    // 			if (optionsLink) {
    // 				this.debugCount("componentDidUpdate/reRenderOptions");
    // 				promises.push(
    // 					helpers.memoize(optionsLink.URL, (_) => {
    // 						return helpers
    // 							.safeFetch(helpers.createRequest(optionsLink.URL))
    // 							.then((resp) => resp.json())
    // 							.then((js) => {
    // 								return js.Properties;
    // 							});
    // 					})
    // 				);
    // 			} else {
    // 				promises.push(Promise.resolve(null));
    // 			}
    // 			Promise.all(promises).then((values) => {
    // 				if (!silent) {
    // 					helpers.decProgress();
    // 					this.firstLoadFinished = true;
    // 				}
    // 				if (
    // 					this.state.laboratoryMode &&
    // 					!this.state.phase.Properties.GameID
    // 				) {
    // 					return;
    // 				}
    // 				this.debugCount("componentDidUpdate/reRenderNormalSuccess");
    // 				this.setState({
    // 					orders: values[0].Properties.Orders,
    // 					options: values[1],
    // 				});
    // 			});
    // 		}
    // 	}
    // }
    // Reload all the SVGs if the new state has a new game.
    // 	this.setState(
    // 		(state, props) => {
    // 			const member = (this.state.game.Properties.Members || []).find(
    // 				(e) => {
    // 					return e.User.Email === Globals.user.Email;
    // 				}
    // 			);
    // 			const variant = Globals.variants.find((v) => {
    // 				return v.Properties.Name === this.state.game.Properties.Variant;
    // 			});
    // 			state = Object.assign({}, state);
    // 			state.member = member;
    // 			state.labPlayAs =
    // 				member && member.Nation
    // 					? member.Nation
    // 					: variant.Properties.Nations[0];
    // 			state.variant = variant;
    // 			return state;
    // 		},
    // 		(_) => {
    // 			const variantMapSVG =
    // 				"/Variant/" + this.state.game.Properties.Variant + "/Map.svg";
    // 			const promises = [
    // 				helpers.memoize(variantMapSVG, (_) => {
    // 					return helpers
    // 						.safeFetch(helpers.createRequest(variantMapSVG))
    // 						.then((resp) => resp.text());
    // 				}),
    // 				Promise.all(
    // 					this.state.variant.Properties.UnitTypes.map((unitType) => {
    // 						const variantUnitSVG =
    // 							"/Variant/" +
    // 							this.state.game.Properties.Variant +
    // 							"/Units/" +
    // 							unitType +
    // 							".svg";
    // 						return helpers.memoize(variantUnitSVG, (_) => {
    // 							return helpers
    // 								.safeFetch(helpers.createRequest(variantUnitSVG))
    // 								.then((resp) => resp.text())
    // 								.then((svg) => {
    // 									return {
    // 										name: unitType,
    // 										svg: svg,
    // 									};
    // 								});
    // 						});
    // 					})
    // 				),
    // 			];
    // 			Promise.all(promises).then((values) => {
    // 				const mapSVG = values[0];
    // 				const mapEl = document.getElementById("map");
    // 				mapEl.innerHTML = mapSVG;
    // 				this.mapDims = [mapEl.clientWidth, mapEl.clientHeight];
    // 				this.map = dippyMap($("#map"));
    // 				Object.keys(this.state.variant.Properties.Graph.Nodes).forEach(
    // 					(superProv) => {
    // 						Object.keys(
    // 							this.state.variant.Properties.Graph.Nodes[superProv].Subs
    // 						).forEach((subProv) => {
    // 							let prov = superProv;
    // 							if (subProv) {
    // 								prov = prov + "/" + subProv;
    // 							}
    // 							this.map.addClickListener(prov, this.infoClicked, {
    // 								nohighlight: true,
    // 								permanent: true,
    // 								touch: true,
    // 							});
    // 						});
    // 					}
    // 				);
    // 				const showSnapshot = (e) => {
    // 					document.getElementById("map").style.display = "none";
    // 					document.getElementById("mapSnapshot").style.display = "flex";
    // 				};
    // 				const showSVG = (e) => {
    // 					document.getElementById("map").style.display = "flex";
    // 					document.getElementById("mapSnapshot").style.display = "none";
    // 				};
    // 				new PZ({
    // 					pzid: "dip-map",
    // 					minScale: 0.5,
    // 					maxScale: 20,
    // 					maxTrans: 0.5,
    // 					el: document.getElementById("map-container"),
    // 					viewPort: document.getElementById("map-viewport"),
    // 					onZoomStart: showSnapshot,
    // 					onZoomEnd: showSVG,
    // 					onPanStart: showSnapshot,
    // 					onPanEnd: showSVG,
    // 				});
    // 				const variantUnits = values[1];
    // 				variantUnits.forEach((unitData) => {
    // 					const container = document.createElement("div");
    // 					container.setAttribute("id", "unit" + unitData.name);
    // 					container.innerHTML = unitData.svg;
    // 					document.getElementById("units-div").appendChild(container);
    // 				});
    // 				this.setState({ svgLoaded: true });
    // 				gtag("set", {
    // 					page_title: "DipMap",
    // 					page_location: location.href,
    // 				});
    // 				gtag("event", "page_view");
    // 			});
    // 		}
    // 	);
    // }
  });

  return (
    <>
      <div
        id="map-viewport"
        style={{
          height: "100%",
          overflow: "hidden",
        }}
      >
        <div id="map-container">
          <div className={classes.map} id="map"></div>
          <img
            id="mapSnapshot"
            alt="Map snapshot"
            className={classes.mapSnapshot}
          />
        </div>
      </div>
      <div className={classes.unitsDiv} id="units-div"></div>
      {/* <OrderDialog
        parentCB={(c) => {
          this.orderDialog = c;
        }}
        key="order-dialog"
      /> */}
    </>
  );
};

export default DipMap;
