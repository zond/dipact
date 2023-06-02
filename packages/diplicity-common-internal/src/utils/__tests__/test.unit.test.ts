import { mockFunction } from "../test";

describe("mockFunction", () => {
  test("Mocks function", () => {
    const func = () => null;
    mockFunction(func);
  });
});
