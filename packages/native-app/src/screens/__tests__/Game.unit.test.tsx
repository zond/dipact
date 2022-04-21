import "react-native";
import React from "react";
import { render } from "@testing-library/react-native";

import Game from "../Game";

interface ArrangeOptions {}

jest.mock("../../hooks/useParams", () => ({
  useParams: () => ({ id: "" }),
}));
jest.mock("../../components/GameList");

describe("Game", () => {
  const arrange = () => {
    return render(<Game />);
  };
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test("Renders without error", () => {
    arrange();
  });
});
