import { render } from "@testing-library/react";
import { generatePath, Router, Route, Switch } from "react-router-dom";
import "@testing-library/jest-dom/extend-expect";
import { setupServer } from "msw/node";
import { createMemoryHistory, MemoryHistory } from "history";

import { handlers } from "../../mockService/handlers";
import { ReduxWrapper } from "@diplicity/common";
import { RouteConfig } from "../../pages/RouteConfig";
import { userSeesLoadingSpinner } from "../testUtils";
import Game from "../Game";
import { ThemeProvider, StyledEngineProvider } from "@mui/material";
import theme from "../../theme";

const server = setupServer(
  handlers.variants.successShort,
  handlers.getGame.success,
  handlers.listChannels.success,
  handlers.getUser.success,
  handlers.listPhases.success,
  handlers.listPhaseStates.success,
  handlers.getVariantSVG.success,
  handlers.getVariantUnitSVG.success,
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

const WrappedGame = ({ path }: WrappedGameProps) => {
  history = createMemoryHistory();
  history.push(path || "/");
  return (
    <ThemeProvider theme={theme}>
      <StyledEngineProvider injectFirst>
        <Router history={history}>
          <Switch>
            <Route path={RouteConfig.Game}>
              <ReduxWrapper>
                <Game />
              </ReduxWrapper>
            </Route>
          </Switch>
        </Router>
      </StyledEngineProvider>
    </ThemeProvider>
  );
};

const gameId = "game-1234";
const gameUrl = generatePath(RouteConfig.Game, { gameId });

describe("Game functional tests", () => {

  beforeEach(() => {});

  test("Shows loading spinner when loading", async () => {
    render(<WrappedGame path={gameUrl} />);
    await userSeesLoadingSpinner();
  });

  test("Hits endpoints correctly", async () => {});

  test("Renders page", async () => {});

  test("Shows turn nav", async () => {});

  test("Shows join button if game open to join", async () => {});

  test("Shows leave button if game open to join and joined", async () => {});

  test("Fires join game on click button", async () => {});

  test("Shows nation preference dialog", async () => {});

  test("Shows player count if open to join", async () => {});

  test("Doesn't show join button if game not open to join", async () => {});

  test("Doesn't show player count if game not open to join", async () => {});

  test.todo("Shows map");
  test.todo("Shows army");
  test.todo("Shows fleet");
  test.todo("Shows move");
  test.todo("Shows hold");
  test.todo("Shows support");
  test.todo("Shows convoy");

  // TODO ready reminder
  // TODO work through old game and check for tests
});
