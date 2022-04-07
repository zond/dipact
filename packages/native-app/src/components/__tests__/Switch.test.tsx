import "react-native";
import React from "react";
import { fireEvent, render } from "@testing-library/react-native";

import Switch from "../Switch";

const WrappedSwitch = (props: Parameters<typeof Switch>[0]) => {
  return <Switch {...props} />;
};

describe("Functional tests", () => {
  let props: Parameters<typeof Switch>[0];
  beforeEach(() => {
    props = { value: false, onValueChange: jest.fn() };
  });
  test("Click when false", () => {
    const { getByTestId } = render(<WrappedSwitch {...props} />);
    const _switch = getByTestId("switch");
    fireEvent(_switch, "valueChange", true);
    expect(props.onValueChange).toBeCalledWith(true);
  });
  test("Click when true", () => {
    const { getByTestId } = render(<WrappedSwitch {...props} />);
    const _switch = getByTestId("switch");
    fireEvent(_switch, "valueChange", false);
    expect(props.onValueChange).toBeCalledWith(false);
  });
  test("Shows label", () => {
    props.label = "Switch label";
    const { getByText } = render(<WrappedSwitch {...props} />);
    getByText(props.label);
  });
  test("Renders when value is false", () => {
    render(<WrappedSwitch {...props} value={false} />);
  });
  test("Renders when value is true", () => {
    render(<WrappedSwitch {...props} value={true} />);
  });
});
