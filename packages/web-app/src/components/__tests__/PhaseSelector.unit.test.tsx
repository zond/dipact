import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import PhaseSelector from "../PhaseSelector";
import { translateKeys as tk, usePhaseSelector } from "@diplicity/common";
import { useParams } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { clickSelectOption } from "../../utils/test";

type UsePhaseSelectorValues = ReturnType<typeof usePhaseSelector>;

interface ArrangeOptions {
  usePhaseSelectorValues: UsePhaseSelectorValues;
}

const mockUsePhaseSelector = usePhaseSelector as jest.Mock;
const mockUseParams = useParams as jest.Mock;
const mockSetPhase = jest.fn();
const mockSetNextPhase = jest.fn();
const mockSetPreviousPhase = jest.fn();

let usePhaseSelectorValues: UsePhaseSelectorValues;

jest.mock("@diplicity/common", () => ({
  ...jest.requireActual("@diplicity/common"),
  usePhaseSelector: jest.fn(),
}));
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
}));

const gameId = "gameId";

describe("PhaseSelector", () => {
  const arrange = (options: ArrangeOptions) => {
    mockUsePhaseSelector.mockImplementation(
      () => options.usePhaseSelectorValues
    );
    mockUseParams.mockImplementation(() => ({ gameId }));
    return render(<PhaseSelector />);
  };
  beforeEach(() => {
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
    jest.clearAllMocks();
  });
  test("Renders without error", () => {
    arrange({ usePhaseSelectorValues });
    expect(screen.queryByTitle(tk.phaseSelector.title)).toBeInTheDocument();
  });
  test("Does not render if loading", async () => {
    usePhaseSelectorValues.isLoading = true;
    arrange({ usePhaseSelectorValues });
    expect(screen.queryByTitle(tk.phaseSelector.title)).not.toBeInTheDocument();
  });
  test("Does not render if error", async () => {
    usePhaseSelectorValues.isError = true;
    arrange({ usePhaseSelectorValues });
    expect(screen.queryByTitle(tk.phaseSelector.title)).not.toBeInTheDocument();
  });
  test("Does not render if not selected phase", async () => {
    usePhaseSelectorValues.selectedPhase = undefined;
    arrange({ usePhaseSelectorValues });
    expect(screen.queryByTitle(tk.phaseSelector.title)).not.toBeInTheDocument();
  });
  test("Does not render if not phases", async () => {
    usePhaseSelectorValues.phases = undefined;
    arrange({ usePhaseSelectorValues });
    expect(screen.queryByTitle(tk.phaseSelector.title)).not.toBeInTheDocument();
  });
  test("When no next phase next button is disabled", async () => {
    usePhaseSelectorValues.selectedPhase = 2;
    arrange({ usePhaseSelectorValues });
    expect(screen.getByTitle(tk.phaseSelector.nextButton.title)).toBeDisabled();
  });
  test("When no previous phase previous button is disabled", async () => {
    usePhaseSelectorValues.selectedPhase = 1;
    arrange({ usePhaseSelectorValues });
    expect(
      screen.getByTitle(tk.phaseSelector.previousButton.title)
    ).toBeDisabled();
  });
  test("Clicking next calls setNextPhase", async () => {
    usePhaseSelectorValues.selectedPhase = 1;
    arrange({ usePhaseSelectorValues });
    userEvent.click(screen.getByTitle(tk.phaseSelector.nextButton.title));
    expect(mockSetNextPhase).toBeCalled();
  });
  test("Clicking previous calls setPreviousPhase", async () => {
    usePhaseSelectorValues.selectedPhase = 2;
    arrange({ usePhaseSelectorValues });
    userEvent.click(screen.getByTitle(tk.phaseSelector.previousButton.title));
    expect(mockSetPreviousPhase).toBeCalled();
  });
  test("Clicking select option calls setPhase", async () => {
    arrange({ usePhaseSelectorValues });
    await clickSelectOption("Phase", "Spring 1901, Retreat");
    expect(mockSetPhase).toBeCalledWith(2);
  });
});
