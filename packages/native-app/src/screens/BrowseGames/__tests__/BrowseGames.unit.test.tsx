import { render } from "@testing-library/react-native";
import React from "react";

import BrowseGames from "../BrowseGames";

describe("BrowseGames", () => {
  test("Renders without error", () => {
    render(<BrowseGames />);
  });
});
