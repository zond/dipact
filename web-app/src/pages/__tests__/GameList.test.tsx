import React from "react";
import {
  render,
  screen,
  waitFor,
  fireEvent,
  getByText,
  getByDisplayValue,
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

const server = setupServer(
  handlers.listGamesStarted.success,
  handlers.listGamesStaging.success,
  handlers.listGamesFinished.success
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
              <ReduxWrapper>
                <GameList />
              </ReduxWrapper>
            </Route>
          </Switch>
        </Router>
      </StyledEngineProvider>
    </ThemeProvider>
  );
};

const gameId = "game-1234";
const phaseId = "1";
const gameListUrl = generatePath(RouteConfig.GameList);

const getTab = async (name: string, options?: any) => {
  return await waitFor(() => screen.getByRole("tab", { name, ...options }));
};

const setStatus = async (status: string) => {
  const select = await waitFor(() => screen.getByTestId("status-select"));
  const actualSelect = select.childNodes[0].childNodes[0];
  fireEvent.change(actualSelect, { target: { value: status } });
};

describe("Game functional tests", () => {
  let fetchSpy: jest.SpyInstance;

  beforeEach(() => {
    fetchSpy = jest.spyOn(global, "fetch");
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
    await waitFor(() => screen.getByText("Western World 901 1d"));
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

  test("Failed requirements disables join button", async () => {
    server.use(handlers.listGamesStarted.successFailedRequirements);
    render(<WrappedGameList path={gameListUrl} />);
    const button = await waitFor(() => screen.getByText("Join"));
    expect(button).toHaveAttribute("disabled");
  });

  test.todo("View game button is <a> tag");
  test.todo("View game button links to game");

  test.todo("Invite button copies link to clipboard");

  test.todo(
    "Join button opens nation preferences dialog if nation selection is preference"
  );
  test.todo("Join button disables join button while loading");
  test.todo("Join button shows errors when error");

  test.todo("Nation preference dialog causes gtag page load event");
  test.todo("Nation preference dialog loads nations for game");
  test.todo("Nation preference dialog up button works");
  test.todo("Nation preference dialog down button works");
  test.todo("Nation preference dialog submit button disables submit button");
  test.todo("Nation preference dialog submit button submits sorted nations");
  test.todo("Nation preference dialog submit button causes gtag event");
  test.todo("Nation preference dialog submission closes dialog");
  test.todo("Nation preference dialog submission loads games again");
  test.todo("Nation preference dialog close button closes dialog");
  test.todo("Nation preference dialog submit button shows errors when error");

  test.todo("Reschedule button appears if");
  test.todo("Reschedule button does not appear if");
  test.todo("Reschedule button shows reschedule dialog");
  test.todo("Reschedule dialog causes gtag page load event");
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
