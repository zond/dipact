import "react-native";
import React from "react";
import { render } from "@testing-library/react-native";

import Button from "../Button";

interface ArrangeOptions {
  props: Parameters<typeof Button>[0];
}

let props: Parameters<typeof Button>[0];

describe("Button", () => {
  const arrange = (options: ArrangeOptions) => {
    return render(<Button {...options.props} />);
  };
  beforeEach(() => {
    props = {};
  });
  test("Renders without error", () => {
    arrange({ props });
  });
});
