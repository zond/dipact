import React, { useState } from "react";
import { View, Dimensions, LayoutChangeEvent } from "react-native";
import { selectors } from "../../../common";
import ImageZoom from "react-native-image-pan-zoom";
import { useSelector } from "react-redux";
import MapComponent from "../../components/MapComponent";
import { useStyles } from "./Map.styles";

interface MapProps {
  gameId: string;
}

const Map = ({ gameId }: MapProps) => {
  const styles = useStyles();
  const phaseNumber = useSelector(selectors.selectPhase);
  const [mapViewHeight, setMapViewHeight] = useState(0);
  const [mapViewWidth, setMapViewWidth] = useState(0);

  const mapViewOnLayout = (event: LayoutChangeEvent) => {
    setMapViewWidth(event.nativeEvent.layout.width);
    setMapViewHeight(event.nativeEvent.layout.height);
  };

  return (
    <View style={styles.root} onLayout={mapViewOnLayout} testID="MAP_CONTAINER">
      {/* <PhaseSelector
              gameId={gameId}
              rootStyles={styles.phaseSelectorRoot}
            /> */}
      <ImageZoom
        cropWidth={mapViewWidth}
        cropHeight={mapViewHeight}
        imageWidth={Dimensions.get("window").width} // TODO
        imageHeight={Dimensions.get("window").width}
      >
        <MapComponent gameId={gameId} phaseId={phaseNumber || undefined} />
      </ImageZoom>
    </View>
  );
};

export default Map;
