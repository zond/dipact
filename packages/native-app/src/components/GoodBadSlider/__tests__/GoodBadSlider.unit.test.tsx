import React from "react";
import { LinearProgress } from "@rneui/base";
import { render } from "@testing-library/react-native";
import GoodBadSlider from "../GoodBadSlider";

jest.mock("@rneui/base", () => ({
  LinearProgress: jest.fn().mockReturnValue(null),
}));

jest.mock("../../Stack", () => ({
  Stack: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock("../../../hooks/useTheme", () => ({
  useTheme: jest.fn().mockReturnValue({
    palette: {
      border: {
        main: "black",
      },
      valueRatingPositive: {
        main: "green",
        light: "light-green",
      },
      valueRatingNeutral: {
        main: "yellow",
        light: "light-yellow",
      },
      valueRatingNegative: {
        main: "red",
        light: "light-red",
      },
    },
  }),
}));

const mockLinearProgress = LinearProgress as jest.MockedFunction<
  typeof LinearProgress
>;

describe("GoodBadSlider", () => {
  it.each`
    value   | firstValue | secondValue | color       | trackColor
    ${1}    | ${0}       | ${0}        | ${"green"}  | ${"light-green"}
    ${0.6}  | ${0.4}     | ${0}        | ${"green"}  | ${"light-green"}
    ${0.4}  | ${0.6}     | ${0}        | ${"yellow"} | ${"light-yellow"}
    ${-0.4} | ${1}       | ${0.4}      | ${"yellow"} | ${"light-yellow"}
    ${-0.6} | ${1}       | ${0.6}      | ${"red"}    | ${"light-red"}
    ${-1}   | ${1}       | ${1}        | ${"red"}    | ${"light-red"}
  `(
    "should render with firstValue: $firstValue, secondValue: $secondValue, color: $color, trackColor: $trackColor",
    ({ value, firstValue, secondValue, color, trackColor }) => {
      mockLinearProgress.mockClear();
      render(<GoodBadSlider value={value} />);
      expect(mockLinearProgress).toHaveBeenCalledTimes(2);
      expect(mockLinearProgress).toHaveBeenNthCalledWith(
        1,
        {
          animation: false,
          color: trackColor,
          trackColor: color,
          variant: "determinate",
          value: firstValue,
        },
        {}
      );
      expect(mockLinearProgress).toHaveBeenNthCalledWith(
        2,
        {
          animation: false,
          color: color,
          trackColor: trackColor,
          variant: "determinate",
          value: secondValue,
        },
        {}
      );
    }
  );
});
