import { useNavigation as rnUseNavigation } from "@react-navigation/native";
import { useNavigation } from "../useNavigation";

jest.mock("@react-navigation/native", () => ({
  useNavigation: jest.fn(),
}));

describe("useNavigation", () => {
  test("Gets navigation from rneUseNavigation", () => {
    const mockUseNavigation = rnUseNavigation as jest.Mock;
    useNavigation();
    expect(mockUseNavigation).toBeCalled();
  });
});
