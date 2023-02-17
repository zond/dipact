import React from "react";
import { render, RenderAPI } from "@testing-library/react-native";
import BottomSheet from "../BottomSheet";
import { View } from "react-native";

let screen: RenderAPI;

describe("BottomSheet", () => {
  test("Renders children within RNEBottomSheet", () => {
    screen = render(
      <BottomSheet>
        <View testID="test-child" />
      </BottomSheet>
    );
    expect(screen.getByTestId("test-child")).toBeTruthy();
  });
});
