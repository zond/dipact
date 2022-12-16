import { useTheme } from "../useTheme";

describe("useTheme", () => {
  test("Gets theme from rneUseTheme", () => {
    const theme = useTheme();
    expect(theme.palette.border).toEqual({});
  });
});
