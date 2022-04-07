import { renderHook } from "@testing-library/react-hooks";
import { act } from "react-dom/test-utils";
import { useSelector } from "react-redux";
import useNationPreferencesDialog from "../useNationPreferencesDialog";

const mockTriggerPageLoad = jest.fn();
jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
}));
jest.mock("@diplicity/common", () => ({
  ...jest.requireActual("@diplicity/common"),
  useLazyPageLoad: () => mockTriggerPageLoad,
}));

const variant = "Classical";
const nations = ["England", "France"];

describe("useNationPreferencesDialog", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    (useSelector as jest.Mock).mockImplementation(() => ({ nations }));
  });
  test("Calls triggerPageLoad if variant", () => {
    const { rerender } = renderHook(() => useNationPreferencesDialog(variant));
    rerender(variant);
    expect(mockTriggerPageLoad).toBeCalled();
  });
  test("Does not call triggerPageLoad if not variant", () => {
    renderHook(() => useNationPreferencesDialog(null));
    expect(mockTriggerPageLoad).not.toBeCalled();
  });
  test("Sets preferences to nations", () => {
    const { result } = renderHook(() => useNationPreferencesDialog(null));
    expect(result.current.preferences).toEqual(nations);
  });
  test("updateOrder changes preferences", () => {
    const { result, rerender } = renderHook(() =>
      useNationPreferencesDialog(null)
    );
    const { updateOrder } = result.current;
    act(() => {
      updateOrder("up", 1);
    });
    rerender();
    const { preferences } = result.current;
    expect(preferences).toEqual(["France", "England"]);
  });
  test("updateOrder down changes preferences", () => {
    const { result, rerender } = renderHook(() =>
      useNationPreferencesDialog(null)
    );
    const { updateOrder } = result.current;
    act(() => {
      updateOrder("down", 0);
    });
    rerender();
    const { preferences } = result.current;
    expect(preferences).toEqual(["France", "England"]);
  });
  test("Rerender does not reset order", () => {
    const { result, rerender } = renderHook(() =>
      useNationPreferencesDialog(null)
    );
    const { updateOrder } = result.current;
    act(() => {
      updateOrder("up", 1);
    });
    rerender();
    const { preferences } = result.current;
    expect(preferences).toEqual(["France", "England"]);
    rerender();
    expect(preferences).toEqual(["France", "England"]);
  });
});
