import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import NationPreferencesDialog, { searchKey } from "../NationPreferencesDialog.new";
import useSearchParams from "../../hooks/useSearchParams";
import useNationPreferencesDialog from "../../hooks/useNationPreferencesDialog";
import { translateKeys as tk } from "@diplicity/common"

interface ArrangeOptions {
  props: Parameters<typeof NationPreferencesDialog>[0];
  useNationPreferencesDialogValues: Omit<ReturnType<typeof useNationPreferencesDialog>, "updateOrder">;
}

const mockHandleSubmit = jest.fn();
const mockRemoveParam = jest.fn();
const mockUpdateOrder = jest.fn();

jest.mock("../../hooks/useSearchParams", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("../../hooks/useNationPreferencesDialog", () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe("NationPreferencesDialog", () => {
  const arrange = (options: ArrangeOptions) => {
    (useSearchParams as jest.Mock).mockImplementation(() => ({
      getParam: () => "Classical",
      removeParam: mockRemoveParam,
    }));
    (useNationPreferencesDialog as jest.Mock).mockImplementation(() => ({
      updateOrder: mockUpdateOrder,
      ...options.useNationPreferencesDialogValues,
    }));
    return render(<NationPreferencesDialog {...options.props} />);
  };
  beforeEach(() => {});
  test("Renders without error", () => {
    const props = { handleSubmit: mockHandleSubmit };
    const useNationPreferencesDialogValues = { preferences: [] };
    arrange({ props, useNationPreferencesDialogValues });
  });
  test("Down button disabled when last in list", () => {
    const props = { handleSubmit: mockHandleSubmit };
    const useNationPreferencesDialogValues = { preferences: ["England"] };
    arrange({ props, useNationPreferencesDialogValues });
    const downButton = screen.getByTitle("Move down");
    expect(downButton).toBeDisabled();
  });
  test("Down button calls updateOrder", () => {
    const props = { handleSubmit: mockHandleSubmit };
    const useNationPreferencesDialogValues = { preferences: ["France", "England"] };
    arrange({ props, useNationPreferencesDialogValues });
    const downButton = screen.getAllByTitle("Move down")[0];
    fireEvent.click(downButton);
    expect(mockUpdateOrder).toBeCalledWith("down", 0);
  });
  test("Up button disabled when first in list", () => {
    const props = { handleSubmit: mockHandleSubmit };
    const useNationPreferencesDialogValues = { preferences: ["England"] };
    arrange({ props, useNationPreferencesDialogValues });
    const upButton = screen.getByTitle("Move up");
    expect(upButton).toBeDisabled();
  });
  test("Up button calls updateOrder", () => {
    const props = { handleSubmit: mockHandleSubmit };
    const useNationPreferencesDialogValues = { preferences: ["France", "England"] };
    arrange({ props, useNationPreferencesDialogValues });
    const upButton = screen.getAllByTitle("Move up")[1];
    fireEvent.click(upButton);
    expect(mockUpdateOrder).toBeCalledWith("up", 1);
  });
  test("Submit button calls handleSubmit and closes", () => {
    const props = { handleSubmit: mockHandleSubmit };
    const useNationPreferencesDialogValues = { preferences: ["France"] };
    arrange({ props, useNationPreferencesDialogValues });
    const submitButton = screen.getByText(tk.nationPreferences.joinButton.label);
    fireEvent.click(submitButton);
    expect(mockHandleSubmit).toBeCalledWith(["France"]);
    expect(mockRemoveParam).toBeCalledWith(searchKey);
  });
  test("Close button calls close", () => {
    const props = { handleSubmit: mockHandleSubmit };
    const useNationPreferencesDialogValues = { preferences: ["France"] };
    arrange({ props, useNationPreferencesDialogValues });
    const submitButton = screen.getByText(tk.nationPreferences.closeButton.label);
    fireEvent.click(submitButton);
    expect(mockRemoveParam).toBeCalledWith(searchKey);
  });
});
