import { useDispatch, useSelector } from "react-redux";

import { DiplicityError, Phase } from "../store/types";
import { getPhaseName } from "../utils/general";
import { diplicityService, phaseActions, selectors } from "../store";

const { useListPhasesQuery } = diplicityService;

type PhasesDisplay = [number, string][];

export interface IUsePhaseSelector {
  isLoading: boolean;
  isError: boolean;
  error: DiplicityError | null;
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

const usePhaseSelector = (gameId: string): IUsePhaseSelector => {
  const { data, isLoading, isError, error} = useListPhasesQuery(gameId);

  const dispatch = useDispatch();

  // TODO this should be pushed up into selectors
  const selectedPhase =
    useSelector(selectors.selectPhase) || getMaxPhaseOrdinal(data);

  const phases: PhasesDisplay | undefined = data?.map((phase) => [
    phase.PhaseOrdinal,
    getPhaseName(phase),
  ]);

  const setPhase = (phaseOrdinal: number) =>
    dispatch(phaseActions.set(phaseOrdinal));
  const setNextPhase = () => selectedPhase && setPhase(selectedPhase + 1);
  const setPreviousPhase = () => selectedPhase && setPhase(selectedPhase - 1);

  return {
    isLoading,
    isError,
    error: error as DiplicityError,
    phases,
    selectedPhase,
    setPhase,
    setNextPhase,
    setPreviousPhase,
  };
};

export default usePhaseSelector;
