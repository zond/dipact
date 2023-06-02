import "react-native";
import React from "react";
import { render } from "@testing-library/react-native";

import Component from "../Order";
import { OrderDisplay, translateKeys as tk } from "@diplicity/common";

interface ArrangeOptions {
  props: Parameters<typeof Component>[0];
}

let props: Parameters<typeof Component>[0];
let order: OrderDisplay;

describe("Order", () => {
  const arrange = (options: ArrangeOptions) => {
    return render(<Component {...options.props} />);
  };
  beforeEach(() => {
    order = {
      label: "Kiel move Berlin",
      resolution: {
        message: tk.orders.resolution.success,
      },
      inconsistencies: [],
    };
    props = { order };
  });
  test("Renders without error", () => {
    arrange({ props });
  });
  test("Shows resolution message if resolution", () => {
    const { getByText } = arrange({ props });
    expect(getByText(tk.orders.resolution.success)).toBeTruthy();
  });
  test("Does not show resolution message if no resolution", () => {
    order.resolution = null;
    const { queryByText } = arrange({ props: { order: order } });
    expect(queryByText(tk.orders.resolution.success)).toBeNull();
  });
});
