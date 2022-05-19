import "react-native";
import React from "react";
import { render, RenderAPI } from "@testing-library/react-native";

import Map from "../Map";
import { given, then, when } from "../../utils/test";

interface ArrangeOptions {}

const gameId = "gameId";
let screen: RenderAPI;

given("Map", () => {
  const arrange = () => {
    return render(<Map gameId={gameId} />);
  };
  beforeEach(() => {
    jest.clearAllMocks();
  });
  when("The component renders", () => {
    beforeEach(() => {
      screen = arrange();
    });

    then("The game ID is visible", () => {
      screen.getByText(gameId);
    });
  });
});
