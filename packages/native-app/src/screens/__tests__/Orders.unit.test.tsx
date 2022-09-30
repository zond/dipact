import "react-native";
import React from "react";
import { fireEvent, render } from "@testing-library/react-native";

import Component from "../Orders";
import {
  NationStatusDisplay,
  useOrders,
  translateKeys as tk,
} from "@diplicity/common";
import NationOrders from "../../components/NationOrders";
import PhaseSelector from "../../components/PhaseSelector";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import * as Button from "../../components/Button";
import { Text } from "react-native";
import { act } from "react-test-renderer";

type UseOrdersValues = ReturnType<typeof useOrders>;

interface ArrangeOptions {
  props: Parameters<typeof Component>[0];
  useOrdersValues: UseOrdersValues;
}

jest.mock("@diplicity/common", () => ({
  ...jest.requireActual("@diplicity/common"),
  useOrders: jest.fn(),
}));

jest.mock("../../components/NationOrders");
jest.mock("../../components/PhaseSelector");
jest.mock("../../components/Loading");
jest.mock("../../components/ErrorMessage");

const buttonSpy = jest.spyOn(Button, "default");

const mockNationOrders = NationOrders as jest.Mock;
const mockPhaseSelector = PhaseSelector as jest.Mock;
const mockLoading = Loading as jest.Mock;
const mockErrorMessage = ErrorMessage as jest.Mock;

let props: Parameters<typeof Component>[0];
let useOrdersValues: UseOrdersValues;
const useOrdersMock = useOrders as jest.Mock;

const mockToggleAcceptDraw = jest.fn();
const mockToggleConfirmOrders = jest.fn();

const gameId = "123";

describe("Orders", () => {
  const arrange = (options: ArrangeOptions) => {
    mockNationOrders.mockImplementation(() => <Text>NationOrders</Text>);
    mockPhaseSelector.mockImplementation(() => <Text>PhaseSelector</Text>);
    mockLoading.mockImplementation(() => <Text>Loading</Text>);
    mockErrorMessage.mockImplementation(() => <Text>ErrorMessage</Text>);
    useOrdersMock.mockImplementation(() => options.useOrdersValues);
    return render(<Component {...options.props} />);
  };
  beforeEach(() => {
    props = { gameId };
    useOrdersValues = {
      isLoading: false,
      isError: false,
      isFetching: false,
      error: null,
      nationStatuses: [{ nation: { name: "England" } } as NationStatusDisplay],
      noOrders: false,
      ordersConfirmed: false,
      phaseStateIsLoading: false,
      isCurrentPhase: false,
      toggleAcceptDraw: mockToggleAcceptDraw,
      toggleConfirmOrders: mockToggleConfirmOrders,
      userIsMember: false,
    };
    jest.clearAllMocks();
  });
  test("Renders without error", () => {
    arrange({ props, useOrdersValues });
  });
  test("Renders PhaseSelector", () => {
    arrange({ props, useOrdersValues });
    expect(mockPhaseSelector).toBeCalledWith({ gameId }, {});
  });
  test("Shows loading if loading", () => {
    useOrdersValues.isLoading = true;
    arrange({ props, useOrdersValues });
    expect(mockLoading).toBeCalledWith({ size: "large" }, {});
  });
  test("Shows loading if fetching", () => {
    useOrdersValues.isFetching = true;
    arrange({ props, useOrdersValues });
    expect(mockLoading).toBeCalledWith({}, {});
  });
  test("Shows error if error", () => {
    useOrdersValues.isError = true;
    useOrdersValues.error = { status: 500 };
    arrange({ props, useOrdersValues });
    expect(mockErrorMessage).toBeCalledWith(
      { error: useOrdersValues.error },
      {}
    );
  });
  test("Renders NationOrders for every nationStatus", () => {
    arrange({ props, useOrdersValues });
    expect(mockNationOrders).toBeCalledWith(
      { nationStatus: useOrdersValues.nationStatuses[0] },
      {}
    );
  });
  test("Hides ordersConfirmed button if not userIsMember", () => {
    useOrdersValues.userIsMember = false;
    useOrdersValues.isCurrentPhase = true;
    const { queryByLabelText } = arrange({ props, useOrdersValues });
    expect(queryByLabelText(tk.orders.confirmOrdersButton.label)).toBeNull();
  });
  test("Hides ordersConfirmed button if not isCurrentPhase", () => {
    useOrdersValues.isCurrentPhase = false;
    useOrdersValues.userIsMember = true;
    const { queryByLabelText } = arrange({ props, useOrdersValues });
    expect(queryByLabelText(tk.orders.confirmOrdersButton.label)).toBeNull();
  });
  test("Shows ordersConfirmed button if userIsMember and isCurrentPhase", () => {
    useOrdersValues.isCurrentPhase = true;
    useOrdersValues.userIsMember = true;
    const { queryByLabelText } = arrange({ props, useOrdersValues });
    expect(
      queryByLabelText(tk.orders.confirmOrdersButton.label)
    ).not.toBeNull();
  });
  test("Shows checkbox icon if ordersConfirmed", () => {
    useOrdersValues.isCurrentPhase = true;
    useOrdersValues.userIsMember = true;
    useOrdersValues.ordersConfirmed = true;
    arrange({ props, useOrdersValues });
    expect(buttonSpy).toBeCalledWith(
      {
        title: expect.any(String),
        accessibilityLabel: expect.any(String),
        iconProps: {
          type: "material-ui",
          name: "check-box",
          size: expect.any(Number),
        },
        containerStyle: expect.any(Object),
        buttonStyle: expect.any(Object),
        onPress: expect.any(Function),
        disabled: false,
      },
      {}
    );
  });
  test("Shows checkbox empty icon if not ordersConfirmed", () => {
    useOrdersValues.isCurrentPhase = true;
    useOrdersValues.userIsMember = true;
    useOrdersValues.ordersConfirmed = false;
    arrange({ props, useOrdersValues });
    expect(buttonSpy).toBeCalledWith(
      {
        title: expect.any(String),
        accessibilityLabel: expect.any(String),
        iconProps: {
          type: "material-ui",
          name: "check-box-outline-blank",
          size: expect.any(Number),
        },
        containerStyle: expect.any(Object),
        buttonStyle: expect.any(Object),
        onPress: expect.any(Function),
        disabled: false,
      },
      {}
    );
  });
  test("Pressing ordersConfirmed button calls toggleConfirmOrders", () => {
    useOrdersValues.isCurrentPhase = true;
    useOrdersValues.userIsMember = true;
    const { getByLabelText } = arrange({ props, useOrdersValues });
    fireEvent.press(getByLabelText(tk.orders.confirmOrdersButton.label));
    expect(mockToggleConfirmOrders).toBeCalled();
  });
  test("Confirm orders button disabled if phaseStateIsLoading", () => {
    useOrdersValues.isCurrentPhase = true;
    useOrdersValues.userIsMember = true;
    useOrdersValues.phaseStateIsLoading = true;
    const { getByLabelText } = arrange({ props, useOrdersValues });
    expect(
      getByLabelText(tk.orders.confirmOrdersButton.label).props
        .accessibilityState.disabled
    ).toBeTruthy();
  });
  test("Confirm orders button disabled if noOrders", () => {
    useOrdersValues.isCurrentPhase = true;
    useOrdersValues.userIsMember = true;
    useOrdersValues.noOrders = true;
    const { getByLabelText } = arrange({ props, useOrdersValues });
    expect(
      getByLabelText(tk.orders.confirmOrdersButton.label).props
        .accessibilityState.disabled
    ).toBeTruthy();
  });
  test("Hides moreOptions button if not userIsMember", () => {
    useOrdersValues.isCurrentPhase = true;
    useOrdersValues.userIsMember = false;
    const { queryByLabelText } = arrange({ props, useOrdersValues });
    expect(queryByLabelText("more options")).toBeNull();
  });
  test("Hides moreOptions button if not isCurrentPhase", () => {
    useOrdersValues.isCurrentPhase = false;
    useOrdersValues.userIsMember = true;
    const { queryByLabelText } = arrange({ props, useOrdersValues });
    expect(queryByLabelText("more options")).toBeNull();
  });
  test("Shows moreOptions button if userIsMember and isCurrentPhase", () => {
    useOrdersValues.isCurrentPhase = true;
    useOrdersValues.userIsMember = true;
    const { queryByLabelText } = arrange({ props, useOrdersValues });
    expect(queryByLabelText("more options")).not.toBeNull();
  });
  test("Dialog hidden by default", () => {
    useOrdersValues.isCurrentPhase = true;
    useOrdersValues.userIsMember = true;
    const { queryByLabelText } = arrange({
      props,
      useOrdersValues,
    });
    expect(queryByLabelText(tk.orders.toggleDiasButton.label)).toBeNull();
  });
  test("Pressing moreOptions button shows dialog", () => {
    useOrdersValues.isCurrentPhase = true;
    useOrdersValues.userIsMember = true;
    const { getByLabelText, queryByLabelText } = arrange({
      props,
      useOrdersValues,
    });
    act(() => {
      fireEvent.press(getByLabelText("more options"));
    });
    expect(queryByLabelText(tk.orders.toggleDiasButton.label)).not.toBeNull();
  });
  test("Pressing draw button calls toggleAcceptDraw", () => {
    useOrdersValues.isCurrentPhase = true;
    useOrdersValues.userIsMember = true;
    const { getByLabelText } = arrange({
      props,
      useOrdersValues,
    });
    act(() => {
      fireEvent.press(getByLabelText("more options"));
    });
    fireEvent.press(getByLabelText(tk.orders.toggleDiasButton.label));
    expect(mockToggleAcceptDraw).toBeCalled();
  });
  test("Draw button disabled if phaseStateIsLoading", () => {
    useOrdersValues.isCurrentPhase = true;
    useOrdersValues.userIsMember = true;
    useOrdersValues.phaseStateIsLoading = true;
    const { getByLabelText } = arrange({
      props,
      useOrdersValues,
    });
    act(() => {
      fireEvent.press(getByLabelText("more options"));
    });
    expect(
      getByLabelText(tk.orders.toggleDiasButton.label).props.accessibilityState
        .disabled
    ).toBeTruthy();
  });
  test("Pressing backdrop hides dialog", () => {
    useOrdersValues.isCurrentPhase = true;
    useOrdersValues.userIsMember = true;
    const { getByLabelText, getByTestId, queryByLabelText } = arrange({
      props,
      useOrdersValues,
    });
    act(() => {
      fireEvent.press(getByLabelText("more options"));
    });
    act(() => {
      fireEvent.press(getByTestId("RNE__Overlay__backdrop"));
    });
    expect(queryByLabelText(tk.orders.toggleDiasButton.label)).toBeNull();
  });
});
