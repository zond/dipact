import Globals from "../Globals";
import tk from "../translations/translateKeys";
import {
  Phase,
  Variant,
  ColorOverrides,
  NationAllocation,
  Game,
  DiplicityError,
  User,
  Member,
} from "../store/types";
import { adjectives, conflictSynonyms, nouns } from "./terms";
import contrastColors from "./contrastColors";

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
  return contrastColors[index];
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

export const getMember = (game: Game, user: User): Member | undefined => {
  return game.Members.find((m) => m.User.Email === user.Email);
};

export const getNation = (nation: string, variant: Variant) => {
  const color = getNationColor(variant, nation);
  const abbreviation = getNationAbbreviation(variant, nation);
  const link = getNationFlagLink(variant, nation);
  const name = nation;
  return { name, color, abbreviation, link };
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

function randomOf(ary: any[]) {
  return ary[Math.floor(Math.random() * ary.length)];
}

// Copied from https://gist.github.com/andrei-m/982927
function dziemba_levenshtein(a: string, b: string) {
  var tmp;
  if (a.length === 0) {
    return b.length;
  }
  if (b.length === 0) {
    return a.length;
  }
  if (a.length > b.length) {
    tmp = a;
    a = b;
    b = tmp;
  }

  var i,
    j,
    res,
    alen = a.length,
    blen = b.length,
    row = Array(alen);
  for (i = 0; i <= alen; i++) {
    row[i] = i;
  }

  for (i = 1; i <= blen; i++) {
    res = i;
    for (j = 1; j <= alen; j++) {
      tmp = row[j - 1];
      row[j - 1] = res;
      res =
        b[i - 1] === a[j - 1]
          ? tmp
          : Math.min(tmp + 1, Math.min(res + 1, row[j] + 1));
    }
  }
  return res;
}

function funkyFactor(s1: string, s2: string) {
  if (s1.length < 3 || s2.length < 3) {
    return dziemba_levenshtein(s1, s2);
  }
  return (
    dziemba_levenshtein(s1.slice(0, 3), s2.slice(0, 3)) +
    dziemba_levenshtein(s1.slice(-3), s2.slice(-3))
  );
}

function randomOfFunky(basis: string, ary: any[]) {
  const options = [];
  for (let i = 0; i < Math.floor(ary.length / 10); i++) {
    const option = randomOf(ary);
    options.push({
      option: option,
      score: funkyFactor(basis, option),
    });
  }
  options.sort((a, b) => {
    return a.score < b.score ? -1 : 1;
  });
  return options[0].option;
}

function capitalize(s: string) {
  return s.slice(0, 1).toUpperCase() + s.slice(1);
}

// TODO test
export function randomGameName() {
  const synonym = randomOf(conflictSynonyms);
  const adjective = randomOfFunky(synonym, adjectives);
  const noun = randomOfFunky(adjective, nouns);
  return (
    "The " +
    capitalize(synonym) +
    " of the " +
    capitalize(adjective) +
    " " +
    capitalize(noun)
  );
}

type SimplifiedQueryResult = {
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  error?: DiplicityError;
};

export type CombinedQueryState = SimplifiedQueryResult;

export type CombinedQuery = {
  [key: string]: Partial<SimplifiedQueryResult>;
};

export const mergeErrors = (
  ...errorsOrUndefined: (DiplicityError | undefined)[]
): DiplicityError => {
  const errors: DiplicityError[] = [];
  errorsOrUndefined.forEach((error) => {
    if (error) errors.push(error as DiplicityError);
  });
  return errors.reduce(
    (mergedErrors, e) => {
      const error = e as DiplicityError & { status: number; data: any };
      const newError = {
        status: error?.status || mergedErrors.status,
        data: error?.data || mergedErrors.data,
      };
      return newError as DiplicityError & { status: number; data: any };
    },
    { status: 0, data: {} } as DiplicityError
  );
};
