import React from "react";
import ReactDOM from "react-dom";
import { mount } from "enzyme";
import Donate from "../Donate";

describe("Donate", () => {
  test("Create component", () => {
    const div = document.createElement("div");
    ReactDOM.render(<Donate />, div);
  });

  test("Mount component", () => {
    mount(<Donate />);
  });
});
