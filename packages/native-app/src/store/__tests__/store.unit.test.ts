import { store } from "..";

jest.mock("@react-native-google-signin/google-signin", () => jest.fn());

describe("Store", () => {
  test("Get store", () => {
    store;
  });
});
