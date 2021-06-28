import { adjectives, nouns, conflictSynonyms } from "./terms";

const capitalize = (s: string): string => {
  return s.slice(0, 1).toUpperCase() + s.slice(1);
};

const dziemba_levenshtein = (a: string, b: string): number => {
  let tmpString: string;
  let tmp: number;
  if (a.length === 0) {
    return b.length;
  }
  if (b.length === 0) {
    return a.length;
  }
  if (a.length > b.length) {
    tmpString = a;
    a = b;
    b = tmpString;
  }

  let i,
    j,
    res = 0;

  const alen = a.length;
  const blen = b.length;
  const row: number[] = Array(alen);
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
};

const funkyFactor = (s1: string, s2: string): number => {
  if (s1.length < 3 || s2.length < 3) {
    return dziemba_levenshtein(s1, s2);
  }
  return (
    dziemba_levenshtein(s1.slice(0, 3), s2.slice(0, 3)) +
    dziemba_levenshtein(s1.slice(-3), s2.slice(-3))
  );
};

const randomOf = (ary: string[]): string => {
  return ary[Math.floor(Math.random() * ary.length)];
};

const randomOfFunky = (basis: string, ary: string[]): string => {
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
};

export const randomGameName = (): string => {
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
};

export const twoDecimals = (
  numberOrString: string | number,
  up = false
): number => {
  const n = numberOrString.toString();

  if (up) {
    return 0.01 + Math.ceil(Number.parseFloat(n) * 100) / 100.0;
  }
  return Math.floor(Number.parseFloat(n) * 100) / 100.0;
};

export default {
  randomGameName,
  twoDecimals,
};
