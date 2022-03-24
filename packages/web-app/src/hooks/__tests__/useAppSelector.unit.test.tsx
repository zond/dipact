import { useSelector } from "react-redux";

import { useAppSelector } from "../useAppSelector";

describe("useAppSelector", () => {
  test("Same as useSelector", () => {
    expect(useAppSelector).toEqual(useSelector);
  });
});
