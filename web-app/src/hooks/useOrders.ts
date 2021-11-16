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
import { ApiResponse } from "./types";
import { getMember, getNation, getCombinedQueryState } from "./utils";

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

export interface IUseOrders extends ApiResponse {
  nationStatuses: NationStatus[];
  noOrders: boolean;
  ordersConfirmed: boolean;
  toggleAcceptDraw: () => void;
  toggleConfirmOrders: () => void;
  userIsMember: boolean;
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
  const [
    listPhaseStatesTrigger,
    listPhaseStatesQuery,
  ] = useLazyListPhaseStatesQuery();
  const combinedQuery = {
    game: useGetGameQuery(gameId),
    phaseStates: listPhaseStatesQuery,
    phases: useListPhasesQuery(gameId),
    user: useGetRootQuery(undefined),
    variants: useListVariantsQuery(undefined),
  };
  const { game, phaseStates, phases, user } = {
    game: combinedQuery.game.data,
    phaseStates: combinedQuery.phaseStates.data,
    phases: combinedQuery.phases.data,
    user: combinedQuery.user.data,
  };
  const combinedQueryState = getCombinedQueryState(combinedQuery);

  const [
    updatePhaseState,
    { isLoading: phaseStateIsLoading },
  ] = useUpdatePhaseStateMutation();
  // TODO use selector
  const selectedPhase = useSelectPhase() || phases?.length;

  const [nationStatuses, setNationStatuses] = useState<NationStatus[]>([]);
  const variant = useSelectVariant(game?.Variant || "");

  useEffect(() => {
    if (phases?.length && selectedPhase) {
      const phaseId = phases[selectedPhase - 1].PhaseOrdinal.toString();
      listPhaseStatesTrigger({ gameId, phaseId });
    }
  }, [phases, gameId, listPhaseStatesTrigger, selectedPhase]);

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
    combinedQueryState,
    nationStatuses,
    noOrders,
    ordersConfirmed,
    userIsMember: true,
    toggleAcceptDraw,
    toggleConfirmOrders: () => null,
    phaseStateIsLoading,
  };
};

export const useOrdersContext = createContext<null | typeof useOrders>(null);

// Create DI context
const createDIContext = <T>() => createContext<null | T>(null);
export const useDIContext = createDIContext<typeof useOrders>();

// Function to get real or DI'd hook
const useGetHook = () => useContext(useDIContext) || useOrders;
const useDIHook = (gameId: string): IUseOrders => useGetHook()(gameId);

// Export as default, your component can't tell the difference
export default useDIHook;
