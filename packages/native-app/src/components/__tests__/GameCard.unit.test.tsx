import "react-native";
import React from "react";
import { render } from "@testing-library/react-native";

import GameCard from "../GameCard";

interface ArrangeOptions {}

describe("GameCard", () => {
  const arrange = (_?: ArrangeOptions) => {
    return render(<GameCard />);
  };
  beforeEach(() => {});
  test("Renders without error", () => {
    arrange();
  });
});
