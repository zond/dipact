import "react-native";
import React from "react";
import { render } from "@testing-library/react-native";

import ErrorMessage from "../ErrorMessage";

interface ArrangeOptions {
  props: Parameters<typeof ErrorMessage>[0];
}

let props: Parameters<typeof ErrorMessage>[0];

describe("ErrorMessage", () => {
  const arrange = (options: ArrangeOptions) => {
    return render(<ErrorMessage {...options.props} />);
  };
  beforeEach(() => {
    props = { error: { status: 500 } };
  });
  test("Renders without error", () => {
    arrange({ props });
  });
  test("Shows message for 500", () => {
    const { getByText } = arrange({ props });
    expect(getByText("Internal server error (500)")).toBeTruthy();
  });
  test("Shows message for 401", () => {
    props.error.status = 401;

    const { getByText } = arrange({ props });
    expect(getByText("Unauthorized (401)")).toBeTruthy();
  });
  test("Shows no messge for other code", () => {
    props.error.status = 405;
    const { getByText } = arrange({ props });
    expect(getByText("(405)")).toBeTruthy();
  });
});
