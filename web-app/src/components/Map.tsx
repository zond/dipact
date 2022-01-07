import $ from "jquery";
import makeStyles from "@mui/styles/makeStyles";
import { useEffect, useState, useRef } from "react";

import { Variant } from "../store/types";
import { DippyMap, Order as MapOrder } from "../utils/DippyMap";

interface MapProps {
  variant: Variant;
  variantSVG: string;
  variantUnitSvgs: { [key: string]: string };
}

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

// TODO move to hook
interface Province {
  color: string;
  unit: {
    type: string;
    color: string;
  } | null;
  dislodgedUnit: {
    type: string;
    color: string;
  } | null;
}

const provinces: { [key: string]: Province } = {
  lon: {
    color: "#2196f3",
    unit: {
      type: "Army",
      color: "#2196f3",
    },
    dislodgedUnit: null,
  },
  wal: {
    color: "#2196f3",
    unit: {
      type: "Fleet",
      color: "#2196f3",
    },
    dislodgedUnit: {
      type: "Army",
      color: "#F44336",
    },
  },
  lvp: {
    color: "#2196f3",
    unit: null,
    dislodgedUnit: null,
  },
};

// TODO force disband shouldn't be here
type Orders = {
  [key: string]: {
    order: MapOrder;
    color: string;
    forceDisband?: true;
    resolution?: string;
  };
};

const orders: Orders = {
  lon: { order: ["lon", "Hold", undefined, undefined], color: "#2196f3" },
  wal: {
    order: ["wal", "Move", "lvp", undefined],
    color: "#2196f3",
    resolution: "Bounced",
  },
};

const colorProvinces = (
  mapApi: DippyMap,
  provinces: { [key: string]: Province }
) => {
  Object.entries(provinces).forEach(([name, { color }]) => {
    mapApi.colorProvince(name, color);
  });
  mapApi.showProvinces();
};

const addUnits = (
  mapApi: DippyMap,
  provinces: { [key: string]: Province },
  variantUnitSvgs: { [key: string]: string }
) => {
  Object.entries(provinces).forEach(([name, { unit }]) => {
    if (unit) {
      const { color, type } = unit;
      const svg = variantUnitSvgs[type];
      mapApi.addUnit(svg, name, color, false, "#units", {});
    }
  });
};

const addDislodgedUnits = (
  mapApi: DippyMap,
  provinces: { [key: string]: Province },
  variantUnitSvgs: { [key: string]: string }
) => {
  Object.entries(provinces).forEach(([name, { dislodgedUnit }]) => {
    if (dislodgedUnit) {
      const { color, type } = dislodgedUnit;
      const svg = variantUnitSvgs[type];
      mapApi.addUnit(svg, name, color, true, "#units", {});
    }
  });
};

const addOrders = (mapApi: DippyMap, orders: Orders) => {
  mapApi.removeOrders();
  Object.entries(orders).forEach(
    ([province, { order, color, forceDisband, resolution }]) => {
      mapApi.addOrder(order, color, {});
      if (resolution && resolution !== "OK") {
        mapApi.addResolution(province);
      }
      if (forceDisband) {
        mapApi.addForceDisband(province);
      }
    }
  );
};

const Map = ({ variantSVG, variantUnitSvgs }: MapProps) => {
  const classes = useStyles();

  const [mapApi, setMapApi] = useState<DippyMap | undefined>(undefined);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const unitsDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Insert variantSVG into container once both are available. Create mapApi around map container.
    if (mapContainerRef.current) {
      mapContainerRef.current.innerHTML = variantSVG;
      setMapApi(new DippyMap($("#map")));
    }
  }, [variantSVG]);

  useEffect(() => {
    if (!mapApi) return;
    colorProvinces(mapApi, provinces);
    addUnits(mapApi, provinces, variantUnitSvgs);
    addDislodgedUnits(mapApi, provinces, variantUnitSvgs);
    addOrders(mapApi, orders);

    // Add units
  });
  //   const nodes = variant.Graph?.Nodes;
  //   console.log(nodes);
  //   // Update map
  //   let tempPhaseSpecialStrokes: PhaseSpecialStrokes = {};

  //   for (let prov in nodes) {
  //     const node = nodes[prov]; // TODO what's this about?
  //     if (node.SC && SCs[prov]) {
  //       const color = helpers.natCol(SCs[prov], variant);
  //       if (helpers.brightnessByColor(color) || 0 < 0.5) {
  //         // TODO fix
  //         tempPhaseSpecialStrokes[prov] = "#ffffff";
  //         mapApi.colorSC(prov, "ffffff");
  //       }
  //       mapApi.colorProvince(prov, color);
  //     } else {
  //       mapApi.hideProvince(prov);
  //     }
  //   }

  //   // colourNonSCs logic starts here
  //   const colourNonSCs = localStorage.getItem("colorNonSCs");

  //   // The user has teh colour non scs rule set to true (or default which is true)
  //   if (colourNonSCs === "true" || !colourNonSCs) {
  //     // Here we check each non-SC and non-Sea territory. If all surrounding SCs are of the same power and none is "Neutral", colour them that power.
  //     // Get all nodes, disqualify Sea and SC, and per node collect the edges in an array.

  //     // TODO is nodes ever undefined?
  //     if (nodes) {
  //       Object.values(nodes).forEach((node) => {
  //         const flags = node.Subs[""].Flags;
  //         const edgeKeys = Object.keys(node.Subs[""].Edges);

  //         // If node is a non-sc land province
  //         if (!node.SC && flags.Land) {
  //           // Get all provinces bordering this province that are not undefined and which have a supply center
  //           const borderProvs = edgeKeys
  //             .map((edgeKey) => nodes[edgeKey])
  //             .filter(
  //               (edgeNode) => typeof edgeNode !== "undefined" && edgeNode.SC
  //             )
  //             .map((edgeNode) => SCs[edgeNode.Name]);

  //           // find the first province that is not undefined
  //           const compareProv = borderProvs.find((prov) => prov !== undefined);

  //           // Only draw province if it is the compare province or neutral
  //           let shouldDraw = borderProvs.every(
  //             (prov) => prov === compareProv || prov === "Neutral"
  //           );

  //           const countNeutral = borderProvs.filter(
  //             (prov) => prov === undefined
  //           ).length;

  //           if (countNeutral === borderProvs.length || countNeutral > 0) {
  //             shouldDraw = false;
  //           }

  //           if (shouldDraw) {
  //             const color = helpers.natCol(borderProvs[0], variant);
  //             mapApi.colorProvince(node.Name, color);
  //           } else {
  //             // Default rule doesn't apply so check for extra dominance rules
  //             const extraDominanceRules = variant.ExtraDominanceRules;
  //             if (extraDominanceRules !== null) {
  //               // if prov is starting province
  //               if (node.Name in extraDominanceRules) {
  //                 const rule = extraDominanceRules[node.Name];
  //                 const dependencies = rule.Dependencies;
  //                 const shouldEventuallyDraw = Object.entries(
  //                   dependencies
  //                 ).every(([dependencyProv, nation]) => {
  //                   const tempSC = SCs[dependencyProv] || "Neutral";
  //                   return !(nation !== tempSC && tempSC !== rule.Nation);
  //                 });
  //                 if (shouldEventuallyDraw) {
  //                   const color = helpers.natCol(rule.Nation, variant);
  //                   mapApi.colorProvince(node.Name, color);
  //                 } else {
  //                   mapApi.hideProvince(node.Name);
  //                 }
  //               }
  //             }
  //           }
  //         }
  //       });
  //     }
  //   }
  // }, [phaseHash]);

  return (
    <>
      <div id="map-viewport" className={classes.viewport}>
        <div id="map-container">
          <div className={classes.map} id="map" ref={mapContainerRef}></div>
          <img
            id="mapSnapshot"
            alt="Map snapshot"
            className={classes.mapSnapshot}
          />
        </div>
      </div>
      <div className={classes.unitsDiv} id="units-div" ref={unitsDivRef}></div>
      {/* <OrderDialog
        parentCB={(c) => {
          this.orderDialog = c;
        }}
        key="order-dialog"
      /> */}
    </>
  );
};

export default Map;
