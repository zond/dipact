import React from "react";
import {
  render,
  screen,
  waitFor,
  fireEvent,
  getByText,
  getByDisplayValue,
  queryByText,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { diplicityServiceURL } from "../../store/service";

import { generatePath, Router, Route, Switch } from "react-router";
import "@testing-library/jest-dom/extend-expect";
import { setupServer } from "msw/node";
import { createMemoryHistory, MemoryHistory } from "history";
import { ThemeProvider, StyledEngineProvider } from "@mui/material";

import { handlers } from "../../mockService/handlers";
import { ReduxWrapper } from "../../store/testUtils";
import { RouteConfig } from "../../pages/RouteConfig";
import { userSeesLoadingSpinner } from "../testUtils";
import Game from "../Game";
import GameList, { NO_GAMES_MESSAGE } from "../GameList";
import theme from "../../theme";
import * as generalUtils from "../../utils/general";
import NationPreferencesDialog from "../../components/NationPreferencesDialog";
import FeedbackWrapper from "../../components/FeedbackWrapper";
import { Provider } from "react-redux";
import { createTestStore } from "../../store";
import ReactGA from "react-ga";
import RescheduleDialog from "../../components/RescheduleDialog";

const server = setupServer(
  handlers.getUser.success,
  handlers.variants.successShort,
  handlers.listGamesStarted.success,
  handlers.listGamesMasteredStaging.success,
  handlers.listGamesMasteredStarted.success,
  handlers.listGamesStaging.success,
  handlers.listGamesFinished.success,
  handlers.joinGame.success,
  handlers.getGame.success
);

beforeAll((): void => {
  server.listen();
});

beforeEach((): void => {
  fetchMock.resetMocks();
  fetchMock.dontMock();
});

afterEach((): void => {
  server.resetHandlers();
});

afterAll((): void => {
  server.close();
});

interface WrappedGameProps {
  path?: string;
}

let history: MemoryHistory<unknown>;

const WrappedGameList = ({ path }: WrappedGameProps) => {
  history = createMemoryHistory();
  history.push(path || "/");
  return (
    <ThemeProvider theme={theme}>
      <StyledEngineProvider injectFirst>
        <Router history={history}>
          <Switch>
            <Route path={RouteConfig.GameList}>
              <Provider store={createTestStore()}>
                <FeedbackWrapper>
                  <GameList />
                  <NationPreferencesDialog />
                  <RescheduleDialog />
                </FeedbackWrapper>
              </Provider>
            </Route>
          </Switch>
        </Router>
      </StyledEngineProvider>
    </ThemeProvider>
  );
};

const gameId = "game-123";
const gameListUrl = generatePath(RouteConfig.GameList);

const getTab = async (name: string, options?: any) => {
  return await waitFor(() => screen.getByRole("tab", { name, ...options }));
};

describe("Game functional tests", () => {
  let fetchSpy: jest.SpyInstance;
  let gaEventSpy: jest.SpyInstance;
  let gaSetSpy: jest.SpyInstance;

  beforeEach(() => {
    fetchSpy = jest.spyOn(global, "fetch");
    gaEventSpy = jest.spyOn(ReactGA, "event");
    gaSetSpy = jest.spyOn(ReactGA, "set");
  });

  test("Renders", async () => {
    render(<WrappedGameList path={gameListUrl} />);
    await userSeesLoadingSpinner();
  });

  test("Shows loading spinner when loading games", async () => {
    render(<WrappedGameList path={gameListUrl} />);
    await userSeesLoadingSpinner();
  });

  test("Default tab is all games", async () => {
    render(<WrappedGameList path={gameListUrl} />);
    await getTab("All games", { selected: true });
  });

  test("Default filter started", async () => {
    render(<WrappedGameList path={gameListUrl} />);
    const select = await waitFor(() => screen.getByTestId("status-select"));
    await waitFor(() => getByDisplayValue(select, "started"));
  });

  test("Shows message if user has no started games", async () => {
    server.use(handlers.listGamesMyStarted.successEmpty);
    render(<WrappedGameList path={gameListUrl} />);
    const myGamesTab = await getTab("My games");
    fireEvent.click(myGamesTab);
    await waitFor(() => screen.getByText(NO_GAMES_MESSAGE));
  });

  test("Shows message if user has no finished games", async () => {
    server.use(handlers.listGamesMyFinished.successEmpty);
    render(<WrappedGameList path={gameListUrl + "?status=finished"} />);
    const myGamesTab = await getTab("My games");
    fireEvent.click(myGamesTab);
    await waitFor(() => screen.getByText(NO_GAMES_MESSAGE));
  });

  test("Shows message if user has no staging games", async () => {
    server.use(handlers.listGamesMyStaging.successEmpty);
    render(<WrappedGameList path={gameListUrl + "?status=staging"} />);
    const myGamesTab = await getTab("My games");
    fireEvent.click(myGamesTab);
    await waitFor(() => screen.getByText(NO_GAMES_MESSAGE));
  });

  test("Shows message if no started games", async () => {
    server.use(handlers.listGamesStarted.successEmpty);
    render(<WrappedGameList path={gameListUrl} />);
    await waitFor(() => screen.getByText(NO_GAMES_MESSAGE));
  });
  test("Shows message if no finished games", async () => {
    server.use(handlers.listGamesFinished.successEmpty);
    render(<WrappedGameList path={gameListUrl + "?status=finished"} />);
    await waitFor(() => screen.getByText(NO_GAMES_MESSAGE));
  });
  test("Shows message if no staging games", async () => {
    server.use(handlers.listGamesStaging.successEmpty);
    render(<WrappedGameList path={gameListUrl + "?status=staging"} />);
    await waitFor(() => screen.getByText(NO_GAMES_MESSAGE));
  });

  test("Hits endpoints correctly - my started games", async () => {
    server.use(handlers.listGamesMyStarted.successEmpty);
    render(<WrappedGameList path={gameListUrl + "?status=started&my=1"} />);
    await userSeesLoadingSpinner();
    const call = fetchSpy.mock.calls[0][0];
    expect(call.url).toBe(`${diplicityServiceURL}My/Games/started`);
  });

  test("Hits endpoints correctly - my finished games", async () => {
    server.use(handlers.listGamesMyFinished.successEmpty);
    render(<WrappedGameList path={gameListUrl + "?status=finished&my=1"} />);
    await userSeesLoadingSpinner();
    const call = fetchSpy.mock.calls[0][0];
    expect(call.url).toBe(`${diplicityServiceURL}My/Games/finished`);
  });
  test("Hits endpoints correctly - my staging games", async () => {
    server.use(handlers.listGamesMyStaging.successEmpty);
    render(<WrappedGameList path={gameListUrl + "?status=staging&my=1"} />);
    await userSeesLoadingSpinner();
    const call = fetchSpy.mock.calls[0][0];
    expect(call.url).toBe(`${diplicityServiceURL}My/Games/staging`);
  });

  test("Hits endpoints correctly - started games", async () => {
    server.use(handlers.listGamesStarted.successEmpty);
    render(<WrappedGameList path={gameListUrl + "?status=started"} />);
    await userSeesLoadingSpinner();
    const call = fetchSpy.mock.calls[0][0];
    expect(call.url).toBe(`${diplicityServiceURL}Games/started`);
  });

  test("Hits endpoints correctly - finished games", async () => {
    server.use(handlers.listGamesFinished.successEmpty);
    render(<WrappedGameList path={gameListUrl + "?status=finished"} />);
    await userSeesLoadingSpinner();
    const call = fetchSpy.mock.calls[0][0];
    expect(call.url).toBe(`${diplicityServiceURL}Games/finished`);
  });
  test("Hits endpoints correctly - staging games", async () => {
    server.use(handlers.listGamesStaging.successEmpty);
    render(<WrappedGameList path={gameListUrl + "?status=staging"} />);
    await userSeesLoadingSpinner();
    const call = fetchSpy.mock.calls[0][0];
    expect(call.url).toBe(`${diplicityServiceURL}Games/staging`);
  });

  test("Hits endpoints correctly - my mastered started games", async () => {
    server.use(handlers.listGamesMasteredStaging.successEmpty);
    render(
      <WrappedGameList path={gameListUrl + "?my=1&mastered=1&status=started"} />
    );
    await userSeesLoadingSpinner();
    const call = fetchSpy.mock.calls[0][0];
    expect(call.url).toBe(`${diplicityServiceURL}My/Mastered/Games/started`);
  });

  test("Hits endpoints correctly - my mastered finished games", async () => {
    server.use(handlers.listGamesMasteredStaging.successEmpty);
    render(
      <WrappedGameList
        path={gameListUrl + "?my=1&mastered=1&status=finished"}
      />
    );
    await userSeesLoadingSpinner();
    const call = fetchSpy.mock.calls[0][0];
    expect(call.url).toBe(`${diplicityServiceURL}My/Mastered/Games/finished`);
  });

  test("Hits endpoints correctly - my mastered staging games", async () => {
    server.use(handlers.listGamesMasteredStaging.successEmpty);
    render(
      <WrappedGameList path={gameListUrl + "?my=1&mastered=1&status=staging"} />
    );
    await userSeesLoadingSpinner();
    const call = fetchSpy.mock.calls[0][0];
    expect(call.url).toBe(`${diplicityServiceURL}My/Mastered/Games/staging`);
  });

  test("Game card shows summary information", async () => {
    render(<WrappedGameList path={gameListUrl} />);
    await waitFor(() => screen.getByText("Name of started game"));
    await waitFor(() => screen.getByText("Classical 1d"));
    await waitFor(() => screen.getByText("Spring 901 Movement"));
  });

  test("If user can't join game reasons are shown", async () => {
    server.use(handlers.listGamesStarted.successFailedRequirements);
    render(<WrappedGameList path={gameListUrl} />);
    await waitFor(() => screen.getByText("You can't join this game:"));
    await waitFor(() =>
      screen.getByText("You've been reported too often (hated score too high).")
    );
    await waitFor(() => screen.getByText("You're too good (rating too high)."));
  });

  test("If user can join game reasons are not shown", async () => {
    server.use(handlers.listGamesStarted.success);
    render(<WrappedGameList path={gameListUrl} />);
    await waitFor(() => screen.getByText("Name of started game"));
    const text = screen.queryByText("You can't join this game:");
    expect(text).toBeNull();
  });

  test("Failed requirements disables join button", async () => {
    server.use(handlers.listGamesStarted.successFailedRequirements);
    render(<WrappedGameList path={gameListUrl} />);
    const button = await waitFor(() => screen.getByText("Join"));
    expect(button).toHaveAttribute("disabled");
  });

  test("View game button is <a> tag", async () => {
    server.use(handlers.listGamesStarted.success);
    render(<WrappedGameList path={gameListUrl} />);
    const link = await waitFor(() => screen.getByText("View").closest("a"));
    expect(link?.href).toBe(
      "http://localhost" +
        generatePath(RouteConfig.Game, { gameId: "game-123" })
    );
  });

  test("Invite button copies link to clipboard", async () => {
    const copyToClipboardSpy = jest.spyOn(generalUtils, "copyToClipboard");
    server.use(handlers.listGamesStarted.success);
    render(<WrappedGameList path={gameListUrl} />);
    const button = await waitFor(() => screen.getByText("Invite"));
    fireEvent.click(button);
    const gameUrl = generatePath(RouteConfig.Game, { gameId: "game-123" });
    expect(copyToClipboardSpy).toBeCalledWith(gameUrl);
  });

  test("Join button opens nation preferences dialog if nation selection is preference", async () => {
    server.use(handlers.listGamesStarted.success);
    render(<WrappedGameList path={gameListUrl} />);
    const button = await waitFor(() => screen.getByText("Join"));
    fireEvent.click(button);
    await waitFor(() => screen.getByText("Nation preferences"));
  });

  test("Join button shows errors when error", async () => {
    server.use(
      handlers.listGamesStaging.successRandomAllocation,
      handlers.joinGame.internalServerError
    );
    render(<WrappedGameList path={gameListUrl + "?status=staging"} />);
    const button = await waitFor(() => screen.getByText("Join"));
    fireEvent.click(button);
    await waitFor(() => screen.getByText("Couldn't join game."));
  });

  test("Join button hits endpoint correctly", async () => {
    server.use(handlers.listGamesStaging.successRandomAllocation);
    render(<WrappedGameList path={gameListUrl + "?status=staging"} />);
    const button = await waitFor(() => screen.getByText("Join"));
    fireEvent.click(button);
    await waitFor(() => screen.getByText("Joined game!"));
    const call = fetchSpy.mock.calls[2][0];
    expect(call.url).toBe(`${diplicityServiceURL}Game/${gameId}/Member`);
    expect(call.method).toBe("POST");
  });

  test("Join button calls GA", async () => {
    server.use(handlers.listGamesStaging.successRandomAllocation);
    render(<WrappedGameList path={gameListUrl + "?status=staging"} />);
    const button = await waitFor(() => screen.getByText("Join"));
    fireEvent.click(button);
    await waitFor(() => screen.getByText("Joined game!"));
    expect(gaEventSpy).toBeCalledWith({
      category: "(not set)",
      action: "game_list_element_join",
    });
  });

  test("Join button shows success feedback", async () => {
    server.use(handlers.listGamesStaging.successRandomAllocation);
    render(<WrappedGameList path={gameListUrl + "?status=staging"} />);
    const button = await waitFor(() => screen.getByText("Join"));
    fireEvent.click(button);
    await waitFor(() => screen.getByText("Joined game!"));
  });

  test.todo("Nation preference dialog causes gtag page load event");

  test("Nation preference dialog loads nations for game", async () => {
    render(<WrappedGameList path={gameListUrl + "?status=staging"} />);
    const button = await waitFor(() => screen.getByText("Join"));
    fireEvent.click(button);
    await waitFor(() => screen.getByText("Nation preferences"));
    const nations = [
      "Austria",
      "England",
      "France",
      "Germany",
      "Italy",
      "Turkey",
      "Russia",
    ];
    await waitFor(() => screen.getByText("Austria"));
    nations.forEach((nation) => screen.getByText(nation));
  });

  test("Nation preference dialog submit button disables submit button", async () => {
    render(<WrappedGameList path={gameListUrl + "?status=staging"} />);
    const joinButton = await waitFor(() => screen.getByText("Join"));
    fireEvent.click(joinButton);
    const dialog = await waitFor(() => screen.getByRole("dialog"));
    const dialogJoinButton = await waitFor(() => getByText(dialog, "Join"));
    expect(dialogJoinButton).not.toHaveAttribute("disabled");
    fireEvent.click(dialogJoinButton);
    expect(dialogJoinButton).toHaveAttribute("disabled");
  });
  test("Nation preference dialog submit button calls endpoint", async () => {
    render(<WrappedGameList path={gameListUrl + "?status=staging"} />);
    const joinButton = await waitFor(() => screen.getByText("Join"));
    fireEvent.click(joinButton);
    const dialog = await waitFor(() => screen.getByRole("dialog"));
    const dialogJoinButton = await waitFor(() => getByText(dialog, "Join"));
    expect(dialogJoinButton).not.toHaveAttribute("disabled");
    fireEvent.click(dialogJoinButton);
    await waitFor(() => screen.getByText("Joined game!"));
    const call = fetchSpy.mock.calls[3][0] as Request;
    expect(call.url).toBe(`${diplicityServiceURL}Game/${gameId}/Member`);
  });
  test("Nation preference dialog submit button causes gtag event", async () => {
    render(<WrappedGameList path={gameListUrl + "?status=staging"} />);
    const joinButton = await waitFor(() => screen.getByText("Join"));
    fireEvent.click(joinButton);
    const dialog = await waitFor(() => screen.getByRole("dialog"));
    const dialogJoinButton = await waitFor(() => getByText(dialog, "Join"));
    expect(dialogJoinButton).not.toHaveAttribute("disabled");
    fireEvent.click(dialogJoinButton);
    await waitFor(() => screen.getByText("Joined game!"));
    expect(gaEventSpy).toBeCalledWith({
      category: "(not set)",
      action: "game_list_element_join",
    });
  });

  test("Nation preference dialog submission closes dialog", async () => {
    render(<WrappedGameList path={gameListUrl + "?status=staging"} />);
    const joinButton = await waitFor(() => screen.getByText("Join"));
    fireEvent.click(joinButton);
    const dialog = await waitFor(() => screen.getByRole("dialog"));
    const dialogJoinButton = await waitFor(() => getByText(dialog, "Join"));
    expect(dialogJoinButton).not.toHaveAttribute("disabled");
    fireEvent.click(dialogJoinButton);
    await waitFor(() => screen.getByText("Joined game!"));
    await waitForElementToBeRemoved(() =>
      screen.queryByText("Nation preferences")
    );
  });

  test("Nation preference dialog close button closes dialog", async () => {
    render(<WrappedGameList path={gameListUrl + "?status=staging"} />);
    const joinButton = await waitFor(() => screen.getByText("Join"));
    fireEvent.click(joinButton);
    const dialog = await waitFor(() => screen.getByRole("dialog"));
    const dialogCancelButton = await waitFor(() => getByText(dialog, "Cancel"));
    expect(dialogCancelButton).not.toHaveAttribute("disabled");
    fireEvent.click(dialogCancelButton);
    await waitForElementToBeRemoved(() =>
      screen.queryByText("Nation preferences")
    );
  });

  test("Nation preference dialog submit button shows errors when error", async () => {
    server.use(handlers.joinGame.internalServerError);
    render(<WrappedGameList path={gameListUrl + "?status=staging"} />);
    const joinButton = await waitFor(() => screen.getByText("Join"));
    fireEvent.click(joinButton);
    const dialog = await waitFor(() => screen.getByRole("dialog"));
    const dialogJoinButton = await waitFor(() => getByText(dialog, "Join"));
    fireEvent.click(dialogJoinButton);
    await waitFor(() => screen.getByText("Couldn't join game."));
  });

  test("Reschedule button appears if", async () => {
    server.use(handlers.listGamesMasteredStarted.success);
    render(
      <WrappedGameList path={gameListUrl + "?my=1&status=started&mastered=1"} />
    );
    await waitFor(() => screen.getByText("Reschedule"));
  });
  test("Reschedule button does not appear if not game master", async () => {
    render(<WrappedGameList path={gameListUrl + "?status=staging"} />);
    const rescheduleButton = screen.queryByText("Reschedule");
    expect(rescheduleButton).toBeNull();
  });
  test("Reschedule button shows reschedule dialog", async () => {
    server.use(handlers.listGamesMasteredStarted.success);
    render(
      <WrappedGameList path={gameListUrl + "?my=1&status=started&mastered=1"} />
    );
    const button = await waitFor(() => screen.getByText("Reschedule"));
    fireEvent.click(button);
    await waitFor(() => screen.getByText("Reschedule game"));
  });
  test("Reschedule dialog causes gtag page load event", async () => {
    server.use(handlers.listGamesMasteredStarted.success);
    render(
      <WrappedGameList path={gameListUrl + "?my=1&status=started&mastered=1"} />
    );
    const button = await waitFor(() => screen.getByText("Reschedule"));
    gaEventSpy.mockClear();
    gaSetSpy.mockClear();
    fireEvent.click(button);
    await waitFor(() => screen.getByText("Reschedule game"));
    expect(gaSetSpy).toBeCalledWith({
      page_title: "RescheduleDialog",
      page_location: "/games?my=1&mastered=1&reschedule-dialog=game-123",
    });
    expect(gaEventSpy).toBeCalledWith({
      category: "(not set)",
      action: "page_view",
    });
  });
  test.todo("Reschedule dialog submit button submits new deadline");
  test.todo("Reschedule dialog submit button disables submit button");
  test.todo("Reschedule dialog submit button causes gtag event");
  test.todo("Reschedule dialog submit button loads games again");
  test.todo("Reschedule dialog submit button closes dialog");
  test.todo("Reschedule dialog close button closes dialog");
  test.todo("Reschedule submit shows errors when error");

  test.todo("Manage invitations button appears if");
  test.todo("Manage invitations button does not appear if");
  test.todo("Manage invitations button shows reschedule dialog");
  test.todo("Manage invitations dialog causes gtag page load event");
  test.todo("Manage invitations dialog invite button submits invite");
  test.todo("Manage invitations dialog invite button disables invite button");
  test.todo("Manage invitations dialog invite button causes gtag event");
  test.todo("Manage invitations dialog uninvite button submits uninvite");
  test.todo(
    "Manage invitations dialog uninvite button disables uninvite button"
  );
  test.todo("Manage invitations dialog uninvite button causes gtag event");
  test.todo("Manage invitations dialog close button closes dialog");
  test.todo("Manage invitations submit shows errors when error");

  test.todo("Rename button appears if");
  test.todo("Rename button does not appear if");
  test.todo("Rename button shows reschedule dialog");
  test.todo("Rename dialog causes gtag page load event");
  test.todo("Rename dialog submit button submits submit");
  test.todo("Rename dialog submit button disables submit button");
  test.todo("Rename dialog submit button causes gtag event");
  test.todo("Rename dialog close button closes dialog");
  test.todo("Rename submit shows errors when error");

  test.todo("Delete button appears if");
  test.todo("Delete button does not appear if");
  test.todo("Delete button deletes game");
  test.todo("Delete button causes gtag event");
  test.todo("Delete button disables delete button");
  test.todo("Delete shows errors when error");

  test.todo("Scroll to bottom of page triggers list request (infinite scroll)");

  test.todo("Create new game button appears");
  test.todo("Create new game button redirects to create new game page");
});
