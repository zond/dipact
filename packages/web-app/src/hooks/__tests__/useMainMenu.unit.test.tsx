import { renderHook } from "@testing-library/react-hooks";
import { useMainMenu } from "../useMainMenu";
import { useSelector } from "react-redux";
import { authActions } from "@diplicity/common";

const mockUseDispatch = jest.fn();
jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: () => mockUseDispatch,
  useSelector: jest.fn(),
}));

const user = { username: "john" }

describe("useMainMenu", () => {
  beforeEach(() => {
    mockUseDispatch.mockClear();
  });
  test("Returns user from store", () => {
    (useSelector as jest.Mock).mockImplementation(() => user);
    const { result } = renderHook(() => useMainMenu());
    expect(result.current.user).toBe(user);
  });
  test("Calling logout dispatches logout action", () => {
    const { result } = renderHook(() => useMainMenu());
    result.current.logout()
    expect(mockUseDispatch).toBeCalledWith(authActions.logout());
  });
});
