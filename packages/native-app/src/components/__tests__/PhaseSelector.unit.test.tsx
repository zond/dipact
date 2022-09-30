import "react-native";
import React from "react";
import { fireEvent, render } from "@testing-library/react-native";

import Component from "../PhaseSelector";
import { translateKeys as tk, usePhaseSelector } from "@diplicity/common";

type UsePhaseSelectorValues = Partial<ReturnType<typeof usePhaseSelector>>;
interface ArrangeOptions {
  props: Parameters<typeof Component>[0];
  usePhaseSelectorValues: UsePhaseSelectorValues;
}

let props: Parameters<typeof Component>[0];
let usePhaseSelectorValues: UsePhaseSelectorValues;
const gameId = "123";

jest.mock("@diplicity/common", () => ({
  ...jest.requireActual("@diplicity/common"),
  usePhaseSelector: jest.fn(),
}));

const mockUsePhaseSelector = usePhaseSelector as jest.Mock;
const mockSetPhase = jest.fn();
const mockSetNextPhase = jest.fn();
const mockSetPreviousPhase = jest.fn();

describe("PhaseSelector", () => {
  const arrange = (options: ArrangeOptions) => {
    mockUsePhaseSelector.mockImplementation(
      () => options.usePhaseSelectorValues
    );
    return render(<Component {...options.props} />);
  };
  beforeEach(() => {
    props = { gameId };
    usePhaseSelectorValues = {
      phases: [
        [1, "Spring 1901, Movement"],
        [2, "Spring 1901, Retreat"],
      ],
      setPhase: mockSetPhase,
      setNextPhase: mockSetNextPhase,
      setPreviousPhase: mockSetPreviousPhase,
      selectedPhase: 1,
      isLoading: false,
      isError: false,
      error: null,
    };
  });
  test("Renders without error", () => {
    arrange({ props, usePhaseSelectorValues });
  });
  test("Renders nothing if isLoading", () => {
    usePhaseSelectorValues.isLoading = true;
    const { queryByLabelText } = arrange({ props, usePhaseSelectorValues });
    expect(queryByLabelText(tk.phaseSelector.previousButton.title)).toBe(null);
  });
  test("Renders nothing if isError", () => {
    usePhaseSelectorValues.isError = true;
    const { queryByLabelText } = arrange({ props, usePhaseSelectorValues });
    expect(queryByLabelText(tk.phaseSelector.previousButton.title)).toBe(null);
  });
  test("Renders nothing if not phases", () => {
    usePhaseSelectorValues.phases = undefined;
    const { queryByLabelText } = arrange({ props, usePhaseSelectorValues });
    expect(queryByLabelText(tk.phaseSelector.previousButton.title)).toBe(null);
  });
  test("When no next phase next button is disabled", async () => {
    usePhaseSelectorValues.selectedPhase = 2;
    const { getByLabelText } = arrange({ props, usePhaseSelectorValues });
    expect(
      getByLabelText(tk.phaseSelector.nextButton.title).props.accessibilityState
        .disabled
    ).toBe(true);
  });
  test("When no previous phase previous button is disabled", async () => {
    usePhaseSelectorValues.selectedPhase = 1;
    const { getByLabelText } = arrange({ props, usePhaseSelectorValues });
    expect(
      getByLabelText(tk.phaseSelector.previousButton.title).props
        .accessibilityState.disabled
    ).toBe(true);
  });
  test("Clicking next calls setNextPhase", async () => {
    usePhaseSelectorValues.selectedPhase = 1;
    const { getByLabelText } = arrange({ props, usePhaseSelectorValues });
    fireEvent.press(getByLabelText(tk.phaseSelector.nextButton.title));
    expect(mockSetNextPhase).toBeCalled();
  });
  test("Clicking previous calls setPreviousPhase", async () => {
    usePhaseSelectorValues.selectedPhase = 2;
    const { getByLabelText } = arrange({ props, usePhaseSelectorValues });
    fireEvent.press(getByLabelText(tk.phaseSelector.previousButton.title));
    expect(mockSetPreviousPhase).toBeCalled();
  });
  test("Clicking select option calls setPhase", async () => {
    const { getByTestId } = arrange({ props, usePhaseSelectorValues });
    const picker = getByTestId("phase-select");
    fireEvent(picker, "onValueChange", 1);
    expect(mockSetPhase).toBeCalledWith(1);
  });
});
