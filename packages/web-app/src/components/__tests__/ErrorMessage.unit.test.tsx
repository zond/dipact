import React from "react";

import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import ErrorMessage from "../ErrorMessage";
import { DiplicityError } from "@diplicity/common";

let error: DiplicityError;

describe("ErrorMessage", () => {
  beforeEach(() => {
    error = { status: 500 };
  });
  test("Renders without error", () => {
    render(<ErrorMessage error={error} />);
  });
  test("Shows error code", () => {
    render(<ErrorMessage error={error} />);
    screen.getByText("500", { exact: false });
  });
  test("Shows internal server error on 500", () => {
    render(<ErrorMessage error={error} />);
    screen.getByText("Internal server error", { exact: false });
  });
  test("Shows unauthorized error on 401", () => {
    error = { status: 401 };
    render(<ErrorMessage error={error} />);
    screen.getByText("Unauthorized", { exact: false });
  });
  test("Shows nothing error on unknown status", () => {
    error = { status: 412 };
    render(<ErrorMessage error={error} />);
  });
});
