import React from "react";
import { render } from "@testing-library/react-native";

import GameInfo from "../GameInfo";

jest.mock("../../../hooks/useParams", () => ({
  useParams: () => ({
    gameId: "gameId",
  }),
}));

jest.mock("../../../components/QueryContainer", () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(({ query, render }) => {
    return render(query.data);
  }),
}));

// mock useGameInfoView
jest.mock("../../../hooks/useGameInfoView", () => ({
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
