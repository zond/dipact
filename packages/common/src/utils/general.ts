import Globals from "../Globals";
import tk from "../translations/translateKeys";
import {
  Phase,
  Variant,
  ColorOverrides,
  NationAllocation,
  Game,
} from "../store/types";

const DiplicitySender = "Diplicity";
export const OttoURL = "https://diplicity-engine.appspot.com/img/otto.png";

// TODO think about translation
export const minutesToDuration = (minutes: number, short = false) => {
  const reduce = (mins: number): string => {
    if (mins < 60) {
      return mins + "m";
    } else if (mins < 60 * 24) {
      const hours = Math.floor(mins / 60);
      const remainder = mins % 60;
      if (remainder === 0) {
        return hours + "h";
      } else if (short && hours > 2) {
        return "<" + (hours + 1) + "h";
      }
      return hours + "h " + reduce(remainder);
    } else if (mins < 60 * 24 * 7) {
      const days = Math.floor(mins / (60 * 24));
      const remainder = mins % (60 * 24);
      if (remainder === 0) {
        return days + "d";
      } else if (short) {
        return "<" + (days + 1) + "d";
      }
      return days + "d " + reduce(remainder);
    } else {
      const weeks = Math.floor(mins / (60 * 24 * 7));
      const remainder = mins % (60 * 24 * 7);
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
export const phaseLengthDisplay = (game: Game) => {
  const phaseLengths = new Set([
    game.PhaseLengthMinutes,
    game.NonMovementPhaseLengthMinutes,
  ]);
  return Array.from(phaseLengths)
    .map((minutes) => minutesToDuration(minutes, false))
    .join("/");
};

export const getPhaseDisplay = (game: Game) => {
  const newestPhaseMeta = game.NewestPhaseMeta[0];
  if (!newestPhaseMeta) {
    return "";
  }
  const { Season, Year, Type } = newestPhaseMeta;
  return `${Season} ${Year} ${Type}`;
};

export const getPhaseName = ({ Season, Year, Type }: Phase): string =>
  `${Season} ${Year}, ${Type}`;

export const getNationColor = (variant: Variant, nation: string): string => {
  const colorOverrides = Globals.colorOverrides as ColorOverrides;
  const variantColorOverrides = colorOverrides.variants[variant.Name];
  if (variantColorOverrides) {
    const nationColorOverride = variantColorOverrides[nation];
    if (nationColorOverride) return nationColorOverride;
  }
  const nationColors = variant.NationColors;
  const nationColor = nationColors ? nationColors[nation] : null;
  if (nationColor) return nationColor;
  const nationNotInVariant = !variant.Nations.includes(nation);
  if (nationNotInVariant) {
    if (nation === "Neutral") {
      return "#d0d0d0";
    }
    if (nation === "Diplicity") {
      return "#000000";
    }
    throw Error(
      `Cannot find nation color for ${nation} in variant ${variant.Name}`
    );
  }
  const index = variant.Nations.indexOf(nation);
  return Globals.contrastColors[index];
};

export const getNationAbbreviation = (
  variant: Variant,
  nation: string
): string => {
  const nationAbbreviations = variant.nationAbbreviations;
  if (!nationAbbreviations) return "";
  return nationAbbreviations[nation] || "";
};

export const getNationFlagLink = (
  variant: Variant,
  nation: string
): string | undefined => {
  const links = variant.Links;
  const linkObject = links
    ? links.find((link) => link.Rel === `flag-${nation}`)
    : null;
  return nation === DiplicitySender
    ? OttoURL
    : linkObject
    ? linkObject.URL
    : undefined;
};

export const nationAllocationMap: { [key: number]: NationAllocation } = {
  0: NationAllocation.Random,
  1: NationAllocation.Preference,
};

export const nationAllocationTranslations: { [key: string]: string } = {
  [NationAllocation.Random]: tk.nationAllocationOptions.random,
  [NationAllocation.Preference]: tk.nationAllocationOptions.preference,
};

export const timeStrToDate = (s: string): string => {
  return new Date(Date.parse(s)).toLocaleDateString();
};
