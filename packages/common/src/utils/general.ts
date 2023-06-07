import tk from "../translations/translateKeys";
import {
  Phase,
  NationAllocation,
  Game,
  DiplicityError,
  User,
  Member,
  TimeUnit,
  Player,
  TransformedVariant,
  TransformedGame,
  ValueRating,
  TransformedPhase,
} from "../store/types";
import { adjectives, conflictSynonyms, nouns } from "./terms";
import contrastColors from "./contrastColors";
import codes from "./isoCodes";

// const DiplicitySender = "Diplicity";
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
  const newestPhaseMeta =
    game.NewestPhaseMeta && game.NewestPhaseMeta.length
      ? game.NewestPhaseMeta[0]
      : undefined;
  if (!newestPhaseMeta) {
    return "";
  }
  const { Season, Year, Type } = newestPhaseMeta;
  return `${Season} ${Year} ${Type}`;
};

export const getPhaseName = ({ Season, Year, Type }: Phase): string =>
  `${Season} ${Year}, ${Type}`;

export const getNationColor = (
  variant: TransformedVariant,
  nation: string
): string => {
  const nationColors = variant.nationColors;
  const nationColor = nationColors ? nationColors[nation] : null;
  if (nationColor) return nationColor;
  const nationNotInVariant = !variant.nations.includes(nation);
  if (nationNotInVariant) {
    if (nation === "Neutral") {
      return "#d0d0d0";
    }
    if (nation === "Diplicity") {
      return "#000000";
    }
    throw Error(
      `Cannot find nation color for ${nation} in variant ${variant.nations}`
    );
  }
  const index = variant.nations.indexOf(nation);
  return contrastColors[index];
};

export const getNationAbbreviation = (
  variant: TransformedVariant,
  nation: string
): string => {
  const nationAbbreviations = variant.nationAbbreviations;
  if (!nationAbbreviations) return "";
  return nationAbbreviations[nation] || "";
};

export const getNationFlagLink = (
  _variant: TransformedVariant,
  _nation: string
): string | undefined => {
  // const links = variant.Links;
  // const linkObject = links
  //   ? links.find((link) => link.Rel === `flag-${nation}`)
  //   : null;
  // return nation === DiplicitySender
  //   ? OttoURL
  //   : linkObject
  //   ? linkObject.URL
  //   : undefined;
  return "";
};

export const getMember = (game: Game, user: User): Member | undefined => {
  return game.Members.find((m) => m.User.Email === user.Email);
};

export const getNation = (nation: string, variant: TransformedVariant) => {
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
  const options: { option: string; score: number }[] = [];
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

// TODO test
export const brightnessByColor = (color: string): number => {
  const m = color
    .substr(1)
    .match(color.length === 7 ? /(\S{2})/g : /(\S{1})/g) as RegExpMatchArray;
  const r = parseInt(m[0], 16),
    g = parseInt(m[1], 16),
    b = parseInt(m[2], 16);
  return (r * 299 + g * 587 + b * 114) / 1000;
};

export const convertMinutesToDaysOrHoursLabel = (
  minutes: number
): [number, TimeUnit] => {
  if (minutes % 1440 === 0) {
    return [minutes / 1440, "days"];
  } else if (minutes % 60 === 0) {
    return [minutes / 60, "hours"];
  }
  return [minutes, "minutes"];
};

// TODO translations
export const convertToTimeUnitLabel = (
  value: number,
  timeUnit: TimeUnit
): string => {
  return `${value} ${timeUnit}${value === 1 ? "" : "s"}`;
};

export const convertMinutesToLabel = (minutes: number): string => {
  const [value, timeUnit] = convertMinutesToDaysOrHoursLabel(minutes);
  return convertToTimeUnitLabel(value, timeUnit);
};

export const getLanguage = (languageCode: string) => {
  return codes.find((code) => code.code === languageCode);
};

export const convertUserToPlayer = (user: User): Player => {
  return {
    id: user.Id,
    username: user.Name,
    image: user.Picture,
  };
};

export const getNationAllocation = (nationAllocation: number) => {
  return nationAllocationMap[nationAllocation];
};

export const assertDefined = <T extends object>(
  obj: T
): { [P in keyof T]: NonNullable<T[P]> } => {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [key, value ?? (null as any)])
  ) as any;
};

export const findDefined = <T>(
  array: T[],
  callback: (value: T, index: number, array: T[]) => boolean
): T => {
  const result = array.find(callback);

  if (result === undefined) {
    throw new Error("No matching element was found in the array");
  }
  return result;
};

export const findVariantByGame = (
  game: TransformedGame,
  variants: TransformedVariant[]
) => {
  return findDefined(variants, (variant) => variant.name === game.variant);
};

export const findPhase = (
  phases: TransformedPhase[],
  id: number | undefined
) => {
  if (id === null) {
    return phases.reduce((prev, current) =>
      prev.id > current.id ? prev : current
    );
  }
  return findDefined(phases, (phase) => phase.id === id);
};

export const getValueRating = (value: number): ValueRating => {
  if (value > 0.5) {
    return "positive";
  } else if (value < -0.5) {
    return "negative";
  } else if (value >= -0.5 && value <= 0.5) {
    return "neutral";
  }
  throw new Error("Invalid value");
};
