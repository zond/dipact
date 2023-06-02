import React, { useState } from "react";
import ImageZoom from "react-native-image-pan-zoom";
import { useSelector } from "react-redux";
import { View, Dimensions, LayoutChangeEvent } from "react-native";

import { useStyles } from "./Map.styles";
import MapComponent from "../../components/MapComponent";
import { phaseSelectors } from "diplicity-common-internal";

interface MapProps {
  gameId: string;
}

const Map = ({ gameId }: MapProps) => {
  const styles = useStyles();
  const phaseNumber = useSelector(phaseSelectors.selectphase);
  const [mapViewHeight, setMapViewHeight] = useState(0);
  const [mapViewWidth, setMapViewWidth] = useState(0);

  const mapViewOnLayout = (event: LayoutChangeEvent) => {
    setMapViewWidth(event.nativeEvent.layout.width);
    setMapViewHeight(event.nativeEvent.layout.height);
  };

  return (
    <View style={styles.root} onLayout={mapViewOnLayout} testID="MAP_CONTAINER">
      <ImageZoom
        cropWidth={mapViewWidth}
        cropHeight={mapViewHeight}
        imageWidth={Dimensions.get("window").width}
        imageHeight={Dimensions.get("window").width}
      >
        <MapComponent gameId={gameId} phaseId={phaseNumber || undefined} />
      </ImageZoom>
    </View>
  );
};

export default Map;
