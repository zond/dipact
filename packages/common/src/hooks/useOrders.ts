import { useEffect, useState } from "react";

import {
  Game,
  Member,
  Phase,
  PhaseState,
  User,
  Variant,
  NationStatusDisplay,
  DiplicityError,
  Corroboration,
} from "../store/types";

import { diplicityService, selectors } from "../store";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { getMember, getNation, mergeErrors } from "../utils/general";
import { getOrderDisplay } from "../transformers/order";

export type PhasesDisplay = [number, string][];

interface IUseOrders {
  isLoading: boolean;
  isError: boolean;
  error: DiplicityError | null;
  nationStatuses: NationStatusDisplay[];
  noOrders: boolean;
  ordersConfirmed: boolean;
  isCurrentPhase: boolean;
  toggleAcceptDraw: () => void;
  toggleConfirmOrders: () => void;
  userIsMember: boolean;
  phaseStateIsLoading: boolean;
}

const {
  useGetGameQuery,
  useGetRootQuery,
  useLazyListPhaseStatesQuery,
  useListPhasesQuery,
  useListVariantsQuery,
  useUpdatePhaseStateMutation,
  useLazyListOrdersQuery,
} = diplicityService;

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
  return;
};

const getNationStatus = (
  nationName: string,
  phaseState: PhaseState | undefined,
  phase: Phase,
  corroboration: Corroboration,
  variant: Variant,
  member: Member | undefined
): NationStatusDisplay => {

  const numBuilds = phaseState ? getNumBuilds(phaseState, member) : null;
  const numDisbands = phaseState ? getNumDisbands(phaseState, member): null;

  const numSupplyCentersToWin = phase.SoloSCCount || 0;
  const numSupplyCenters =
    phase.SCs?.filter((sc) => sc.Owner === nationName).length || 0;
  const nation: any = getNation(nationName, variant);
  nation.isUser = nation.name === member?.Nation;
  nation.flagLink = nation.link;
  nation.label = nation.isUser ? nation.name + " (You)" : nation.name;

  const orders = (corroboration.Orders || [])
    .filter((order) => order.Nation === nationName)
    .map((order) =>
      getOrderDisplay(order, variant, corroboration.Inconsistencies, phase)
    );

  return {
    confirmedOrders: phaseState?.ReadyToResolve || false,
    noOrdersGiven: phaseState?.NoOrders || false,
    wantsDraw: phaseState?.WantsDIAS || false,
    numBuilds,
    numDisbands,
    numSupplyCenters,
    numSupplyCentersToWin,
    nation,
    orders,
    homelessInconsistencies: [],
  };
};

const useOrders = (gameId: string): IUseOrders => {
  const [listPhaseStatesTrigger, listPhaseStatesQuery] =
    useLazyListPhaseStatesQuery();
  const [listOrdersTrigger, listOrdersQuery] = useLazyListOrdersQuery();
  const combinedQuery = {
    variants: useListVariantsQuery(undefined),
    phases: useListPhasesQuery(gameId),
    user: useGetRootQuery(undefined),
    game: useGetGameQuery(gameId),
    phaseStates: listPhaseStatesQuery,
    orders: listOrdersQuery,
  };
  const { game, phaseStates, phases, user, orders } = {
    game: combinedQuery.game.data,
    phaseStates: combinedQuery.phaseStates.data,
    phases: combinedQuery.phases.data,
    user: combinedQuery.user.data,
    orders: combinedQuery.orders.data,
  };
  const isLoading =
    combinedQuery.variants.isLoading ||
    combinedQuery.phases.isLoading ||
    combinedQuery.phaseStates.isLoading ||
    combinedQuery.user.isLoading ||
    combinedQuery.orders.isLoading ||
    combinedQuery.game.isLoading;
  const isError =
    combinedQuery.variants.isError ||
    combinedQuery.phases.isError ||
    combinedQuery.phaseStates.isError ||
    combinedQuery.user.isError ||
    combinedQuery.orders.isError ||
    combinedQuery.game.isError;
  const error = isError
    ? mergeErrors(
        combinedQuery.variants.error as DiplicityError,
        combinedQuery.phases.error as DiplicityError,
        combinedQuery.phaseStates.error as DiplicityError,
        combinedQuery.game.error as DiplicityError,
        combinedQuery.user.error as DiplicityError,
        combinedQuery.orders.error as DiplicityError,
        combinedQuery.game.error as DiplicityError
      )
    : null;
  const [updatePhaseState, { isLoading: phaseStateIsLoading }] =
    useUpdatePhaseStateMutation();
  // TODO use selector
  const selectedPhase = useSelector(selectors.selectPhase) || phases?.length;

  const [nationStatuses, setNationStatuses] = useState<NationStatusDisplay[]>(
    []
  );
  const variant = useSelector((state: RootState) =>
    selectors.selectVariant(state, game?.Variant || "")
  );

  useEffect(() => {
    if (phases?.length && selectedPhase) {
      const phaseId = phases[selectedPhase - 1].PhaseOrdinal.toString();
      listPhaseStatesTrigger({ gameId, phaseId });
      listOrdersTrigger({ gameId, phaseId });
    }
  }, [
    phases,
    gameId,
    listPhaseStatesTrigger,
    listOrdersTrigger,
    selectedPhase,
  ]);

  useEffect(() => {
    if (phases && game && variant && user && phaseStates && orders && selectedPhase) {
      const member = getMember(game, user);
      const phase = phases.find((phase) => phase.PhaseOrdinal === selectedPhase) as Phase;
      setNationStatuses(
        variant.Nations.map((nation) => {
          const phaseState = phaseStates.find(
            (phaseState) => phaseState.Nation === nation
          );
          return getNationStatus(
            nation,
            phaseState,
            phase,
            orders,
            variant,
            member
          );
        })
      );
    }
  }, [phases, game, variant, user, phaseStates, orders, selectedPhase]);

  const currentPhase = phases?.find((phase) => phase.Resolved === false);

  // TODO push to action
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

  // TODO push to action
  const toggleConfirmOrders = () => {
    if (phases && game && variant && user && phaseStates) {
      const member = getMember(game, user);
      const phaseState = phaseStates?.find(
        (ps) => ps.Nation === member?.Nation
      );
      if (phaseState) {
        const updatedPhaseState: PhaseState = {
          ...phaseState,
          ReadyToResolve: !phaseState?.ReadyToResolve,
        };
        updatePhaseState(updatedPhaseState);
      }
    }
  };

  const phaseState = getPhaseState(game, user, phaseStates || []);
  const ordersConfirmed = phaseState?.ReadyToResolve || false;
  const noOrders = phaseState?.NoOrders || false;
  const isCurrentPhase = phaseState?.PhaseOrdinal === currentPhase?.PhaseOrdinal;

  return {
    isLoading,
    isError,
    error,
    nationStatuses,
    noOrders,
    ordersConfirmed,
    isCurrentPhase,
    userIsMember: true,
    toggleAcceptDraw,
    toggleConfirmOrders,
    phaseStateIsLoading,
  };
};

export default useOrders;
