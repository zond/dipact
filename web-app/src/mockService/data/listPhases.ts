import {
  ListPhasesResponse,
  Phase,
  PhaseResponse,
  SCState,
} from "@diplicity/common";
import { getPhaseName } from "../../utils/general";

const NAME = "phases";
const TYPE = "Phase";
const HOST = "diplicity-engine.appspot.com";
const gameId = "game-1234";

interface Responses {
  [key: string]: ListPhasesResponse;
}

export const createPhase = (
  gameId: string,
  phaseId: number,
  season: string,
  year: number,
  type: string,
  resolved: boolean,
  supplyCenters: SCState[] = [],
  soloSCCount: number = 18,
): PhaseResponse => {
  const phase = { Season: season, Year: year, Type: type } as Phase;
  const name = getPhaseName(phase);
  return {
    Name: name,
    Type: TYPE,
    Links: null,
    Properties: {
      GameID: gameId,
      PhaseOrdinal: phaseId,
      Season: season,
      Year: year,
      Type: type,
      Resolved: resolved,
      CreatedAt: "",
      CreatedAgo: 0,
      ResolvedAt: "",
      ResolvedAgo: 0,
      DeadlineAt: "",
      NextDeadlineIn: 0,
      UnitsJSON: "",
      SCsJSON: "",
      Units: [],
      SCs: supplyCenters,
      Dislodgeds: null,
      Dislodgers: null,
      ForceDisbands: null,
      Bounces: null,
      Resolutions: [],
      Host: HOST,
      SoloSCCount: soloSCCount,
      PreliminaryScores: [],
    },
  };
};

export const createListPhaseResponse = (phaseResponses: PhaseResponse[]) => ({
  Name: NAME,
  Type: "List",
  Links: [],
  Properties: phaseResponses,
});

const responses: Responses = {
  [gameId]: createListPhaseResponse([
    createPhase(gameId, 1, "Spring", 1901, "Movement", true),
  ]),
};

export default responses;
