import React from "react";

import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import NationSummary from "../NationSummary";
import { NationDisplay, NationStatusDisplay } from "@diplicity/common";
import NationAvatar from "../NationAvatar.new";
import { translateKeys as tk } from "@diplicity/common";

interface ArrangeOptions {
  props: Parameters<typeof NationSummary>[0];
}

let props: ArrangeOptions["props"];

jest.mock("../NationAvatar.new", () => ({
  __esModule: true,
  default: jest.fn(),
}));

const mockNationAvatar = NationAvatar as jest.Mock;

describe("NationSummary", () => {
  const arrange = (options: ArrangeOptions) => {
    mockNationAvatar.mockImplementation(() => <div></div>);
    return render(<NationSummary {...options.props} />);
  };
  beforeEach(() => {
    const defaultNation: NationDisplay = {
      name: "England",
      abbreviation: "en",
      color: "#000000",
      flagLink: "",
      isUser: false,
    };

    const defaultNationStatus: Partial<NationStatusDisplay> = {
      confirmedOrders: false,
      nation: defaultNation,
      numSupplyCenters: 3,
      numSupplyCentersToWin: 18,
      wantsDraw: false,
      noOrdersGiven: false,
      numBuilds: null,
      numDisbands: null,
    };

    props = {
      nationStatus: defaultNationStatus as NationStatusDisplay,
    };
    jest.clearAllMocks();
  });
  test("Renders without error", () => {
    arrange({ props });
  });
  test("Passes props to NationAvatar", () => {
    arrange({ props });
    expect(mockNationAvatar).toBeCalledWith(
      {
        color: props.nationStatus.nation.color,
        link: props.nationStatus.nation.flagLink,
        nation: props.nationStatus.nation.name,
        nationAbbreviation: props.nationStatus.nation.abbreviation,
      },
      {}
    );
  });
  test("Does not show supplyCentersToWinLabel if not user", () => {
    props = {
      nationStatus: {
        ...props.nationStatus,
        nation: { ...props.nationStatus.nation, isUser: false },
      },
    };
    arrange({ props });
    expect(screen.queryByText("(18 to win)")).not.toBeInTheDocument();
  });
  test("Shows supplyCentersToWinLabel if user", () => {
    props = {
      nationStatus: {
        ...props.nationStatus,
        nation: { ...props.nationStatus.nation, isUser: true },
      },
    };
    arrange({ props });
    expect(screen.getByText("(18 to win)")).toBeInTheDocument();
  });
  test("Shows correct label when numSupplyCenters singular", () => {
    props = { nationStatus: { ...props.nationStatus, numSupplyCenters: 1 } };
    arrange({ props });
    expect(
      screen.getByText(tk.orders.supplyCenterCount.singular)
    ).toBeInTheDocument();
  });
  test("Shows correct label when numSupplyCenters plural", () => {
    props = { nationStatus: { ...props.nationStatus, numSupplyCenters: 2 } };
    arrange({ props });
    expect(
      screen.getByText(tk.orders.supplyCenterCount.plural)
    ).toBeInTheDocument();
  });
  test("Shows correct label when numBuild singular", () => {
    props = { nationStatus: { ...props.nationStatus, numBuilds: 1 } };
    arrange({ props });
    expect(screen.getByText(tk.orders.buildCount.singular)).toBeInTheDocument();
  });
  test("Shows correct label when numBuild plural", () => {
    props = { nationStatus: { ...props.nationStatus, numBuilds: 2 } };
    arrange({ props });
    expect(screen.getByText(tk.orders.buildCount.plural)).toBeInTheDocument();
  });
  test("Shows correct label when numDisband singular", () => {
    props = { nationStatus: { ...props.nationStatus, numDisbands: 1 } };
    arrange({ props });
    expect(
      screen.getByText(tk.orders.disbandCount.singular)
    ).toBeInTheDocument();
  });
  test("Shows correct label when numDisband plural", () => {
    props = { nationStatus: { ...props.nationStatus, numDisbands: 2 } };
    arrange({ props });
    expect(screen.getByText(tk.orders.disbandCount.plural)).toBeInTheDocument();
  });
  test("Hides icon if not confirmedOrders", () => {
    props = { nationStatus: { ...props.nationStatus, confirmedOrders: false } };
    arrange({ props });
    expect(
      screen.queryByTitle(tk.orders.confirmedIconTooltip)
    ).not.toBeInTheDocument();
  });
  test("Shows icon if confirmedOrders", () => {
    props = { nationStatus: { ...props.nationStatus, confirmedOrders: true } };
    arrange({ props });
    expect(
      screen.getByTitle(tk.orders.confirmedIconTooltip)
    ).toBeInTheDocument();
  });
  test("Hides icon if not wantsDraw", () => {
    props = { nationStatus: { ...props.nationStatus, wantsDraw: false } };
    arrange({ props });
    expect(
      screen.queryByTitle(tk.orders.wantsDrawIconTooltip)
    ).not.toBeInTheDocument();
  });
  test("Shows icon if wantsDraw", () => {
    props = { nationStatus: { ...props.nationStatus, wantsDraw: true } };
    arrange({ props });
    expect(
      screen.getByTitle(tk.orders.wantsDrawIconTooltip)
    ).toBeInTheDocument();
  });
  test("Hides icon if not noOrdersGiven", () => {
    props = { nationStatus: { ...props.nationStatus, noOrdersGiven: false } };
    arrange({ props });
    expect(
      screen.queryByTitle(tk.orders.noOrdersGivenIconTooltip)
    ).not.toBeInTheDocument();
  });
  test("Shows icon if noOrdersGiven", () => {
    props = { nationStatus: { ...props.nationStatus, noOrdersGiven: true } };
    arrange({ props });
    expect(
      screen.getByTitle(tk.orders.noOrdersGivenIconTooltip)
    ).toBeInTheDocument();
  });
});
