import "@testing-library/jest-dom/extend-expect";
import { useLocation } from "react-router-dom";
import useSearchParams from "../useSearchParams";

const mockReplace = jest.fn();
jest.mock("react-router-dom", () => ({
  useHistory: () => ({
    replace: mockReplace,
  }),
  useLocation: jest.fn(),
}));

describe("useSearchParams", () => {
  beforeEach(() => {
    (useLocation as jest.Mock).mockImplementation(() => ({
      search: "?token=123",
    }));
  });
  test("Calling getParam gets param", () => {
    const { getParam } = useSearchParams();
    expect(getParam("token")).toBe("123");
  });
  test("Calling setParam sets param", () => {
    const setSpy = jest.spyOn(URLSearchParams.prototype, "set");
    const { setParam } = useSearchParams();
    setParam("token", "123");
    expect(setSpy).toBeCalledWith("token", "123");
    expect(mockReplace).toBeCalledWith({ search: "token=123" });
  });
  test("Calling removeParam removes param", () => {
    const deleteSpy = jest.spyOn(URLSearchParams.prototype, "delete");
    const { removeParam } = useSearchParams();
    removeParam("token");
    expect(deleteSpy).toBeCalledWith("token");
    expect(mockReplace).toBeCalledWith({ search: "" });
  });
});
