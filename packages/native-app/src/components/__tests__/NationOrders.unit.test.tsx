import "react-native";
import React from "react";
import { act, fireEvent, render } from "@testing-library/react-native";

import NationOrders from "../NationOrders";
import { OrderDisplay, NationStatusDisplay } from "diplicity-common-internal";
import Order from "../Order";
import NationSummary from "../NationSummary";
import { Text } from "react-native";

interface ArrangeOptions {
  props: Parameters<typeof NationOrders>[0];
}

let props: Parameters<typeof NationOrders>[0];

jest.mock("../Order");
jest.mock("../NationSummary");

const mockOrder = Order as jest.Mock;
const mockNationSummary = NationSummary as jest.Mock;

describe("NationOrders", () => {
  const arrange = (options: ArrangeOptions) => {
    mockOrder.mockImplementation(() => <Text>Order</Text>);
    mockNationSummary.mockImplementation(() => <Text>NationSummary</Text>);
    return render(<NationOrders {...options.props} />);
  };
  beforeEach(() => {
    props = {
      nationStatus: {
        orders: [{ label: "Label" } as OrderDisplay],
      } as NationStatusDisplay,
    };
  });
  test("Renders without error", () => {
    arrange({ props });
  });
  test("Renders NationSummary", () => {
    arrange({ props });
    expect(mockNationSummary).toBeCalledWith(
      { nationStatus: props.nationStatus },
      {}
    );
  });
  test("Renders Order", () => {
    arrange({ props });
    expect(mockOrder).toBeCalledWith(
      { order: props.nationStatus.orders[0] },
      {}
    );
  });
  test("Shows icon when orders", () => {
    const { getByTestId } = arrange({ props });
    expect(getByTestId("RNE__ListItem__Accordion__Icon")).toBeTruthy();
  });
  test("Hides icon when no orders", () => {
    props.nationStatus.orders = [];
    const { queryByTestId } = arrange({ props });
    expect(queryByTestId("RNE__ListItem__Accordion__Icon")).toBeFalsy();
  });
  test("Closes on press", () => {
    const { getByTestId, queryByText } = arrange({ props });
    const button = getByTestId("RNE__ListItem__Accordion__Icon");
    act(() => {
      fireEvent.press(button);
    });
    expect(queryByText("Order")).toBeFalsy();
  });
});
