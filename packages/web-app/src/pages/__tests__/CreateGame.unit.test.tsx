import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import CreateGame from "../CreateGame";

let container: HTMLDivElement;

describe("CreateGame", () => {
  beforeEach(() => {
    // setup a DOM element as a render target
    container = document.createElement("div");
    document.body.appendChild(container);
  });
  afterEach(() => {
    // cleanup on exiting
    unmountComponentAtNode(container);
    container.remove();
  });
  test("Renders without error", () => {
    act(() => {
      render(<CreateGame />, container);
    });
    expect(container.textContent).toBe("");
  });
});
