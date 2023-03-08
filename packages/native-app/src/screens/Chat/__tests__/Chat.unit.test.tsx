import { render } from "@testing-library/react-native";
import React from "react";

import Chat from "../Chat";

const gameId = "gameId";

describe("Chat", () => {
  test("Renders without error", () => {
    render(<Chat gameId={gameId} />);
  });
});
