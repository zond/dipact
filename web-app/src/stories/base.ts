import { Nation } from "../components/Orders/NationSummary";
import { IUsePhaseSelector } from "../hooks/usePhaseSelector";

export const defaultCombinedQuerystate = {
  isError: false,
  isLoading: false,
  isSuccess: true,
};

export const defaultUsePhaseSelectorArgs: IUsePhaseSelector = {
  combinedQueryState: defaultCombinedQuerystate,
  phases: [
      [1, "Spring 1901, Movement"],
      [2, "Spring 1901, Retreat"],
      [3, "Fall 1901, Movement"],
      [4, "Fall 1901, Retreat"],
      [5, "Fall 1901, Adjustment"],
  ],
  selectedPhase: 5,
  setPhase: () => console.log("Set phase"),
  setNextPhase: () => console.log("Set next phase"),
  setPreviousPhase: () => console.log("Set previous phase"),
};

export const Nations: { [key: string]: Nation } = {
  France: {
    abbreviation: "fr",
    name: "France",
    color: "#FFF",
    flagLink:
      "https://diplicity-engine.appspot.com/Variant/Classical/Flags/France.svg",
    isUser: false,
  },
};