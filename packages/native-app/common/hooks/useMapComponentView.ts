import { service as service } from "../store";
import { combineQueries, skipToken } from "../utils";

const getVariantUnitOption = (
  variant: string | undefined,
  unitType: string
): { variantName: string; unitType: string } | undefined => {
  if (variant) {
    return { variantName: variant, unitType: unitType };
  }
};

const useMapComponentView = (gameId: string) => {
  const getGameQuery = service.useGetGameQuery(gameId);
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

export default useMapComponentView;
