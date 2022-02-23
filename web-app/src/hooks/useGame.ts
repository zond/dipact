import { createContext, useContext, useEffect } from "react";
import { Variant } from "@diplicity/common";

import { useSelectPhase, useSelectVariant, useSelectVariantUnitSvgs } from "./selectors";
import {
  useGetGameQuery,
  useGetRootQuery,
  useLazyGetVariantSVGQuery,
  useLazyGetVariantUnitSVGQuery,
  useLazyListPhaseStatesQuery,
  useListPhasesQuery,
  useListVariantsQuery,
} from "./service";
import { ApiResponse } from "./types";
import { getCombinedQueryState } from "./utils";

export type PhasesDisplay = [number, string][];

export interface IUseGame extends ApiResponse {
  canJoin: boolean;
  canLeave: boolean;
  numPlayers: number;
  maxNumPlayers: number;
  started: boolean;
  finished: boolean;
  mustered: boolean;
  variantSVG: string | undefined;
  variant: Variant | null;
  variantUnitSvgs: { [key: string]: string };
}

const useGame = (gameId: string): IUseGame => {
  const [
    listPhaseStatesTrigger,
    listPhaseStatesQuery,
  ] = useLazyListPhaseStatesQuery();
  const [
    getVariantSVGTrigger,
    getVariantSVGQuery,
  ] = useLazyGetVariantSVGQuery();
  const [
    getVariantUnitSVGTrigger,
  ] = useLazyGetVariantUnitSVGQuery();

  const combinedQuery = {
    variants: useListVariantsQuery(undefined),
    phases: useListPhasesQuery(gameId),
    user: useGetRootQuery(undefined),
    game: useGetGameQuery(gameId),
    variantSVG: getVariantSVGQuery,
    phaseStates: listPhaseStatesQuery,
  };

  const { game, phases, variantSVG } = {
    game: combinedQuery.game.data,
    phases: combinedQuery.phases.data,
    variantSVG: combinedQuery.variantSVG.data,
  };
  const combinedQueryState = getCombinedQueryState(combinedQuery);

  // TODO use selector
  const selectedPhase = useSelectPhase() || phases?.length;
  const variant = useSelectVariant(game?.Variant || "");
  const variantUnitSvgs = useSelectVariantUnitSvgs(variant);

  useEffect(() => {
    if (phases?.length && selectedPhase) {
      const phase = phases[selectedPhase - 1];
      listPhaseStatesTrigger({
        gameId,
        phaseId: phase.PhaseOrdinal.toString(),
      });
    }
  }, [phases, gameId, listPhaseStatesTrigger, selectedPhase]);

  useEffect(() => {
    if (variant) {
      getVariantSVGTrigger(variant.Name);
    }
  }, [variant, getVariantSVGTrigger]);


  useEffect(() => {
    if (variant) {
      variant.UnitTypes.forEach((unitType) => {
        getVariantUnitSVGTrigger({
          variantName: variant.Name,
          unitType,
        });
      });
    }
  }, [variant, getVariantUnitSVGTrigger]);

  const canJoin = true;
  const canLeave = false;
  const numPlayers = 3;
  const maxNumPlayers = 7;
  const started = false;
  const finished = false;
  const mustered = false;

  return {
    combinedQueryState,
    canJoin,
    canLeave,
    numPlayers,
    maxNumPlayers,
    started,
    finished,
    mustered,
    variantSVG,
    variant,
    variantUnitSvgs,
  };
};

export const GameStub = createContext<null | typeof useGame>(null);

const useGetHook = (): ((gameId: string) => IUseGame) => {
  const mockUseGame = useContext(GameStub);
  return mockUseGame ? mockUseGame : useGame;
};

export default useGetHook;
