import React from "react";
import ReactDOM from "react-dom";
import { mount } from "enzyme";
import { createMemoryHistory, MemoryHistory } from "history";
import { fireEvent, render, screen } from "@testing-library/react";

import GoBackNavComponent from "../GoBackNav";
import { routerDecorator } from "../../pages/Router";
import { RouteConfig } from "../../pages/RouteConfig";

let history: MemoryHistory;

interface MainMenuTestProps {
  history: MemoryHistory;
}

const getComponent = ({ history }: MainMenuTestProps) =>
  routerDecorator(history)(() =>
    GoBackNavComponent({ title: "Title", href: RouteConfig.Home, children: [] })
  );

const getGoBackButton = () => screen.getByTitle("Go back");

describe("GoBackNav", () => {
  beforeEach(() => {
    history = createMemoryHistory();
    history.push("/title")
  });

  test("Create component", () => {
    const div = document.createElement("div");
    const MainMenu = getComponent({ history });
    ReactDOM.render(<MainMenu />, div);
  });

  test("Mount component", () => {
    const MainMenu = getComponent({ history });
    mount(<MainMenu />);
  });

  test("Click back button goes back", async () => {
    const MainMenu = getComponent({ history });
    render(<MainMenu />);

    const button = await getGoBackButton();
    fireEvent.click(button);

    expect(history.location.pathname).toBe(RouteConfig.Home);
  });
});
