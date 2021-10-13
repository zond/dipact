import { makeStyles } from "@material-ui/core";
import { useState } from "react";

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

  const [svgLoaded, setSvgLoaded] = useState(false);

  // Props
  const currentNation = "";

  const classes = useStyles();

  // TODO
  const showInfoProvinceInfo = (province: string) => {

  }

  // TODO
  const onClickProvince = (province: string) => {

  }

  const updateMap = () => {
      if (!svgLoaded) return; // TODO explainer comment

      // TODO set map subtitle
  }



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
