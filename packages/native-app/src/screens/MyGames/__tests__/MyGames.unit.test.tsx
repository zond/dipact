import "react-native";
import React from "react";
import { render } from "@testing-library/react-native";

import Sut from "../MyGames";
import Filter from "../../../components/Filter";
import PlayerCard from "../../../components/PlayerCard";
import { act } from "react-test-renderer";

jest.mock("../../../../common", () => ({
  GameStatus: {},
}));
jest.mock("../../../components/Filter", () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => null),
}));
jest.mock("../../../components/PlayerCard", () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => null),
}));

const mockPlayerCard = PlayerCard as unknown as jest.Mock;
const mockFilter = Filter as unknown as jest.Mock;

describe("MyGames", () => {
  const renderSut = () => {
    return render(<Sut />);
  };
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test("Renders without error", () => {
    renderSut();
  });
  test("Renders PlayerCard", () => {
    renderSut();
    expect(mockPlayerCard).toBeCalledTimes(1);
  });
  test("Renders Filter", () => {
    renderSut();
    expect(mockFilter).toBeCalledTimes(1);
  });
  test("onChange Filter calls setStatus", () => {
    renderSut();
    const onChange = mockFilter.mock.calls[0][0].onChange;
    act(() => {
      onChange("finished");
    });
    expect(mockFilter).toBeCalledTimes(2);
    expect(mockFilter).toBeCalledWith(
      expect.objectContaining({ value: "finished" }),
      expect.anything()
    );
  });
});
