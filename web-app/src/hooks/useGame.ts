import { createContext, useContext, useEffect, useState } from "react";
import { Nation } from "../components/Orders/NationSummary";
import { OrderDisplay } from "../components/Orders/Order";

import { Game, Member, Phase, PhaseState, User, Variant } from "../store/types";
import { useSelectPhase, useSelectVariant } from "./selectors";
import {
  useGetGameQuery,
  useGetRootQuery,
  useLazyGetVariantSVGQuery,
  useLazyListPhaseStatesQuery,
  useListPhasesQuery,
  useListVariantsQuery,
  useUpdatePhaseStateMutation,
} from "./service";
import { ApiError } from "./types";
import { getMember, getNation, mergeErrors } from "./utils";
import { getPhaseName } from "../utils/general";
import { actions as phaseActions } from "../store/phase";
import { useDispatch } from "react-redux";

export type PhasesDisplay = [number, string][];

export interface IUseGame {
  // TODO de-dupe
  error: ApiError | null;
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  // TODO de-dupe
  phasesDisplay: PhasesDisplay | undefined;
  selectedPhase: number | undefined;
  setSelectedPhase: (phaseOrdinal: number) => void;
  canJoin: boolean;
  canLeave: boolean;
  numPlayers: number;
  maxNumPlayers: number;
  started: boolean;
  finished: boolean;
  mustered: boolean;
  variantSVG: string | undefined,
}

const useGame = (gameId: string): IUseGame => {
  const {
    error: variantsError,
    isLoading: variantsIsLoading,
    isError: variantsIsError,
    isSuccess: variantsIsSuccess,
  } = useListVariantsQuery(undefined);
  const [
    listPhasesTrigger,
    {
      data: phaseStates,
      error: phaseStatesError,
      isLoading: phaseStatesIsLoading,
      isError: phaseStatesIsError,
      isSuccess: phaseStatesIsSuccess,
    },
  ] = useLazyListPhaseStatesQuery();
  const [
    getVariantSVGTrigger,
    {
      data: variantSVG,
      error: variantSVGError,
      isLoading: variantSVGIsLoading,
      isError: variantSVGIsError,
      isSuccess: variantSVGIsSuccess,
    },
  ] = useLazyGetVariantSVGQuery();
  const {
    data: phases,
    error: phasesError,
    isLoading: phasesIsLoading,
    isError: phasesIsError,
    isSuccess: phasesIsSuccess,
  } = useListPhasesQuery(gameId);
  const {
    data: user,
    error: userError,
    isLoading: userIsLoading,
    isError: userIsError,
    isSuccess: userIsSuccess,
  } = useGetRootQuery(undefined);
  const {
    data: game,
    error: gameError,
    isLoading: gameIsLoading,
    isError: gameIsError,
    isSuccess: gameIsSuccess,
  } = useGetGameQuery(gameId);

  const selectedPhase = useSelectPhase() || phases?.length;

  const dispatch = useDispatch();
  const setSelectedPhase = (phaseOrdinal: number) =>
    dispatch(phaseActions.set(phaseOrdinal));

  const variant = useSelectVariant(game?.Variant || "");

  useEffect(() => {
    if (phases?.length && selectedPhase) {
      const phase = phases[selectedPhase - 1];
      listPhasesTrigger({ gameId, phaseId: phase.PhaseOrdinal.toString() });
    }
  }, [phases, gameId, listPhasesTrigger, selectedPhase]);

  useEffect(() => {
    if (variant) {
      getVariantSVGTrigger(variant.Name);
    }
  }, [variant]);

  const isLoading =
    variantsIsLoading ||
    phasesIsLoading ||
    gameIsLoading ||
    userIsLoading ||
    phaseStatesIsLoading;
  const isError =
    variantsIsError ||
    phasesIsError ||
    gameIsError ||
    userIsError ||
    phaseStatesIsError;
  const error = isError
    ? mergeErrors(
        variantsError as ApiError,
        userError as ApiError,
        gameError as ApiError,
        phasesError as ApiError,
        phaseStatesError as ApiError
      )
    : null;

  const isSuccess =
    variantsIsSuccess ||
    phasesIsSuccess ||
    gameIsSuccess ||
    userIsSuccess ||
    phaseStatesIsSuccess;

  const phasesDisplay: PhasesDisplay | undefined = phases?.map((phase) => [
    phase.PhaseOrdinal,
    getPhaseName(phase),
  ]);

  const canJoin = true;
  const canLeave = false;
  const numPlayers = 3;
  const maxNumPlayers = 7;
  const started = false;
  const finished = false;
  const mustered = false;

  return {
    isError,
    isLoading,
    isSuccess,
    error,
    phasesDisplay,
    selectedPhase,
    setSelectedPhase,
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
