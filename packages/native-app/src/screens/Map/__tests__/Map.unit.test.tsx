import React from "react";
import ImageZoom from "react-native-image-pan-zoom";
import { fireEvent, render } from "@testing-library/react-native";

import Sut from "../Map";

const gameId = "gameId";

jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
}));

jest.mock("@diplicity/common", () => ({
  phaseSelectors: {
    selectPhase: jest.fn(),
  },
}));

jest.mock("../../../components/MapComponent", () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => null),
}));

const mockImageZoom = ImageZoom as unknown as jest.Mock;

describe("Map", () => {
  const renderSut = () => render(<Sut gameId={gameId} />);
  test("Renders without error", () => {
    renderSut();
  });

  test("Layout event sets width and height", () => {
    const screen = renderSut();
    fireEvent(screen.getByTestId("MAP_CONTAINER"), "layout", {
      nativeEvent: { layout: { height: 100, width: 100 } },
    });
    expect(mockImageZoom).toBeCalledWith(
      expect.objectContaining({ cropHeight: 100, cropWidth: 100 }),
      {}
    );
  });
});
