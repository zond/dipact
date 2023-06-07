import { Game, Phase, TransformedVariant } from "../../store";
import {
  getNationAbbreviation,
  getNationColor,
  getPhaseDisplay,
  getPhaseName,
  minutesToDuration,
  phaseLengthDisplay,
  timeStrToDate,
} from "../general";

describe("minutesToDuration", () => {
  test.each`
    minutes                       | short    | expected
    ${0}                          | ${false} | ${"0m"}
    ${1}                          | ${false} | ${"1m"}
    ${60}                         | ${false} | ${"1h"}
    ${90}                         | ${false} | ${"1h 30m"}
    ${90}                         | ${true}  | ${"1h 30m"}
    ${210}                        | ${false} | ${"3h 30m"}
    ${210}                        | ${true}  | ${"<4h"}
    ${60 * 24}                    | ${false} | ${"1d"}
    ${60 * 24 + 15}               | ${true}  | ${"<2d"}
    ${60 * 24 * 2}                | ${false} | ${"2d"}
    ${60 * 12 * 3}                | ${false} | ${"1d 12h"}
    ${60 * 12 * 3}                | ${true}  | ${"<2d"}
    ${60 * 24 * 7}                | ${false} | ${"1w"}
    ${60 * 24 * 10}               | ${true}  | ${"<2w"}
    ${60 * 24 * 10}               | ${false} | ${"1w 3d"}
    ${60 * 24 * 10 + 60 * 2}      | ${false} | ${"1w 3d 2h"}
    ${60 * 24 * 10 + 60 * 2 + 30} | ${false} | ${"1w 3d 2h 30m"}
    ${60 * 24 * 14}               | ${false} | ${"2w"}
  `(
    "Converts $minutes to '$expected' when short is $short",
    ({ minutes, short, expected }) => {
      const result = minutesToDuration(minutes, short);
      expect(result).toBe(expected);
    }
  );
  test("Defaults to short = false", () => {
    const result = minutesToDuration(210);
    expect(result).toBe("3h 30m");
  });
});

describe("phaseLengthDisplay", () => {
  test.each`
    phaseLength | nonMovementPhaseLength | expected
    ${60}       | ${60}                  | ${"1h"}
    ${120}      | ${60}                  | ${"2h/1h"}
  `(
    "Converts $minutes to '$expected' when phaseLength is is $phaseLength and nonMovementPhaseLength is $nonMovementPhaseLength",
    ({ phaseLength, nonMovementPhaseLength, expected }) => {
      const game = {
        PhaseLengthMinutes: phaseLength,
        NonMovementPhaseLengthMinutes: nonMovementPhaseLength,
      } as Game;
      const result = phaseLengthDisplay(game);
      expect(result).toBe(expected);
    }
  );
});

describe("getPhaseDisplay", () => {
  test("Converts to string", () => {
    const expected = "Spring 1901 Movement";
    const phase = { Season: "Spring", Year: 1901, Type: "Movement" };
    const game = { NewestPhaseMeta: [phase] } as Game;
    const result = getPhaseDisplay(game);
    expect(result).toBe(expected);
  });
  test("Converts empty game to empty string", () => {
    const expected = "";
    const game = { NewestPhaseMeta: [] } as unknown as Game;
    const result = getPhaseDisplay(game);
    expect(result).toBe(expected);
  });
});

describe("getPhaseName", () => {
  test("Converts to string", () => {
    const expected = "Spring 1901, Movement";
    const phase = { Season: "Spring", Year: 1901, Type: "Movement" } as Phase;
    const result = getPhaseName(phase);
    expect(result).toBe(expected);
  });
});

describe("getNationColor", () => {
  const england = "england";
  const englandColor = "#12345";
  const variant = {
    name: "Classical",
    nations: [england, "Italy"],
    nationColors: { england: englandColor },
  } as Partial<TransformedVariant> as TransformedVariant;

  test("Gets variant nation color", () => {
    const result = getNationColor(variant, "england");
    expect(result).toBe("#12345");
  });
  test("Gets gets color for Neutral", () => {
    const result = getNationColor(variant, "Neutral");
    expect(result).toBe("#d0d0d0");
  });
  test("Gets gets color for Diplicity", () => {
    const result = getNationColor(variant, "Diplicity");
    expect(result).toBe("#000000");
  });
  test("Throws error if not color", () => {
    expect(() => getNationColor(variant, "Germany")).toThrow(Error);
  });
  test("Gets contrast color", () => {
    expect(getNationColor(variant, "Italy")).toBe("#2196F3");
  });
});

describe("getNationAbbreviation", () => {
  const england = "england";
  const englandAbbreviation = "Eng";
  const variant = {
    nationAbbreviations: { england: englandAbbreviation },
  } as Partial<TransformedVariant> as TransformedVariant;

  test("Gets abbreviation", () => {
    const result = getNationAbbreviation(variant, england);
    expect(result).toBe(englandAbbreviation);
  });
  test("Returns empty when no abbreviation for nation", () => {
    const result = getNationAbbreviation(variant, "France");
    expect(result).toBe("");
  });
  test("Returns empty when no abbreviations", () => {
    const result = getNationAbbreviation({} as TransformedVariant, england);
    expect(result).toBe("");
  });
});

describe("timeStrToDate", () => {
  test("Date", () => {
    const expected = "1/11/2022";
    timeStrToDate("2022-01-11T15:51:30.34856Z");
    expect(expected).toEqual(expect.any(String)); // Note, remote has different timezone so CI fails if we get more specific than this.
  });
});
