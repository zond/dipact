import { createContext, useContext, useEffect } from "react";

import { useSelectPhase, useSelectVariant } from "./selectors";
import {
  useGetGameQuery,
  useGetRootQuery,
  useLazyGetVariantSVGQuery,
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
}

const useGame = (gameId: string): IUseGame => {
  const [
    listPhaseStatesTrigger,
    listPhaseStatesQuery,
  ] = useLazyListPhaseStatesQuery();
  const [
    getVariantSVGTrigger,
    getVariantSVGQuery
  ] = useLazyGetVariantSVGQuery();
  const combinedQuery = {
    variants: useListVariantsQuery(undefined),
    phases: useListPhasesQuery(gameId),
    user: useGetRootQuery(undefined),
    game: useGetGameQuery(gameId),
    variantSVG: getVariantSVGQuery,
    phaseStates: listPhaseStatesQuery,
  };

  const { game, phaseStates, phases, user, variants, variantSVG } = {
    game: combinedQuery.game.data,
    phaseStates: combinedQuery.phaseStates.data,
    phases: combinedQuery.phases.data,
    user: combinedQuery.user.data,
    variants: combinedQuery.variants.data,
    variantSVG: combinedQuery.variantSVG.data,
  };
  const combinedQueryState = getCombinedQueryState(combinedQuery);

  // TODO use selector
  const selectedPhase = useSelectPhase() || phases?.length;
  const variant = useSelectVariant(game?.Variant || "");

  useEffect(() => {
    if (phases?.length && selectedPhase) {
      const phase = phases[selectedPhase - 1];
      listPhaseStatesTrigger({ gameId, phaseId: phase.PhaseOrdinal.toString() });
    }
  }, [phases, gameId, listPhaseStatesTrigger, selectedPhase]);

  useEffect(() => {
    if (variant) {
      getVariantSVGTrigger(variant.Name);
    }
  }, [variant]);

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
  };
};

export const GameStub = createContext<null | typeof useGame>(null);

const useGetHook = (): ((gameId: string) => IUseGame) => {
  const mockUseGame = useContext(GameStub);
  return mockUseGame ? mockUseGame : useGame;
};

export default useGetHook;
