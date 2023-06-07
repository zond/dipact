import { IAccessor } from "./Accessor";
import { IMatch, MatchFactory } from "./Match";

export interface ITarget {
  accessor: IAccessor;
  match: IMatch;
}

class Target implements ITarget {
  constructor(
    public readonly accessor: IAccessor,
    public readonly match: IMatch
  ) {}
}

export class TargetFactory {
  public static create(
    accessor: IAccessor,
    textMatch: IMatch["textMatch"],
    options?: IMatch["options"]
  ) {
    const match = MatchFactory.create(textMatch, options);
    return new Target(accessor, match);
  }
}
