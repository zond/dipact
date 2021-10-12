import { createContext, useContext, useEffect, useState } from "react";
import { Nation } from "../components/Orders/NationSummary";
import { OrderDisplay } from "../components/Orders/Order";

import { Game, Member, Phase, PhaseState, User, Variant } from "../store/types";
import { useSelectPhase, useSelectVariant } from "./selectors";
import {
  useGetGameQuery,
  useGetRootQuery,
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

export interface NationStatus {
  confirmedOrders: boolean;
  noOrdersGiven: boolean;
  numBuilds: number | null;
  numDisbands: number | null;
  numSupplyCenters: number;
  numSupplyCentersToWin: number;
  wantsDraw: boolean;
  nation: Nation;
  orders: OrderDisplay[];
  homelessInconsistencies: string[];
}

export interface IUseOrders {
  error: ApiError | null;
  isError: boolean;
  isLoading: boolean;
  nationStatuses: NationStatus[];
  noOrders: boolean;
  ordersConfirmed: boolean;
  toggleAcceptDraw: () => void;
  toggleConfirmOrders: () => void;
  userIsMember: boolean;
  phasesDisplay: PhasesDisplay | undefined;
  selectedPhase: number | undefined;
  setSelectedPhase: (phaseOrdinal: number) => void;
  phaseStateIsLoading: boolean;
}

const getNumBuilds = (phaseState: PhaseState, member: Member | undefined) => {
  const isMember = phaseState.Nation === member?.Nation;
  const splitMessages = phaseState.Messages.split(",");
  const partIndex = isMember ? 1 : 2;
  const partString = isMember ? "MayBuild" : "OtherMayBuild";
  const message = splitMessages.find(
    (message) => message.split(":")[0] === partString
  );
  return message ? parseInt(message.split(":")[partIndex]) : null;
};

const getNumDisbands = (phaseState: PhaseState, member: Member | undefined) => {
  const isMember = phaseState.Nation === member?.Nation;
  const splitMessages = phaseState.Messages.split(",");
  const partIndex = isMember ? 1 : 2;
  const partString = isMember ? "MustDisband" : "OtherMustDisband";
  const message = splitMessages.find(
    (message) => message.split(":")[0] === partString
  );
  return message ? parseInt(message.split(":")[partIndex]) : null;
};

const getPhaseState = (
  game: Game | undefined,
  user: User | undefined | null,
  phaseStates: PhaseState[]
): PhaseState | undefined => {
  if (game && user) {
    const member = getMember(game, user);
    return phaseStates?.find((ps) => ps.Nation === member?.Nation);
  }
};

const getNationStatus = (
  phaseState: PhaseState,
  phases: Phase[],
  variant: Variant,
  member: Member | undefined
): NationStatus => {
  const phase = phases.find(
    (phase) => phase.PhaseOrdinal === phaseState.PhaseOrdinal
  );

  const numBuilds = getNumBuilds(phaseState, member);
  const numDisbands = getNumDisbands(phaseState, member);

  const numSupplyCentersToWin = phase?.SoloSCCount || 0;
  const numSupplyCenters =
    phase?.SCs?.filter((sc) => sc.Owner === phaseState.Nation).length || 0;
  const nation: any = getNation(phaseState.Nation, variant);
  nation.isUser = nation.name === member?.Nation;
  nation.flagLink = nation.link;
  nation.label = nation.isUser ? nation.name + " (You)" : nation.name;

  return {
    confirmedOrders: phaseState.ReadyToResolve,
    noOrdersGiven: phaseState.NoOrders,
    wantsDraw: phaseState.WantsDIAS,
    numBuilds,
    numDisbands,
    numSupplyCenters,
    numSupplyCentersToWin,
    nation,
    orders: [],
    homelessInconsistencies: [],
  };
};

const useOrders = (gameId: string): IUseOrders => {
  const {
    error: variantsError,
    isLoading: variantsIsLoading,
    isError: variantsIsError,
  } = useListVariantsQuery(undefined);
  const [
    listPhasesTrigger,
    {
      data: phaseStates,
      error: phaseStatesError,
      isLoading: phaseStatesIsLoading,
      isError: phaseStatesIsError,
    },
  ] = useLazyListPhaseStatesQuery();
  const {
    data: phases,
    error: phasesError,
    isLoading: phasesIsLoading,
    isError: phasesIsError,
  } = useListPhasesQuery(gameId);
  const {
    data: user,
    error: userError,
    isLoading: userIsLoading,
    isError: userIsError,
  } = useGetRootQuery(undefined);
  const {
    data: game,
    error: gameError,
    isLoading: gameIsLoading,
    isError: gameIsError,
  } = useGetGameQuery(gameId);

  const [updatePhaseState, { isLoading: phaseStateIsLoading }] =
    useUpdatePhaseStateMutation();
  const selectedPhase = useSelectPhase() || phases?.length;

  const dispatch = useDispatch();
  const setSelectedPhase = (phaseOrdinal: number) =>
    dispatch(phaseActions.set(phaseOrdinal));

  const [nationStatuses, setNationStatuses] = useState<NationStatus[]>([]);
  const variant = useSelectVariant(game?.Variant || "");

  useEffect(() => {
    if (phases?.length && selectedPhase) {
      const phase = phases[selectedPhase - 1];
      listPhasesTrigger({ gameId, phaseId: phase.PhaseOrdinal.toString() });
    }
  }, [phases, gameId, listPhasesTrigger, selectedPhase]);

  useEffect(() => {
    if (phases && game && variant && user && phaseStates) {
      const member = getMember(game, user);
      setNationStatuses(
        phaseStates.map((phaseState) =>
          getNationStatus(phaseState, phases, variant, member)
        )
      );
    }
  }, [phases, game, variant, user, phaseStates]);

  // TODO check this works
  // TODO test
  // Sets phase to null when component is unmounted
  useEffect(() => {
    return () => {
      dispatch(phaseActions.clear());
    };
  });

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

  const phasesDisplay: PhasesDisplay | undefined = phases?.map((phase) => [
    phase.PhaseOrdinal,
    getPhaseName(phase),
  ]);

  const toggleAcceptDraw = () => {
    if (phases && game && variant && user && phaseStates) {
      const member = getMember(game, user);
      const phaseState = phaseStates?.find(
        (ps) => ps.Nation === member?.Nation
      );
      if (phaseState) {
        const updatedPhaseState: PhaseState = {
          ...phaseState,
          WantsDIAS: !phaseState?.WantsDIAS,
        };
        updatePhaseState(updatedPhaseState);
      }
    }
  };

  const phaseState = getPhaseState(game, user, phaseStates || []);
  const ordersConfirmed = phaseState?.ReadyToResolve || false;
  const noOrders = phaseState?.NoOrders || false;

  return {
    isError,
    isLoading,
    error,
    nationStatuses,
    noOrders,
    ordersConfirmed,
    userIsMember: true,
    toggleAcceptDraw,
    toggleConfirmOrders: () => null,
    phasesDisplay,
    selectedPhase,
    setSelectedPhase,
    phaseStateIsLoading,
  };
};

export const OrdersStub = createContext<null | typeof useOrders>(null);

const useGetHook = (): ((gameId: string) => IUseOrders) => {
  const mockUseOrders = useContext(OrdersStub);
  return mockUseOrders ? mockUseOrders : useOrders;
};

export default useGetHook;
