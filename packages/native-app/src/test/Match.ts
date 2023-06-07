import { TextMatch, TextMatchOptions } from "@testing-library/react-native";

export interface IMatch {
  textMatch: TextMatch;
  options?: TextMatchOptions;
}

class Match implements IMatch {
  constructor(
    public readonly textMatch: TextMatch,
    public readonly options?: TextMatchOptions
  ) {}
}

export class MatchFactory {
  public static create(textMatch: TextMatch, options?: TextMatchOptions) {
    return new Match(textMatch, options);
  }
}
