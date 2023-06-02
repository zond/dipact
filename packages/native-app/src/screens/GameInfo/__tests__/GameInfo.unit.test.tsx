import React from "react";
import { render } from "@testing-library/react-native";

import GameInfo from "../GameInfo";

jest.mock("../../../hooks/useParams", () => ({
  useParams: () => ({
    gameId: "gameId",
  }),
}));

jest.mock("diplicity-common-internal", () => ({
  useGameInfoView: () => ({
    query: {
      data: {},
    },
  }),
}));

describe("GameInfo", () => {
  test("Renders without error", () => {
    render(<GameInfo />);
  });
});
