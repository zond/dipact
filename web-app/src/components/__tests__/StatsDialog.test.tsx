import { Router, Route, Switch } from "react-router-dom";
import "@testing-library/jest-dom/extend-expect";
import { setupServer } from "msw/node";
import { createMemoryHistory, MemoryHistory } from "history";

import { ReduxWrapper } from "../../store/testUtils";
import { RouteConfig } from "../../pages/RouteConfig";
import { ThemeProvider, StyledEngineProvider } from "@mui/material";
import theme from "../../theme";
import StatsDialog from "../StatsDialog";

const server = setupServer();

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

interface WrappedStatsDialogProps {
  path?: string;
}

let history: MemoryHistory<unknown>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const WrappedStatsDialog = ({ path }: WrappedStatsDialogProps) => {
  history = createMemoryHistory();
  history.push(path || "/");
  return (
    <ThemeProvider theme={theme}>
      <StyledEngineProvider injectFirst>
        <Router history={history}>
          <Switch>
            <Route path={RouteConfig.GameList}>
              <ReduxWrapper>
                <StatsDialog />
              </ReduxWrapper>
            </Route>
          </Switch>
        </Router>
      </StyledEngineProvider>
    </ThemeProvider>
  );
};

describe("Stats dialog functional tests", () => {
  beforeEach(() => {});
  test.todo("Hits endpoints correctly on load");
  test.todo("Hits endpoints correctly on load if game");
  test.todo("Closed when no user-stats param");
  test.todo("Shows loading spinner when loading");
  test.todo("Shows error when error");
  test.todo("Shows stats")
  test.todo("If not game mute does not appear")
  test.todo("If game shows playing as")
  test.todo("If banned, checkbox is checked")
  test.todo("If muted, checkbox is checked")
  test.todo("If is current user ban is disabled")
  test.todo("If is current user and game ban and mute are disabled")
  test.todo("Clicking ban button disables ban button")
  test.todo("Clicking ban hits endpoint correctly");
  test.todo("Successful ban shows success message")
  test.todo("Unsuccessful shows error message")
  test.todo("Clicking mute button disables mute button")
  test.todo("Clicking mute hits endpoint correctly");
  test.todo("Successful mute shows success message")
  test.todo("Unsuccessful mute shows error message")
});
