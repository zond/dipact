import React from "react";

import Component, { searchKey } from "../CreateOrderMenu";
import { useCreateOrderMenu } from "@diplicity/common";
import { fireEvent, render, screen } from "@testing-library/react";
import useSearchParams from "../../hooks/useSearchParams";

type UseCreateOrderMenuValues = ReturnType<typeof useCreateOrderMenu>;

interface ArrangeOptions {
  useCreateOrderMenuValues: UseCreateOrderMenuValues;
}

jest.mock("@diplicity/common", () => ({
  ...jest.requireActual("@diplicity/common"),
  useCreateOrderMenu: jest.fn(),
}));
jest.mock("../../hooks/useSearchParams");

const mockUseSearchParams = useSearchParams as jest.Mock;
const useCreateOrderMenuMock = useCreateOrderMenu as jest.Mock;
const mockHandleSelectOption = jest.fn();
const mockRemoveParam = jest.fn();
const mockGetParam = jest.fn();

describe("CreateOrderMenu", () => {
  let useCreateOrderMenuValues: UseCreateOrderMenuValues;
  const arrange = (options: ArrangeOptions) => {
    useCreateOrderMenuMock.mockImplementation(
      () => options.useCreateOrderMenuValues
    );
    mockUseSearchParams.mockImplementation(() => ({
      removeParam: mockRemoveParam,
      getParam: mockGetParam,
    }));
    mockGetParam.mockImplementation(() => "1");
    return render(<Component />);
  };
  beforeEach(() => {
    jest.clearAllMocks();
    useCreateOrderMenuValues = {
      options: [{ value: "ber", label: "Berlin" }],
      orderSummary: "Army Kiel will move to...",
      orderPrompt: "Select a destination",
      handleSelectOption: mockHandleSelectOption,
    };
  });
  test("Renders without error", () => {
    arrange({ useCreateOrderMenuValues });
  });
  test("Close button calls removeParam", () => {
    arrange({ useCreateOrderMenuValues });
    const submitButton = screen.getByText("Close");
    fireEvent.click(submitButton);
    expect(mockRemoveParam).toBeCalledWith(searchKey);
  });
});
