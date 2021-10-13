import { makeStyles } from "@material-ui/core";
import { useEffect, useState } from "react";

import { hash } from "../utils/general";
import * as helpers from "../helpers";
import { Phase, Variant } from "../store/types";
import { variant } from "../store/testData";

const useStyles = makeStyles((theme) => ({
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

const DipMap = () => {
  const [svgLoaded, setSvgLoaded] = useState(true);
  const [lastRenderedPhaseHash, setLastRenderedPhaseHash] = useState<
    number | null
  >(null);

  // TODO typing
  const [phaseSpecialStrokes, setPhaseSpecialStrokes] = useState({});

  // Props
  const currentNation = "";
  const phase: Phase = {
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

  const variant: Variant = {
    ...variant,
  };

  const classes = useStyles();

  // TODO
  const showInfoProvinceInfo = (province: string) => {};

  // TODO
  const onClickProvince = (province: string) => {};

  const updateMap = () => {
    if (!svgLoaded) return; // TODO explainer comment

    const phaseHash = hash(JSON.stringify(phase));
    console.log(phaseHash);
    const nodes = variant.Start?.Graph.Nodes;

    // TODO use compare?
    if (phaseHash !== lastRenderedPhaseHash) {
      setLastRenderedPhaseHash(phaseHash);
      let tempPhaseSpecialStrokes: { [key: string]: string } = {};
      let SCs: { [key: string]: string } = {};

      // if (phase.SCs) {
      //   SCs = phase.SCs;
      // } else {
      phase.SCs.forEach((supplyCenter) => {
        SCs[supplyCenter.Province] = supplyCenter.Owner;
      });

      for (let prov in nodes) {
        const node = nodes[prov]; // TODO what's this about?
        if (node.SC && SCs[prov]) {
          const color = helpers.natCol(SCs[prov], variant);
          if (helpers.brightnessByColor(color) || 0 < 0.5) {
            // TODO fix
            tempPhaseSpecialStrokes[prov] = "#ffffff";
            // this.map.colorSC(prov, "ffffff"); TODO
          }
        } else {
          // this.map.hideProvince(prov)
        }
      }
      // }
    }

    // TODO set map subtitle
  };

  useEffect(() => {
    updateMap();
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
