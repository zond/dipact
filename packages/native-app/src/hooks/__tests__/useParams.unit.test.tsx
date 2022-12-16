import { useRoute } from "../useRoute";
import { useParams } from "../useParams";

jest.mock("../useRoute", () => ({
  useRoute: jest.fn(),
}));

describe("useRoute", () => {
  test("Gets route from rneUseRoute", () => {
    const expectedParams = { abc: "123" };
    (useRoute as jest.Mock).mockImplementation(() => ({
      params: expectedParams,
    }));
    const result = useParams();
    expect(expectedParams).toEqual(result);
  });
});
