import React from "react";

import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import Order from "../Order";
import { OrderDisplay, translateKeys as tk } from "@diplicity/common";

interface ArrangeOptions {
  props: Parameters<typeof Order>[0];
}

let props: ArrangeOptions["props"];

jest.mock("../NationAvatar.new", () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe("Order", () => {
  const arrange = (options: ArrangeOptions) => {
    return render(<Order {...options.props} />);
  };
  beforeEach(() => {
    const defaultOrder: OrderDisplay = {
      label: "Label",
      inconsistencies: [],
      resolution: null,
    };
    props = {
      order: defaultOrder,
    };
    jest.clearAllMocks();
  });
  test("Renders without error", () => {
    arrange({ props });
  });
  test("Shows label", () => {
    arrange({ props });
    expect(screen.getByText(props.order.label)).toBeInTheDocument();
  });
  test("Shows resolution if resolution", () => {
    const resolution = { message: tk.orders.resolution.success };
    props = { order: { ...props.order, resolution } };
    arrange({ props });
    expect(screen.getByText(resolution.message)).toBeInTheDocument();
  });
  test("Shows inconsistencies if inconsistencies", () => {
    const inconsistency = "Inconsistency";
    props = { order: { ...props.order, inconsistencies: [inconsistency] } };
    arrange({ props });
    expect(screen.getByText(inconsistency)).toBeInTheDocument();
  });
});
