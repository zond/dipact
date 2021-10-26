import { useDispatch } from "react-redux";

import { Phase } from "../store/types";
import { useSelectPhase } from "./selectors";
import { useListPhasesQuery } from "./service";
import { getPhaseName, getCombinedQueryState } from "./utils";
import { actions as phaseActions } from "../store/phase";
import { ApiResponse } from "./types";

type PhasesDisplay = [number, string][];

interface IUsePhaseSelector extends ApiResponse {
  phases: PhasesDisplay | undefined;
  selectedPhase: number | undefined;
  setPhase: (id: number) => void;
  setNextPhase: () => void;
  setPreviousPhase: () => void;
}

const getMaxPhaseOrdinal = (phases: Phase[] | undefined) =>
  phases?.reduce((prev, current) =>
    prev.PhaseOrdinal > current.PhaseOrdinal ? prev : current
  ).PhaseOrdinal;

export const usePhaseSelector = (gameId: string): IUsePhaseSelector => {
  const combinedQuery = { phases: useListPhasesQuery(gameId) };
  const { data } = combinedQuery.phases;
  const combinedQueryState = getCombinedQueryState(combinedQuery);

  const dispatch = useDispatch();

  // TODO this should be pushed up into selectors
  const selectedPhase = useSelectPhase() || getMaxPhaseOrdinal(data);

  const phases: PhasesDisplay | undefined = data?.map((phase) => [
    phase.PhaseOrdinal,
    getPhaseName(phase),
  ]);

  const setPhase = (phaseOrdinal: number) =>
    dispatch(phaseActions.set(phaseOrdinal));
  const setNextPhase = () => selectedPhase && setPhase(selectedPhase + 1);
  const setPreviousPhase = () => selectedPhase && setPhase(selectedPhase - 1);

  return {
    combinedQueryState,
    phases,
    selectedPhase,
    setPhase,
    setNextPhase,
    setPreviousPhase,
  };
};
