import React, { useState } from "react";
import { StyleSheet, View, Dimensions, LayoutChangeEvent } from "react-native";
import { selectors } from "@diplicity/common";
import { SvgFromXml } from "react-native-svg";
import ImageZoom from "react-native-image-pan-zoom";
import BottomSheet from "../components/BottomSheet";
import QueryContainer from "../components/QueryContainer";
import { assertDefined } from "../utils/general";
import useMapView from "../hooks/useMap";
import { MapXmlAdapter } from "../adapters/adapters";
import { findPhase, findVariantByGame } from "../utils/general";
import { useSelector } from "react-redux";

interface MapProps {
  gameId: string;
}

const useStyles = () => {
  return StyleSheet.create({
    root: {
      height: "100%",
    },
    phaseSelectorRoot: {
      position: "absolute",
      zIndex: 1,
      width: "100%",
    },
  });
};

const Map = ({ gameId }: MapProps) => {
  const styles = useStyles();
  const { query } = useMapView(gameId);
  const phaseNumber = useSelector(selectors.selectPhase);
  // const { options, orderSummary, orderPrompt, handleSelectOption } =
  //   useCreateOrderMenu(() => setCreateOrderMenuOpen(false));
  console.log("Phase number: ", phaseNumber);
  const [createOrderMenuOpen, setCreateOrderMenuOpen] = useState(false);
  const [mapViewHeight, setMapViewHeight] = useState(0);
  const [mapViewWidth, setMapViewWidth] = useState(0);

  const mapViewOnLayout = (event: LayoutChangeEvent) => {
    setMapViewWidth(event.nativeEvent.layout.width);
    setMapViewHeight(event.nativeEvent.layout.height);
  };

  return (
    <QueryContainer
      query={query}
      render={(d) => {
        const data = assertDefined(d);
        const variant = findVariantByGame(data.game, data.variants);
        const phase = findPhase(data.phases, phaseNumber);
        const xml = new MapXmlAdapter(
          variant,
          phase,
          data.variantSvg,
          data.variantArmySvg,
          data.variantFleetSvg
        );
        return (
          <View
            style={styles.root}
            onLayout={mapViewOnLayout}
            testID="MAP_CONTAINER"
          >
            {/* <PhaseSelector
              gameId={gameId}
              rootStyles={styles.phaseSelectorRoot}
            /> */}
            {data && (
              <ImageZoom
                cropWidth={mapViewWidth}
                cropHeight={mapViewHeight}
                imageWidth={Dimensions.get("window").width} // TODO
                imageHeight={Dimensions.get("window").width}
              >
                <SvgFromXml xml={xml.xml} />
              </ImageZoom>
            )}
            {/* <FAB
              color={theme.palette.primary.main}
              icon={{
                name: "add",
                color: theme.palette.secondary.main,
              }}
              placement={"right"}
              onPress={() => setCreateOrderMenuOpen(true)}
            /> */}
            <BottomSheet
              isVisible={createOrderMenuOpen}
              onBackdropPress={() => setCreateOrderMenuOpen(false)}
            >
              {/* Excluding orders for now */}
              {/* <Text variant="title">{orderPrompt}</Text>
              {options?.map((option) => (
                <BottomSheetButton
                  key={option.value}
                  title={option.label}
                  onPress={() => handleSelectOption(option.value)}
                />
              ))} */}
            </BottomSheet>
          </View>
        );
      }}
    />
  );
};

export default Map;
