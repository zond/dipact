import { useContext } from "react";
import { combineQueries, skipToken } from "../utils";
import { DiplicityApiContext } from "../store/diplicity/diplicity.provider";

const getVariantUnitOption = (
  variant: string | undefined,
  unitType: string
): { variantName: string; unitType: string } | undefined => {
  if (variant) {
    return { variantName: variant, unitType: unitType };
  }
};

const useMapComponentView = (gameId: string) => {
  const api = useContext(DiplicityApiContext);
  const getGameQuery = api.useGetGameQuery(gameId);
  const listPhasesQuery = api.useListPhasesQuery(gameId);
  const variantName = getGameQuery.data?.variant;
  const listVariantsQuery = api.useListVariantsQuery(undefined);
  const variantArmy = getVariantUnitOption(variantName, "Army");
  const variantFleet = getVariantUnitOption(variantName, "Fleet");
  const getVariantSvgQuery = api.useGetVariantSVGQuery(
    variantName ?? skipToken
  );
  const getVariantArmySvgQuery = api.useGetVariantUnitSVGQuery(
    variantArmy || skipToken
  );
  const getVariantFleetSvgQuery = api.useGetVariantUnitSVGQuery(
    variantFleet || skipToken
  );
  return {
    query: combineQueries({
      game: getGameQuery,
      phases: listPhasesQuery,
      variantArmySvg: getVariantArmySvgQuery,
      variantFleetSvg: getVariantFleetSvgQuery,
      variantSvg: getVariantSvgQuery,
      variants: listVariantsQuery,
    }),
  };
};

export default useMapComponentView;
