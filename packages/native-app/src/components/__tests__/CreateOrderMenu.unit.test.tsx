import "react-native";
import React from "react";
import { fireEvent, render } from "@testing-library/react-native";

import Component from "../CreateOrderMenu";
import { useCreateOrderMenu } from "@diplicity/common";

type UseCreateOrderMenuValues = ReturnType<typeof useCreateOrderMenu>;
type ComponentProps = Parameters<typeof Component>[0];

interface ArrangeOptions {
  props: ComponentProps;
  useCreateOrderMenuValues: UseCreateOrderMenuValues;
}

jest.mock("@diplicity/common", () => ({
  ...jest.requireActual("@diplicity/common"),
  useCreateOrderMenu: jest.fn(),
}));

const useCreateOrderMenuMock = useCreateOrderMenu as jest.Mock;

const mockClose = jest.fn();
const mockHandleSelectOption = jest.fn();

describe("Map", () => {
  let props: ComponentProps;
  let useCreateOrderMenuValues: UseCreateOrderMenuValues;
  const arrange = (options: ArrangeOptions) => {
    useCreateOrderMenuMock.mockImplementation(
      () => options.useCreateOrderMenuValues
    );
    return render(<Component {...options.props} />);
  };
  beforeEach(() => {
    jest.clearAllMocks();
    props = { close: mockClose };
    useCreateOrderMenuValues = {
      options: [{ value: "ber", label: "Berlin" }],
      orderSummary: "Army Kiel will move to...",
      orderPrompt: "Select a destination",
      handleSelectOption: mockHandleSelectOption,
    };
  });
  test("Renders without error", () => {
    arrange({ props, useCreateOrderMenuValues });
  });
  test("Select option does not call handleSelectOption if not value", () => {
    const screen = arrange({ props, useCreateOrderMenuValues });
    const picker = screen.getByTestId("CREATE_ORDER_MENU_PICKER");
    fireEvent(picker, "onValueChange", undefined);
    expect(mockHandleSelectOption).not.toHaveBeenCalled();
  });
  test("Select option calls handleSelectOption if value", () => {
    const screen = arrange({ props, useCreateOrderMenuValues });
    const picker = screen.getByTestId("CREATE_ORDER_MENU_PICKER");
    const value = "ber";
    fireEvent(picker, "onValueChange", value);
    expect(mockHandleSelectOption).toHaveBeenCalledWith(value);
  });
});
