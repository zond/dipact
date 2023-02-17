import React from "react";
import { render } from "@testing-library/react-native";
import GameCardSkeleton from "../GameCard.skeleton";

jest.mock("../../Skeleton", () => "SkeletonComponent");

describe("GameCardSkeleton", () => {
  test("Renders without error", () => {
    const screen = render(<GameCardSkeleton />);
    expect(screen).toBeTruthy();
  });
});
