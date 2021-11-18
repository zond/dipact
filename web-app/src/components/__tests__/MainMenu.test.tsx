import React from "react";
import ReactDOM from "react-dom";
import { mount } from "enzyme";
import { fireEvent, render, screen } from "@testing-library/react";
import { createMemoryHistory, MemoryHistory } from "history";

import MainMenuComponent, { mainMenuDecorator } from "../MainMenu";
import { routerDecorator } from "../../pages/Router";
import { RouteConfig } from "../../pages/RouteConfig";

let history: MemoryHistory;
const mockLogout = jest.fn();
global.open = jest.fn();

interface MainMenuTestProps {
  history: MemoryHistory;
  user: {
    Picture: string;
    Email: string;
    Id: string;
  };
}

const defaultUser = {
  Picture: "www.picture.test.com",
  Email: "test@test.com",
  Id: "123",
};

const getDefaultProps = (): MainMenuTestProps => ({
  history,
  user: defaultUser,
});

const getComponent = ({ history, user }: MainMenuTestProps) =>
  mainMenuDecorator({ user, logout: mockLogout })(
    routerDecorator(history)(MainMenuComponent)
  );

const getOpenDrawerButton = () => screen.getByTitle("Open drawer");
const getAvatar = () => screen.getByAltText("Your avatar");
const getOpenUserMenuButton = () => screen.getByTitle("Open user menu");

describe("MainMenu", () => {
  beforeEach(() => {
    history = createMemoryHistory();
  });

  test("Create component", () => {
    const div = document.createElement("div");
    const MainMenu = getComponent(getDefaultProps());
    ReactDOM.render(<MainMenu />, div);
  });

  test("Mount component", () => {
    const MainMenu = getComponent(getDefaultProps());
    mount(<MainMenu />);
  });

  test("Click open drawer button opens drawer", async () => {
    const MainMenu = getComponent(getDefaultProps());
    render(<MainMenu />);

    const button = await getOpenDrawerButton();
    fireEvent.click(button);

    screen.getByTitle("Main menu drawer");
  });

  test("Avatar shows user avatar", async () => {
    const MainMenu = getComponent(getDefaultProps());
    render(<MainMenu />);

    const avatar = await getAvatar();
    expect(avatar.getAttribute("src")).toBe(defaultUser.Picture);
  });

  test("Click avatar shows user menu", async () => {
    const MainMenu = getComponent(getDefaultProps());
    render(<MainMenu />);

    const button = await getOpenUserMenuButton();
    fireEvent.click(button);

    screen.getByText("Logout");
  });

  test("User email appears in user menu", async () => {
    const MainMenu = getComponent(getDefaultProps());
    render(<MainMenu />);

    const button = await getOpenUserMenuButton();
    fireEvent.click(button);

    screen.getByText(defaultUser.Email);
  });

  test("Click player stats menu item opens player stats", async () => {
    const MainMenu = getComponent(getDefaultProps());
    render(<MainMenu />);

    const button = await getOpenUserMenuButton();
    fireEvent.click(button);
    const menuItem = screen.getByText("Player stats");
    fireEvent.click(menuItem);

    expect(history.location.search).toBe(`?player-stats=${defaultUser.Id}`);
  });
  test("Click logout causes logout", async () => {
    const MainMenu = getComponent(getDefaultProps());
    render(<MainMenu />);

    const button = await getOpenUserMenuButton();
    fireEvent.click(button);
    const menuItem = screen.getByText("Logout");
    fireEvent.click(menuItem);

    expect(mockLogout).toBeCalled();
  });
  test("Click about opens about page", async () => {
    const MainMenu = getComponent(getDefaultProps());
    render(<MainMenu />);

    const button = await getOpenDrawerButton();
    fireEvent.click(button);
    const menuItem = screen.getByText("About");
    fireEvent.click(menuItem);

    expect(history.location.pathname).toBe(RouteConfig.About);
  });
  test("Click settings opens settings page", async () => {
    const MainMenu = getComponent(getDefaultProps());
    render(<MainMenu />);

    const button = await getOpenDrawerButton();
    fireEvent.click(button);
    const menuItem = screen.getByText("Settings");
    fireEvent.click(menuItem);

    expect(history.location.pathname).toBe(RouteConfig.Settings);
  });
  test("Click chat opens discord link", async () => {
    const MainMenu = getComponent(getDefaultProps());
    render(<MainMenu />);

    const button = await getOpenDrawerButton();
    fireEvent.click(button);
    const menuItem = screen.getByText("Chat");
    fireEvent.click(menuItem);

    expect(global.open).toBeCalledWith("https://discord.gg/bu3JxYc", "_blank");
  });

  test("Click forum opens forum link", async () => {
    const MainMenu = getComponent(getDefaultProps());
    render(<MainMenu />);

    const button = await getOpenDrawerButton();
    fireEvent.click(button);
    const menuItem = screen.getByText("Forum");
    fireEvent.click(menuItem);

    expect(global.open).toBeCalledWith(
      "https://groups.google.com/g/diplicity-talk",
      "_blank"
    );
  });

  test("Click faq opens faq link", async () => {
    const MainMenu = getComponent(getDefaultProps());
    render(<MainMenu />);

    const button = await getOpenDrawerButton();
    fireEvent.click(button);
    const menuItem = screen.getByText("FAQ");
    fireEvent.click(menuItem);

    expect(global.open).toBeCalledWith(
      "https://diplicity.notion.site/diplicity/Diplicity-FAQ-7b4e0a119eb54c69b80b411f14d43bb9",
      "_blank"
    );
  });

  test("Click GitHub opens GitHub link", async () => {
    const MainMenu = getComponent(getDefaultProps());
    render(<MainMenu />);

    const button = await getOpenDrawerButton();
    fireEvent.click(button);
    const menuItem = screen.getByTitle("GitHub repo for this project");

    expect(menuItem.getAttribute("href")).toBe(
      "https://github.com/zond/dipact"
    );
  });
  test("Click error log opens error log dialog", async () => {
    const MainMenu = getComponent(getDefaultProps());
    render(<MainMenu />);

    const button = await getOpenDrawerButton();
    fireEvent.click(button);
    const menuItem = screen.getByTitle("Report a bug");
    fireEvent.click(menuItem);

    expect(history.location.search).toBe("?error-log=1");
  });
  test("Click donate opens donate page", async () => {
    const MainMenu = getComponent(getDefaultProps());
    render(<MainMenu />);

    const button = await getOpenDrawerButton();
    fireEvent.click(button);
    const menuItem = screen.getByTitle("Donate to this project");

    expect(menuItem.getAttribute("href")).toBe(
      RouteConfig.Donate
    );
  });
});
