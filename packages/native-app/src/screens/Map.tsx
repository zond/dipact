import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  LayoutChangeEvent,
} from "react-native";
import {
  gameActions,
  useCreateOrderMenu,
  useMap,
  diplicityService,
  Phase,
  getNation,
} from "@diplicity/common";
import { Dialog, FAB, Theme } from "@rneui/base";
import { useTheme } from "../hooks/useTheme";
import { Picker } from "@react-native-picker/picker";
import { useDispatch } from "react-redux";
import { SvgFromXml } from "react-native-svg";
import Loading from "../components/Loading";
import { mapEditorFactory, MapState } from "../utils/svg";
import ImageZoom from "react-native-image-pan-zoom";
import PhaseSelector from "../components/PhaseSelector";

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
    pickerPlaceholderOption: {
      display: "none"
    }
  });
};

const Map = ({ gameId }: MapProps) => {
  const styles = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const rneTheme = { colors: { white: "#FFFFFF" } } as Theme;
  const [createOrderMenuOpen, setCreateOrderMenuOpen] = useState(false);
  const [mapViewHeight, setMapViewHeight] = useState(0);
  const [mapViewWidth, setMapViewWidth] = useState(0);
  const closeCreateOrderMenu = () => setCreateOrderMenuOpen(false);
  useMap(gameId);
  const { options, orderSummary, orderPrompt, handleSelectOption } =
    useCreateOrderMenu(closeCreateOrderMenu);

  const handleValueChange = (value: string) => {
    if (!value) {
      return;
    }
    handleSelectOption(value);
  };

  // TODO move up
  const { data: mapSvg } = diplicityService.useGetVariantSVGQuery("Classical");
  const { data: armySvg } = diplicityService.useGetVariantUnitSVGQuery({
    variantName: "Classical",
    unitType: "Army",
  });
  const { data: fleetSvg } = diplicityService.useGetVariantUnitSVGQuery({
    variantName: "Classical",
    unitType: "Fleet",
  });
  const { data: phases } = diplicityService.useListPhasesQuery(gameId);
  const { data: variants } = diplicityService.useListVariantsQuery(undefined);

  const variant = variants?.find((v) => v.Name === "Classical");

  let editedMap: null | string = null;
  let mapEditor: ReturnType<typeof mapEditorFactory>;

  if (mapSvg && armySvg && fleetSvg && phases && variant) {
    mapEditor = mapEditorFactory(mapSvg, armySvg, fleetSvg);

    const currentPhase = phases.find(
      (phase) => phase.PhaseOrdinal === 2
    ) as Phase;

    const provinces: MapState["provinces"] = currentPhase.SCs.map(
      ({ Province, Owner }) => ({
        id: Province,
        fill: getNation(Owner, variant).color,
        highlight: false,
      })
    );
    const units: MapState["units"] = currentPhase.Units.map(
      ({ Province, Unit }) => ({
        province: Province,
        fill: getNation(Unit.Nation, variant).color,
        type: Unit.Type,
      })
    );

    const mapState: MapState = {
      provinces,
      units,
      orders: [],
    };

    mapEditor.setState(mapState);
    editedMap = mapEditor.serializeToString();
  }

  const mapViewOnLayout = (event: LayoutChangeEvent) => {
    setMapViewWidth(event.nativeEvent.layout.width);
    setMapViewHeight(event.nativeEvent.layout.height);
  };

  return (
    <View style={styles.root} onLayout={mapViewOnLayout}>
      <PhaseSelector gameId={gameId} rootStyles={styles.phaseSelectorRoot} />
      {editedMap ? (
        <ImageZoom
          cropWidth={mapViewWidth}
          cropHeight={mapViewHeight}
          imageWidth={Dimensions.get("window").width} // TODO
          imageHeight={Dimensions.get("window").width}
        >
          <SvgFromXml xml={editedMap} />
        </ImageZoom>
      ) : (
        <Loading />
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
        <View>
          <Text>{orderSummary}</Text>
          <Text>{orderPrompt}</Text>
          <Picker onValueChange={handleValueChange}>
            <Picker.Item
              key={""}
              label={"-- Select an option --"}
              value={null}
              enabled={true}
              style={styles.pickerPlaceholderOption}
            />
            {options?.map((option) => (
              <Picker.Item
                key={option.value}
                label={option.label}
                value={option.value}
              />
            ))}
          </Picker>
        </View>
      </Dialog>
    </View>
  );
};

export default Map;
