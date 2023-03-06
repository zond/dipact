import { diplicityService as service, skipToken } from "@diplicity/common";
import { combineQueries } from "../utils/query";

const getVariantUnitOption = (
  variant: string | undefined,
  unitType: string
): { variantName: string; unitType: string } | undefined => {
  if (variant) {
    return { variantName: variant, unitType: unitType };
  }
};

const useMapView = (gameId: string) => {
  const getGameQuery = service.useGetGameV2Query(gameId);
  const listPhasesQuery = service.useListPhasesQuery(gameId);
  const variantName = getGameQuery.data?.variant;
  const listVariantsQuery = service.useListVariantsQuery(undefined);
  const variantArmy = getVariantUnitOption(variantName, "Army");
  const variantFleet = getVariantUnitOption(variantName, "Fleet");
  const getVariantSvgQuery = service.useGetVariantSVGQuery(
    variantName ?? skipToken
  );
  const getVariantArmySvgQuery = service.useGetVariantUnitSVGQuery(
    variantArmy || skipToken
  );
  const getVariantFleetSvgQuery = service.useGetVariantUnitSVGQuery(
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

export default useMapView;
