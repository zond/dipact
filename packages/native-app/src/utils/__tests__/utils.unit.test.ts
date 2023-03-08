import {
  assertDefined,
  findDefined,
  findPhase,
  findVariantByGame,
  getValueRating,
} from "../general";

describe("assertDefined", () => {
  it("should return the same object when all values are defined", () => {
    const obj = { a: 1, b: 2, c: 3 };
    expect(assertDefined(obj)).toEqual(obj);
  });
});

describe("findDefined", () => {
  it("should return the first defined value", () => {
    const array = [undefined, 1, 2, 3];
    expect(findDefined(array, (value) => value !== undefined)).toBe(1);
  });

  it("should throw an error when no value is defined", () => {
    const array = [undefined, undefined, undefined];
    expect(() =>
      findDefined(array, (value) => value !== undefined)
    ).toThrowError("No matching element was found in the array");
  });
});

describe("findVariantByGame", () => {
  it("should return the variant with the same name as the game", () => {
    const game = { variant: "variant" } as any;
    const variants = [{ Name: "variant" }, { Name: "other" }] as any;
    expect(findVariantByGame(game, variants)).toEqual({ Name: "variant" });
  });

  it("should throw an error when no variant is found", () => {
    const game = { variant: "variant" } as any;
    const variants = [{ Name: "other" }] as any;
    expect(() => findVariantByGame(game, variants)).toThrowError(
      "No matching element was found in the array"
    );
  });
});

describe("findPhase", () => {
  it("should return the phase with the same id as the game", () => {
    const phases = [{ PhaseOrdinal: 1 }, { PhaseOrdinal: 2 }] as any;
    expect(findPhase(phases, 1)).toEqual({ PhaseOrdinal: 1 });
  });

  it("should return the last phase when id is null", () => {
    const phases = [{ PhaseOrdinal: 1 }, { PhaseOrdinal: 2 }] as any;
    expect(findPhase(phases, null)).toEqual({ PhaseOrdinal: 2 });
  });

  it("should throw an error when no phase is found", () => {
    const phases = [{ PhaseOrdinal: 1 }, { PhaseOrdinal: 2 }] as any;
    expect(() => findPhase(phases, 3)).toThrowError(
      "No matching element was found in the array"
    );
  });
});

describe("getValueRating", () => {
  it("should return positive when value is greater than 0.5", () => {
    expect(getValueRating(0.6)).toBe("positive");
  });

  it("should return negative when value is less than -0.5", () => {
    expect(getValueRating(-0.6)).toBe("negative");
  });

  it("should return neutral when value is between -0.5 and 0.5", () => {
    expect(getValueRating(0.4)).toBe("neutral");
  });

  it("should throw an error when value is not a number", () => {
    expect(() => getValueRating(NaN)).toThrowError("Invalid value");
  });
});
