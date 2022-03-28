import React from "react";

import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import Loading from "../Loading";

describe("Loading", () => {
  test("Renders without error", () => {
    render(<Loading />);
  });
});
