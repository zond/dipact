import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import MainMenu from "../MainMenu.new";
import { useMainMenu } from "../../hooks/useMainMenu";
import useSearchParams from "../../hooks/useSearchParams";
import { links, translateKeys as tk } from "@diplicity/common";
import { act } from "react-dom/test-utils";
import { RouteConfig } from "../../pages/RouteConfig";

interface ArrangeOptions {
  props: Omit<Parameters<typeof MainMenu>[0], "children">;
  useMainMenuValues: ReturnType<typeof useMainMenu>;
  userMenuOpen?: true;
  drawerOpen?: true;
}

const childText = "ChildText";
const title = "Create game";
let props: ArrangeOptions["props"];
let useMainMenuValues: ArrangeOptions["useMainMenuValues"];
const user = { Email: "john@fake.com", Picture: "", Id: "123" };

const mockLogout = jest.fn();
const mockSetParam = jest.fn();
const mockHistoryPush = jest.fn();
jest.mock("../../hooks/useMainMenu", () => ({
  useMainMenu: jest.fn(),
}));
jest.mock("../../hooks/useSearchParams", () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock("react-router-dom", () => ({
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));
global.open = jest.fn();

describe("MainMenu", () => {
  const arrange = (options: ArrangeOptions) => {
    (useMainMenu as jest.Mock).mockImplementation(() => ({
      ...options.useMainMenuValues,
    }));
    const api = render(
      <MainMenu {...options.props}>
        <div>{childText}</div>
      </MainMenu>
    );
    if (options.userMenuOpen) {
      act(() => {
        fireEvent.click(screen.getByTitle(tk.mainMenu.userMenu.button.title));
      });
    }
    if (options.drawerOpen) {
      act(() => {
        fireEvent.click(screen.getByTitle(tk.mainMenu.drawer.button.title));
      });
    }
    return api;
  };
  beforeEach(() => {
    (useSearchParams as jest.Mock).mockImplementation(() => ({
      setParam: mockSetParam,
    }));
    props = { title };
    useMainMenuValues = {
      user: null,
      logout: mockLogout,
    };
  });
  test("Renders without error", () => {
    arrange({ props, useMainMenuValues });
  });
  test("Shows title", () => {
    arrange({ props, useMainMenuValues });
    expect(screen.getByText(title)).not.toBeNull();
  });
  test("Shows child element", () => {
    arrange({ props, useMainMenuValues });
    expect(screen.getByText(childText)).not.toBeNull();
  });
  test("Hides user menu when not user", () => {
    arrange({ props, useMainMenuValues });
    expect(screen.queryByTitle(tk.mainMenu.userMenu.button.title)).toBeNull();
  });
  test("Shows user menu when user", () => {
    useMainMenuValues.user = user;
    arrange({ props, useMainMenuValues });
    expect(
      screen.getAllByTitle(tk.mainMenu.userMenu.button.title)
    ).not.toBeNull();
  });
  test("User menu items hidden by default", () => {
    useMainMenuValues.user = user;
    arrange({ props, useMainMenuValues });
    expect(
      screen.queryByRole("menuitem", {
        name: tk.mainMenu.userMenu.logoutMenuItem.label,
      })
    ).toBeNull();
  });
  test("Click user menu button shows user menu", () => {
    useMainMenuValues.user = user;
    arrange({ props, useMainMenuValues, userMenuOpen: true });
    expect(
      screen.getByRole("menuitem", {
        name: tk.mainMenu.userMenu.logoutMenuItem.label,
      })
    ).not.toBeNull();
  });
  test("Click logout dispatches logout", () => {
    useMainMenuValues.user = user;
    arrange({ props, useMainMenuValues, userMenuOpen: true });
    fireEvent.click(
      screen.getByRole("menuitem", {
        name: tk.mainMenu.userMenu.logoutMenuItem.label,
      })
    );
    expect(mockLogout).toBeCalled();
  });
  test("Click player stats menu item sets param", () => {
    useMainMenuValues.user = user;
    arrange({ props, useMainMenuValues, userMenuOpen: true });
    fireEvent.click(
      screen.getByRole("menuitem", {
        name: tk.mainMenu.userMenu.playerStatsMenuItem.label,
      })
    );
    expect(mockSetParam).toBeCalledWith("player-stats", user.Id);
  });
  test("Click away closes user menu", async () => {
    useMainMenuValues.user = user;
    arrange({ props, useMainMenuValues, userMenuOpen: true });
    const backdrop = screen.getByRole("presentation");
    fireEvent.click(backdrop.firstChild as HTMLElement);
    await waitFor(() => {
      expect(
        screen.queryByRole("menuitem", {
          name: tk.mainMenu.userMenu.logoutMenuItem.label,
        })
      ).toBeNull();
    });
  });
  test("Drawer items hidden by default", () => {
    arrange({ props, useMainMenuValues });
    expect(
      screen.queryByRole("menuitem", {
        name: tk.mainMenu.drawer.createGameMenuItem.title,
      })
    ).toBeNull();
  });
  test("Click drawer button shows drawer", () => {
    arrange({ props, useMainMenuValues, drawerOpen: true });
    expect(
      screen.getByText(tk.mainMenu.drawer.createGameMenuItem.title)
    ).not.toBeNull();
  });
  test("Click create game button redirects", () => {
    arrange({ props, useMainMenuValues, drawerOpen: true });
    fireEvent.click(
      screen.getByText(tk.mainMenu.drawer.createGameMenuItem.title)
    );
    expect(mockHistoryPush).toBeCalledWith(RouteConfig.CreateGame);
  });
  test("Click chat button redirects", () => {
    arrange({ props, useMainMenuValues, drawerOpen: true });
    fireEvent.click(screen.getByText(tk.mainMenu.drawer.chatMenuItem.title));
    expect(global.open).toBeCalledWith(links.diplicityDiscord, "_blank");
  });
  test("Click forum button redirects", () => {
    arrange({ props, useMainMenuValues, drawerOpen: true });
    fireEvent.click(screen.getByText(tk.mainMenu.drawer.forumMenuItem.title));
    expect(global.open).toBeCalledWith(links.diplicityForum, "_blank");
  });
  test("Click faq button redirects", () => {
    arrange({ props, useMainMenuValues, drawerOpen: true });
    fireEvent.click(screen.getByText(tk.mainMenu.drawer.faqMenuItem.title));
    expect(global.open).toBeCalledWith(links.diplicityFAQ, "_blank");
  });
  test("Click about button redirects", () => {
    arrange({ props, useMainMenuValues, drawerOpen: true });
    fireEvent.click(screen.getByText(tk.mainMenu.drawer.aboutMenuItem.title));
    expect(global.open).toBeCalledWith(links.notion, "_blank");
  });
  test("Click away closes drawer", () => {
    arrange({ props, useMainMenuValues, drawerOpen: true });
    fireEvent.click(screen.getByText(childText));
    expect(
      screen.queryByRole("menuitem", {
        name: tk.mainMenu.drawer.createGameMenuItem.title,
      })
    ).toBeNull();
  });
  test("Click backdrop closes drawer", async () => {
    arrange({ props, useMainMenuValues, drawerOpen: true });
    const backdrop = screen.getByRole("presentation");
    fireEvent.click(backdrop.firstChild as HTMLElement);
    await waitFor(() => {
      expect(
        screen.queryByRole("menuitem", {
          name: tk.mainMenu.drawer.createGameMenuItem.title,
        })
      ).toBeNull();
    });
  });
});
