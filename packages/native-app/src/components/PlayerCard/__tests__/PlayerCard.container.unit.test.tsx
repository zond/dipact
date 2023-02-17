// Unit tests for PlayerCardContainer component

// Path: packages\native-app\src\components\PlayerCard\__tests__\PlayerCard.container.unit.test.tsx

import React from "react";
import { render } from "@testing-library/react-native";
import PlayerCardContainer from "../PlayerCard.container";
import { usePlayerDisplay } from "@diplicity/common";
import PlayerCard from "../PlayerCard";
import PlayerCardSkeleton from "../PlayerCard.skeleton";
import { View } from "react-native";

jest.mock("../PlayerCard", () => jest.fn());
jest.mock("../PlayerCard.skeleton", () => jest.fn());
jest.mock("@diplicity/common", () => ({
  usePlayerDisplay: jest.fn(),
}));

const mockUsePlayerDisplay = usePlayerDisplay as jest.Mock;
const mockPlayerCard = PlayerCard as jest.Mock;
const mockPlayerCardSkeleton = PlayerCardSkeleton as jest.Mock;
mockPlayerCard.mockImplementation(() => <View />);
mockPlayerCardSkeleton.mockImplementation(() => <View />);

const defaultProps = {
  id: "123",
  variant: "compact" as Parameters<typeof PlayerCardContainer>[0]["variant"],
};

const defaultPlayerDisplayQuery = {
  isError: false,
  isLoading: false,
  data: undefined,
};

beforeEach(() => {
  mockUsePlayerDisplay.mockClear();
  mockPlayerCard.mockClear();
  mockPlayerCardSkeleton.mockClear();
});

describe("PlayerCardContainer", () => {
  test("Returns empty element if isError", () => {
    mockUsePlayerDisplay.mockReturnValue({
      ...defaultPlayerDisplayQuery,
      isError: true,
    });
    render(<PlayerCardContainer {...defaultProps} />);
    expect(mockPlayerCard).not.toHaveBeenCalled();
    expect(mockPlayerCardSkeleton).not.toHaveBeenCalled();
  });
  test("Returns skeleton if isLoading", () => {
    mockUsePlayerDisplay.mockReturnValue({
      ...defaultPlayerDisplayQuery,
      isLoading: true,
    });
    render(<PlayerCardContainer {...defaultProps} />);
    expect(mockPlayerCard).not.toHaveBeenCalled();
    expect(mockPlayerCardSkeleton).toHaveBeenCalled();
  });
  test("Returns skeleton if no data", () => {
    mockUsePlayerDisplay.mockReturnValue({
      ...defaultPlayerDisplayQuery,
    });
    render(<PlayerCardContainer {...defaultProps} />);
    expect(mockPlayerCard).not.toHaveBeenCalled();
    expect(mockPlayerCardSkeleton).toHaveBeenCalled();
  });
  test("Returns PlayerCard if data", () => {
    mockUsePlayerDisplay.mockReturnValue({
      ...defaultPlayerDisplayQuery,
      data: {},
    });
    render(<PlayerCardContainer {...defaultProps} />);
    expect(mockPlayerCard).toHaveBeenCalled();
    expect(mockPlayerCardSkeleton).not.toHaveBeenCalled();
  });
});
