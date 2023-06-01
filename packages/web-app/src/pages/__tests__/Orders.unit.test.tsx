import React from "react";

import Orders from "../Orders";
import {
  NationStatusDisplay,
  translateKeys as tk,
  useOrders,
} from "@diplicity/common";
import { fireEvent, render, screen } from "@testing-library/react";
import PhaseSelector from "../../components/PhaseSelector";
import NationSummary from "../../components/NationSummary";
import Order from "../../components/Order";
import { useParams } from "react-router-dom";

type UseOrdersValues = Partial<ReturnType<typeof useOrders>>;

interface ArrangeOptions {
  useOrdersValues: UseOrdersValues;
}

jest.mock("../../components/PhaseSelector");
jest.mock("../../components/NationSummary");
jest.mock("../../components/Order");
jest.mock("@diplicity/common", () => ({
  ...jest.requireActual("@diplicity/common"),
  useOrders: jest.fn(),
}));
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
}));

let useOrdersValues: UseOrdersValues;

const mockPhaseSelector = PhaseSelector as jest.Mock;
const mockNationSummary = NationSummary as jest.Mock;
const mockOrder = Order as jest.Mock;
const mockUseOrders = useOrders as jest.Mock;
const mockUseParams = useParams as jest.Mock;

const mockToggleAcceptDraw = jest.fn();
const mockToggleConfirmOrders = jest.fn();

const gameId = "gameId";
let nationStatus: NationStatusDisplay;

describe("Orders", () => {
  const arrange = (options: ArrangeOptions) => {
    mockUseOrders.mockImplementation(() => options.useOrdersValues);
    mockUseParams.mockImplementation(() => ({ gameId }));
    return render(<Orders />);
  };
  beforeEach(() => {
    jest.clearAllMocks();
    mockPhaseSelector.mockImplementation(() => <div>GameCard</div>);
    mockNationSummary.mockImplementation(() => <div>NationSummary</div>);
    mockOrder.mockImplementation(() => <div>Order</div>);

    nationStatus = {
      nation: { name: "England", isUser: false },
      orders: [],
      homelessInconsistencies: [],
    } as unknown as NationStatusDisplay;

    useOrdersValues = {
      nationStatuses: [nationStatus],
      error: null,
      isCurrentPhase: true,
      isLoading: false,
      isError: false,
      noOrders: false,
      ordersConfirmed: false,
      phaseStateIsLoading: false,
      toggleAcceptDraw: mockToggleAcceptDraw,
      toggleConfirmOrders: mockToggleConfirmOrders,
      userIsMember: false,
    };
  });
  test("Renders without error", () => {
    arrange({ useOrdersValues });
  });
  test("Shows error if isError", () => {
    useOrdersValues.isError = true;
    useOrdersValues.error = { status: 500 };
    arrange({ useOrdersValues });
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });
  test("Shows loading if isLoading", () => {
    useOrdersValues.isLoading = true;
    arrange({ useOrdersValues });
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });
  test("Renders phase selector", () => {
    arrange({ useOrdersValues });
    expect(mockPhaseSelector).toBeCalled();
  });
  test("Renders nation summary", () => {
    arrange({ useOrdersValues });
    expect(mockNationSummary).toBeCalledWith({ nationStatus }, {});
  });
  test("Hides draw checkbox when not user", () => {
    arrange({ useOrdersValues });
    expect(
      screen.queryByLabelText(tk.orders.toggleDiasButton.label)
    ).not.toBeInTheDocument();
  });
  test("Hides draw checkbox if not isCurrentPhase", () => {
    useOrdersValues.isCurrentPhase = false;
    arrange({ useOrdersValues });
    expect(
      screen.queryByLabelText(tk.orders.toggleDiasButton.label)
    ).not.toBeInTheDocument();
  });
  test("Shows draw checkbox when user", () => {
    nationStatus.nation.isUser = true;
    useOrdersValues = { ...useOrdersValues, nationStatuses: [nationStatus] };
    arrange({ useOrdersValues });
    expect(
      screen.getByLabelText(tk.orders.toggleDiasButton.label)
    ).toBeInTheDocument();
  });
  test("Checkbox not checked when not wants draw", () => {
    nationStatus.nation.isUser = true;
    nationStatus.wantsDraw = false;
    useOrdersValues = { ...useOrdersValues, nationStatuses: [nationStatus] };
    arrange({ useOrdersValues });
    const checkbox = screen.getByLabelText(
      tk.orders.toggleDiasButton.label
    ) as HTMLInputElement;
    expect(checkbox.checked).toBe(false);
  });
  test("Checkbox is checked when wants draw", () => {
    nationStatus.nation.isUser = true;
    nationStatus.wantsDraw = true;
    useOrdersValues = { ...useOrdersValues, nationStatuses: [nationStatus] };
    arrange({ useOrdersValues });
    const checkbox = screen.getByLabelText(
      tk.orders.toggleDiasButton.label
    ) as HTMLInputElement;
    expect(checkbox.checked).toBe(true);
  });
  test("Checkbox enabled when not phaseStateIsLoading", () => {
    nationStatus.nation.isUser = true;
    useOrdersValues = { ...useOrdersValues, nationStatuses: [nationStatus] };
    arrange({ useOrdersValues });
    const checkbox = screen.getByLabelText(
      tk.orders.toggleDiasButton.label
    ) as HTMLInputElement;
    expect(checkbox).not.toBeDisabled();
  });
  test("Checkbox is disabled when phaseStateIsLoading", () => {
    nationStatus.nation.isUser = true;
    useOrdersValues = {
      ...useOrdersValues,
      nationStatuses: [nationStatus],
      phaseStateIsLoading: true,
    };
    arrange({ useOrdersValues });
    const checkbox = screen.getByLabelText(
      tk.orders.toggleDiasButton.label
    ) as HTMLInputElement;
    expect(checkbox).toBeDisabled();
  });
  test("Renders order", () => {
    const order = { label: "", resolution: null, inconsistencies: [] };
    nationStatus.orders = [order];
    arrange({ useOrdersValues });
    expect(mockOrder).toBeCalledWith({ order }, {});
  });
  test("Renders homelessInconsistency", () => {
    const inconsistency = "Inconsistency";
    useOrdersValues.nationStatuses = [
      { ...nationStatus, homelessInconsistencies: [inconsistency] },
    ];
    arrange({ useOrdersValues });
    expect(screen.getByText(inconsistency)).toBeInTheDocument();
  });
  test("Hides confirm orders button if not userIsMember", () => {
    useOrdersValues.userIsMember = false;
    arrange({ useOrdersValues });
    expect(
      screen.queryByTitle(tk.orders.confirmOrdersButton.label)
    ).not.toBeInTheDocument();
  });
  test("Hides confirm orders button if not isCurrentPhase", () => {
    useOrdersValues.isCurrentPhase = false;
    arrange({ useOrdersValues });
    expect(
      screen.queryByTitle(tk.orders.confirmOrdersButton.label)
    ).not.toBeInTheDocument();
  });
  test("Shows confirm orders button if userIsMember", () => {
    useOrdersValues.userIsMember = true;
    useOrdersValues.isCurrentPhase = true;
    arrange({ useOrdersValues });
    expect(
      screen.getByTitle(tk.orders.confirmOrdersButton.label)
    ).toBeInTheDocument();
  });
  test("Button is unchecked if not noOrders and not ordersConfirmed", () => {
    useOrdersValues.userIsMember = true;
    useOrdersValues.noOrders = false;
    useOrdersValues.ordersConfirmed = false;
    arrange({ useOrdersValues });
    expect(screen.getByTestId("confirm-orders-unchecked")).toBeInTheDocument();
  });
  test("Button is checked if ordersConfirmed", () => {
    useOrdersValues.userIsMember = true;
    useOrdersValues.noOrders = false;
    useOrdersValues.ordersConfirmed = true;
    arrange({ useOrdersValues });
    expect(screen.getByTestId("confirm-orders-checked")).toBeInTheDocument();
  });
  test("Button is checked if noOrders", () => {
    useOrdersValues.userIsMember = true;
    useOrdersValues.noOrders = true;
    useOrdersValues.ordersConfirmed = false;
    arrange({ useOrdersValues });
    expect(screen.getByTestId("confirm-orders-checked")).toBeInTheDocument();
  });
  test("Shows normal prompt if not noOrders", () => {
    useOrdersValues.userIsMember = true;
    useOrdersValues.noOrders = false;
    useOrdersValues.ordersConfirmed = false;
    arrange({ useOrdersValues });
    expect(
      screen.getByText(tk.orders.confirmOrdersButton.prompt)
    ).toBeInTheDocument();
  });
  test("Shows noOrders prompt if noOrders", () => {
    useOrdersValues.userIsMember = true;
    useOrdersValues.noOrders = true;
    useOrdersValues.ordersConfirmed = false;
    arrange({ useOrdersValues });
    expect(
      screen.getByText(tk.orders.confirmOrdersButton.noOrders)
    ).toBeInTheDocument();
  });
  test("Click confirmOrdersButton calls toggle confirm orders", () => {
    useOrdersValues.userIsMember = true;
    useOrdersValues.isCurrentPhase = true;
    arrange({ useOrdersValues });
    fireEvent.click(screen.getByTitle(tk.orders.confirmOrdersButton.label));
    expect(mockToggleConfirmOrders).toBeCalled();
  });
  test("Button is disabled if phaseStateIsLoading", () => {
    useOrdersValues.userIsMember = true;
    useOrdersValues.phaseStateIsLoading = true;
    arrange({ useOrdersValues });
    const button = screen.getByTitle(tk.orders.confirmOrdersButton.label);
    expect(button).toBeDisabled();
  });
  test("Button is disabled if noOrders", () => {
    useOrdersValues.userIsMember = true;
    useOrdersValues.noOrders = true;
    arrange({ useOrdersValues });
    const button = screen.getByTitle(tk.orders.confirmOrdersButton.label);
    expect(button).toBeDisabled();
  });
});
