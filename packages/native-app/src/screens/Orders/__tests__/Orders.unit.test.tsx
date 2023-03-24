import { render } from "@testing-library/react-native";
import React from "react";

import Sut from "../Orders";

const gameId = "gameId";

describe("Orders", () => {
  const renderSut = () => render(<Sut gameId={gameId} />);
  test("Renders without error", () => {
    renderSut();
  });
});
