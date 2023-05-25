import React from "react";

import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import GoBackNav from "../GoBackNav";

const childText = "childText";
const title = "title";
const href = "href";

const mockHistoryPush = jest.fn();
jest.mock("react-router-dom", () => ({
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

describe("GoBackNav", () => {
  test("Shows child", () => {
    render(
      <GoBackNav title={title} href={href}>
        <div>{childText}</div>
      </GoBackNav>
    );
    screen.getByText(childText);
  });
  test("Shows title", () => {
    render(
      <GoBackNav title={title} href={href}>
        <div>{childText}</div>
      </GoBackNav>
    );
    screen.getByText(title);
  });
  test("Clicking button redirects", () => {
    render(
      <GoBackNav title={title} href={href}>
        <div>{childText}</div>
      </GoBackNav>
    );
    const button = screen.getByTitle("Go back");
    fireEvent.click(button);
    expect(mockHistoryPush).toHaveBeenCalledWith(href);
  });
});
