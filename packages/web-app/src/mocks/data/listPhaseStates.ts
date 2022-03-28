import { ListPhaseStatesResponse, PhaseStateResponse } from "@diplicity/common";

const NAME = "phase-states";
const TYPE = "PhaseState";
const gameId = "game-1234";

const Nations = {
  standard: {
    Austria: "Austria",
    England: "England",
    France: "France",
    Germany: "Germany",
    Italy: "Italy",
    Russia: "Russia",
    Turkey: "Turkey",
  },
};

interface Responses {
  [key: string]: {
    [key: string]: ListPhaseStatesResponse;
  };
}

export const createPhaseState = (
  gameId: string,
  phaseId: number,
  nation: string,
  options: any = {},
): PhaseStateResponse => ({
  Name: Nations.standard.Austria,
  Type: TYPE,
  Links: null,
  Properties: {
    GameID: gameId,
    PhaseOrdinal: phaseId,
    Nation: nation,
    ReadyToResolve: options.ordersConfirmed || false,
    WantsDIAS: options.wantsDraw || false,
    WantsConcede: false,
    OnProbation: false,
    NoOrders: options.noOrders || false,
    Eliminated: false,
    Messages: options.messages || "",
    ZippedOptions: null,
    Note: "",
  },
});

export const createListPhaseStateResponse = (
  phaseStates: PhaseStateResponse[]
) => ({
  Name: NAME,
  Type: "List",
  Links: [],
  Properties: phaseStates,
});

const responses: Responses = {
  [gameId]: {
    1: createListPhaseStateResponse([
      createPhaseState(gameId, 1, Nations.standard.Austria),
      createPhaseState(gameId, 1, Nations.standard.England),
      createPhaseState(gameId, 1, Nations.standard.France),
      createPhaseState(gameId, 1, Nations.standard.Germany),
      createPhaseState(gameId, 1, Nations.standard.Italy),
      createPhaseState(gameId, 1, Nations.standard.Russia),
      createPhaseState(gameId, 1, Nations.standard.Turkey),
    ]),
  },
};

export default responses;
