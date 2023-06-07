import React from "react";
import {
  assertDefined,
  createMap,
  findPhase,
  findVariantByGame,
  useMapComponentView,
} from "@diplicity/common";
import { SvgFromXml } from "react-native-svg";
import QueryContainer from "../QueryContainer";

interface MapProps {
  gameId: string;
  phaseId: number | undefined;
}

const MapComponent = ({ gameId, phaseId }: MapProps) => {
  const { query } = useMapComponentView(gameId);

  return (
    <QueryContainer
      query={query}
      render={(d) => {
        const data = assertDefined(d);
        const variant = findVariantByGame(data.game, data.variants);
        const phase = findPhase(data.phases, phaseId);
        const xml = createMap(
          data.variantSvg,
          data.variantArmySvg,
          data.variantFleetSvg,
          variant,
          phase
        );
        return <SvgFromXml xml={xml} />;
      }}
    />
  );
};

export default MapComponent;
