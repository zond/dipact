import { theme } from "../theme";

describe("Theme", () => {
  test("spacing", () => {
    const func = theme.spacing as (val: number) => number;
    const result = func(3);
    expect(result).toBe(24);
  });
});
