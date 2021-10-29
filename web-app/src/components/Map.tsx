import $ from "jquery";
import { makeStyles } from "@material-ui/core";
import { useEffect, useState, useRef } from "react";

import { hash } from "../utils/general";
import * as helpers from "../helpers";
import {
  Dislodged,
  Game,
  Order,
  Phase,
  Unit,
  UnitState,
  Variant,
} from "../store/types";
import { game, variant as testVariant } from "../store/testData";
import { dippyMap } from "../static/js/dippymap";
import {
  CommandType,
  filterOk,
  handleLaboratoryOrderCommand,
  handleLaboratoryPhaseCommand,
  parseCommand,
  PieceType,
} from "../utils/map";

interface MapProps {
  variantSVG: string;
}

const useStyles = makeStyles((theme) => ({
  viewport: {
    height: "100%",
    overflow: "hidden",
  },
  map: {
    display: "flex",
    flexWrap: "wrap",
    width: "200px",
    height: "200px",
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

const Map = ({ variantSVG }: MapProps) => {
  const classes = useStyles();

  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Insert variantSVG into container once both are available
    if (mapContainerRef.current) mapContainerRef.current.innerHTML = variantSVG;
  }, [mapContainerRef.current]);

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

export default Map;
