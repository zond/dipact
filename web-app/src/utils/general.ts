import murmurhash from "murmurhash-js";

import { Game } from "@diplicity/common";

export const hash = (s: string) => {
  return murmurhash(s, 0);
};

// TODO test
export const timeStrToDate = (s: string): string => {
  return new Date(Date.parse(s)).toLocaleDateString();
};

// TODO test
// TODO think about translation
export const minutesToDuration = (minutes: number, short = false) => {
  const reduce = (mins: number): string => {
    if (mins < 60) {
      return mins + "m";
    } else if (mins < 60 * 24) {
      const hours = mins / 60;
      const remainder = mins - hours * 60;
      if (remainder === 0) {
        return hours + "h";
      } else if (short && hours > 2) {
        return "<" + (hours + 1) + "h";
      }
      return hours + "h " + reduce(remainder);
    } else if (mins < 60 * 24 * 7) {
      const days = mins / (60 * 24);
      const remainder = mins - days * 60 * 24;
      if (remainder === 0) {
        return days + "d";
      } else if (short) {
        return "<" + (days + 1) + "d";
      }
      return days + "d " + reduce(remainder);
    } else {
      let weeks = mins / (60 * 24 * 7);
      let remainder = mins - weeks * 60 * 24 * 7;
      if (remainder === 0) {
        return weeks + "w";
      } else if (short) {
        return "<" + (weeks + 1) + "w";
      }
      return weeks + "w " + reduce(remainder);
    }
  };
  return reduce(minutes);
};

// TODO move to transformers?
// TODO test
export const phaseLengthDisplay = (game: Game) => {
  const movementPhase = game.PhaseLengthMinutes;
  const nonMovementPhase = game.NonMovementPhaseLengthMinutes;
  const displayString = minutesToDuration(movementPhase);
  if (nonMovementPhase && movementPhase !== nonMovementPhase) {
    return displayString + "/" + minutesToDuration(nonMovementPhase);
  }
  return displayString;
};

export const getPhaseDisplay = (game: Game) => {
  const newestPhaseMeta = game.NewestPhaseMeta[0];
  if (!newestPhaseMeta) {
    return "";
  }
  const { Season, Year, Type } = newestPhaseMeta;
  return `${Season} ${Year} ${Type}`;
};

export const copyToClipboard = (s: string): Promise<void> => {
  // TODO native support
  if (navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(s);
  }
  return Promise.reject("Browser does not support clipboard");
};
