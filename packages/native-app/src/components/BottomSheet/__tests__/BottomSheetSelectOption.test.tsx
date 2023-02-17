import React from "react";
import { fireEvent, render, RenderAPI } from "@testing-library/react-native";
import BottomSheetSelectOption from "../BottomSheetSelectOption";

const mockOnChange = jest.fn();

const defaultProps = {
  title: "Test",
  selected: false,
  onChange: mockOnChange,
  value: "test",
};

let screen: RenderAPI;

describe("BottomSheetSelectOption", () => {
  test("Renders without error when selected", () => {
    screen = render(
      <BottomSheetSelectOption {...defaultProps} selected={true} />
    );
    expect(screen).toBeTruthy();
  });
  test("Renders without error when not selected", () => {
    screen = render(
      <BottomSheetSelectOption {...defaultProps} selected={false} />
    );
    expect(screen).toBeTruthy();
  });
  test("Calls onChange when pressed", () => {
    screen = render(<BottomSheetSelectOption {...defaultProps} />);
    fireEvent.press(screen.getByA11yRole("button"));
    expect(mockOnChange).toHaveBeenCalledWith("test");
  });
});
