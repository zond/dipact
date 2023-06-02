import { renderHook } from "@testing-library/react-hooks";
import { uiActions } from "../../store";
import usePageLoad, { useLazyPageLoad } from "../usePageLoad";

const mockUseDispatch = jest.fn();
jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: () => mockUseDispatch,
}));

describe("usePageLoad", () => {
  beforeEach(() => {
    mockUseDispatch.mockClear();
  });
  test("Dispatches page load action", () => {
    renderHook(() => usePageLoad("CreateGame"));
    expect(mockUseDispatch).toBeCalledWith(uiActions.pageLoad("CreateGame"));
  });
  test("Doesn't dispatch on re-render", () => {
    const result = renderHook(() => usePageLoad("CreateGame"));
    result.rerender();
    expect(mockUseDispatch).toBeCalledTimes(1);
  });
});

describe("useLazyPageLoad", () => {
  beforeEach(() => {
    mockUseDispatch.mockClear();
  });
  test("Doesn't dispatch when not called", () => {
    renderHook(() => useLazyPageLoad("CreateGame"));
    expect(mockUseDispatch).not.toBeCalled();
  });
  test("Dispatches page load action when called", () => {
    const { result } = renderHook(() => useLazyPageLoad("CreateGame"));
    result.current();
    expect(mockUseDispatch).toBeCalledWith(uiActions.pageLoad("CreateGame"));
  });
});
