import React from "react";

import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import ErrorMessage from "../ErrorMessage";
import { ApiError } from "../../hooks/types";

describe("ErrorMessage", () => {
  test("Renders without error", () => {
    const error = { status: 500 } as ApiError;
    render(<ErrorMessage error={error} />);
  });
  test("Shows error code", () => {
    const error = { status: 500 } as ApiError;
    render(<ErrorMessage error={error} />);
    screen.getByText("500", { exact: false });
  });
  test("Shows internal server error on 500", () => {
    const error = { status: 500 } as ApiError;
    render(<ErrorMessage error={error} />);
    screen.getByText("Internal server error", { exact: false });
  });
  test("Shows unauthorized error on 401", () => {
    const error = { status: 401 } as ApiError;
    render(<ErrorMessage error={error} />);
    screen.getByText("Unauthorized", { exact: false });
  });
});
