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
import { SafeAreaView } from "react-native-safe-area-context";

interface MapProps {
  gameId: string;
}

const useStyles = () => {
  return StyleSheet.create({
    root: {
      flex: 1,
    },
    mapContainer: {
      flex: 1,
      flexGrow: 1,
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
    <SafeAreaView
      testID="MAP_CONTAINER"
      style={styles.root}
      edges={["top", "left", "right"]}
    >
      <PhaseSelector gameId={gameId} />
      <View
        style={styles.mapContainer}
        onLayout={mapViewOnLayout}
        testID={"MAP_CONTAINER"}
      >
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
      </View>
      <Dialog
        theme={rneTheme}
        isVisible={createOrderMenuOpen}
        onPressOut={closeCreateOrderMenu}
        onRequestClose={closeCreateOrderMenu}
      >
        <Dialog.Title title="Create order" />
        <CreateOrderMenu close={closeCreateOrderMenu} />
      </Dialog>
    </SafeAreaView>
  );
};

export default Map;
