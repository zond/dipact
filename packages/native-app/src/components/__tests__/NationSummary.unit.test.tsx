import "react-native";
import React from "react";
import { render } from "@testing-library/react-native";

import NationSummary from "../NationSummary";
import { translateKeys as tk, NationStatusDisplay } from "../../../common";
import NationAvatar from "../NationAvatar";
import { Text } from "react-native";

interface ArrangeOptions {
  props: Parameters<typeof NationSummary>[0];
}

let props: Parameters<typeof NationSummary>[0];

jest.mock("../NationAvatar");

const mockNationAvatar = NationAvatar as jest.Mock;

describe("NationSummary", () => {
  const arrange = (options: ArrangeOptions) => {
    mockNationAvatar.mockImplementation(() => <Text>NationAvatar</Text>);
    return render(<NationSummary {...options.props} />);
  };
  beforeEach(() => {
    props = {
      nationStatus: {
        confirmedOrders: false,
        nation: {
          abbreviation: "Eng",
          flagLink: "",
          name: "England",
          isUser: false,
          color: "#00000",
        },
        numSupplyCenters: 3,
        numSupplyCentersToWin: 18,
        numBuilds: null,
        numDisbands: null,
        noOrdersGiven: false,
        wantsDraw: false,
      } as NationStatusDisplay,
    };
  });
  test("Renders without error", () => {
    arrange({ props });
  });
  test("Renders nation avatar", () => {
    const { nation } = props.nationStatus;
    arrange({ props });
    expect(mockNationAvatar).toBeCalledWith(
      {
        color: nation.color,
        nationAbbreviation: nation.abbreviation,
        nation: nation.name,
        link: nation.flagLink,
      },
      {}
    );
  });
  test("Nation label hides you label if not isUser", () => {
    props.nationStatus.nation.isUser = false;
    const { queryByText } = arrange({ props });
    expect(queryByText("England (You)")).toBeNull();
  });
  test("Nation label shows you label if isUser", () => {
    props.nationStatus.nation.isUser = true;
    const { queryByText } = arrange({ props });
    expect(queryByText("England (You)")).not.toBeNull();
  });
  test("Shows num supply centers to win if isUser", () => {
    props.nationStatus.nation.isUser = true;
    const { queryByText } = arrange({ props });
    expect(queryByText("(18 to win)")).not.toBeNull();
  });
  test("Hides num supply centers to win if not isUser", () => {
    props.nationStatus.nation.isUser = false;
    const { queryByText } = arrange({ props });
    expect(queryByText("(18 to win)")).toBeNull();
  });
  test("Shows num supply centers singular if singular", () => {
    props.nationStatus.numSupplyCenters = 1;
    const { queryByText } = arrange({ props });
    expect(queryByText(tk.orders.supplyCenterCount.singular)).not.toBeNull();
  });
  test("Shows num supply centers plural if plural", () => {
    props.nationStatus.numSupplyCenters = 3;
    const { queryByText } = arrange({ props });
    expect(queryByText(tk.orders.supplyCenterCount.plural)).not.toBeNull();
  });
  test("Hides numBuilds if is null", () => {
    props.nationStatus.numBuilds = null;
    const { queryByText } = arrange({ props });
    expect(queryByText(tk.orders.buildCount.singular)).toBeNull();
    expect(queryByText(tk.orders.buildCount.plural)).toBeNull();
  });
  test("Shows numBuilds if is number", () => {
    props.nationStatus.numBuilds = 1;
    const { queryByText } = arrange({ props });
    expect(queryByText(tk.orders.buildCount.singular)).not.toBeNull();
  });
  test("Shows numBuilds plural if plural", () => {
    props.nationStatus.numBuilds = 3;
    const { queryByText } = arrange({ props });
    expect(queryByText(tk.orders.buildCount.plural)).not.toBeNull();
  });
  test("Hides numDisbands if is null", () => {
    props.nationStatus.numDisbands = null;
    const { queryByText } = arrange({ props });
    expect(queryByText(tk.orders.disbandCount.singular)).toBeNull();
    expect(queryByText(tk.orders.disbandCount.plural)).toBeNull();
  });
  test("Shows numDisbands if is number", () => {
    props.nationStatus.numDisbands = 1;
    const { queryByText } = arrange({ props });
    expect(queryByText(tk.orders.disbandCount.singular)).not.toBeNull();
  });
  test("Shows numDisbands plural if plural", () => {
    props.nationStatus.numDisbands = 3;
    const { queryByText } = arrange({ props });
    expect(queryByText(tk.orders.disbandCount.plural)).not.toBeNull();
  });
  test("Shows no icons by default", () => {
    const { queryByTestId } = arrange({ props });
    expect(queryByTestId("RNE__ICON")).toBeNull();
  });
  test("Shows icon if confirmedOrders", () => {
    props.nationStatus.confirmedOrders = true;
    const { getByTestId } = arrange({ props });
    expect(getByTestId("RNE__ICON")).not.toBeNull();
  });
  test("Shows icon if wantsDraw", () => {
    props.nationStatus.wantsDraw = true;
    const { getByTestId } = arrange({ props });
    expect(getByTestId("RNE__ICON")).not.toBeNull();
  });
  test("Shows icon if noOrdersGiven", () => {
    props.nationStatus.noOrdersGiven = true;
    const { getByTestId } = arrange({ props });
    expect(getByTestId("RNE__ICON")).not.toBeNull();
  });
});
