import React from "react";
import { render, RenderAPI } from "@testing-library/react-native";
import BottomSheetButton from "../BottomSheetButton";

let screen: RenderAPI;

describe("BottomSheetButton", () => {
  test("Renders without error", () => {
    screen = render(<BottomSheetButton />);
    expect(screen).toBeTruthy();
  });
});
