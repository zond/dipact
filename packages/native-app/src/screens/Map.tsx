import React, { useState } from "react";
import { StyleSheet, View, Dimensions, LayoutChangeEvent } from "react-native";
import { useMap } from "@diplicity/common";
import { Dialog, FAB, Theme } from "@rneui/base";
import { useTheme } from "../hooks/useTheme";
import { SvgFromXml } from "react-native-svg";
import Loading from "../components/Loading";
import ImageZoom from "react-native-image-pan-zoom";
import PhaseSelector from "../components/PhaseSelector";
import CreateOrderMenu from "../components/CreateOrderMenu";

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
  const theme = useTheme();
  const rneTheme = { colors: { white: "#FFFFFF" } } as Theme;
  const [createOrderMenuOpen, setCreateOrderMenuOpen] = useState(false);
  const [mapViewHeight, setMapViewHeight] = useState(0);
  const [mapViewWidth, setMapViewWidth] = useState(0);
  const closeCreateOrderMenu = () => setCreateOrderMenuOpen(false);
  const { isLoading, data } = useMap(gameId);

  const mapViewOnLayout = (event: LayoutChangeEvent) => {
    setMapViewWidth(event.nativeEvent.layout.width);
    setMapViewHeight(event.nativeEvent.layout.height);
  };

  return (
    <View style={styles.root} onLayout={mapViewOnLayout} testID="MAP_CONTAINER">
      <PhaseSelector gameId={gameId} rootStyles={styles.phaseSelectorRoot} />
      {isLoading && <Loading size={"large"} />}
      {data && (
        <ImageZoom
          cropWidth={mapViewWidth}
          cropHeight={mapViewHeight}
          imageWidth={Dimensions.get("window").width} // TODO
          imageHeight={Dimensions.get("window").width}
        >
          <SvgFromXml xml={data} />
        </ImageZoom>
      )}
      <FAB
        color={theme.palette.primary.main}
        icon={{
          name: "add",
          color: theme.palette.secondary.main,
        }}
        placement={"right"}
        onPress={() => setCreateOrderMenuOpen(true)}
      />
      <Dialog
        theme={rneTheme}
        isVisible={createOrderMenuOpen}
        onPressOut={closeCreateOrderMenu}
        onRequestClose={closeCreateOrderMenu}
      >
        <Dialog.Title title="Create order" />
        <CreateOrderMenu close={closeCreateOrderMenu} />
      </Dialog>
    </View>
  );
};

export default Map;
