import React from "react";
import { render } from "@testing-library/react-native";
import PlayerCardSkeleton from "../PlayerCard.skeleton";

jest.mock("../../Skeleton", () => "SkeletonComponent");

describe("PlayerCardSkeleton", () => {
  test("Renders without error (compact)", () => {
    const screen = render(<PlayerCardSkeleton variant="compact" />);
    expect(screen).toBeTruthy();
  });
  test("Renders without error (expanded)", () => {
    const screen = render(<PlayerCardSkeleton variant="expanded" />);
    expect(screen).toBeTruthy();
  });
});
