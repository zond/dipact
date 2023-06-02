import React from "react";
import { render } from "@testing-library/react-native";

import Sut from "../PlayerInfo";

jest.mock("../../../hooks/useParams", () => ({
  useParams: () => ({
    gameId: "gameId",
  }),
}));

jest.mock("@diplicity/common", () => ({
  usePlayerInfoView: () => ({
    query: {
      data: {
        players: [{ id: "id" }],
      },
    },
  }),
}));

jest.mock("../../../components/PlayerCard", () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => null),
}));

describe("PlayerInfo", () => {
  const renderSut = () => render(<Sut />);
  test("Renders without error", () => {
    renderSut();
  });
});
