import i18n from "../i18n";

describe("i18n", () => {
  beforeAll(() => {
    jest.resetAllMocks();
  });
  test("Initializes", () => {
    const i = i18n;
    expect(i.isInitialized).toBe(true);
  });
});
