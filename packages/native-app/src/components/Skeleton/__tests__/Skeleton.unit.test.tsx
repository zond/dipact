import React from "react";
import { cleanup, render } from "@testing-library/react-native";
import { Skeleton as RneSkeleton } from "@rneui/base";

import Skeleton from "../Skeleton";

jest.mock("@rneui/base", () => ({
  Skeleton: jest.fn().mockReturnValue(null),
}));
const mockSkeleton = RneSkeleton as jest.MockedFunction<typeof RneSkeleton>;

jest.mock("../Skeleton.styles", () => ({
  useStyles: jest.fn(() => ({
    backgroundColor: "red",
  })),
}));

describe("Skeleton", () => {
  afterEach(cleanup);

  it("passes down all props and styles", () => {
    const props = { height: 40 };
    render(<Skeleton height={40} />);
    expect(mockSkeleton).toHaveBeenCalledWith(
      {
        ...props,
        animation: "none",
        style: [{ backgroundColor: "red" }, undefined],
      },
      {}
    );
  });
});
