import { useRoute as rnUseRoute } from "@react-navigation/native";
import { useRoute } from "../useRoute";

jest.mock("@react-navigation/native", () => ({
  useRoute: jest.fn(),
}));

describe("useRoute", () => {
  test("Gets route from rneUseRoute", () => {
    const mockUseRoute = rnUseRoute as jest.Mock;
    useRoute();
    expect(mockUseRoute).toBeCalled();
  });
});
