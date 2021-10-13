import React from "react";

import {
  render,
  screen,
  waitFor,
  fireEvent,
  getByText,
} from "@testing-library/react";
import { generatePath, Router, Route, Switch } from "react-router";
import "@testing-library/jest-dom/extend-expect";
import { setupServer } from "msw/node";
import { createMemoryHistory, MemoryHistory } from "history";

import {
  createListPhasesHandler,
  createListPhaseStateHandler,
  handlers,
} from "../../mockService/handlers";
import { ReduxWrapper } from "../../store/testUtils";
import { RouteConfig } from "../../pages/RouteConfig";
import { diplicityServiceURL } from "../../store/service";
import { userSeesLoadingSpinner, userSeesPhaseSelector } from "./utils";
import {
  createListPhaseResponse,
  createPhase,
} from "../../mockService/data/listPhases";
import {
  createListPhaseStateResponse,
  createPhaseState,
} from "../../mockService/data/listPhaseStates";
import { Nations } from "../../mockService/data/base";
import Game from "../Game";

const server = setupServer(
  handlers.variants.successShort,
  handlers.getGame.success,
  handlers.listChannels.success,
  handlers.getUser.success,
  handlers.listPhases.success,
  handlers.listPhaseStates.success,
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
    <Router history={history}>
      <Switch>
        <Route path={RouteConfig.Game}>
          <ReduxWrapper>
            <Game />
          </ReduxWrapper>
        </Route>
      </Switch>
    </Router>
  );
};

const gameId = "game-1234";
const phaseId = "1";
const gameUrl = generatePath(RouteConfig.Game, { gameId });

describe("Game functional tests", () => {
  let fetchSpy: jest.SpyInstance;

  beforeEach(() => {
    fetchSpy = jest.spyOn(global, "fetch");
  });

  test("Shows loading spinner when loading", async () => {
    render(<WrappedGame path={gameUrl} />);
    await userSeesLoadingSpinner();
  });

  test("Hits endpoints correctly", async () => {});

  test("Renders page", async () => {});

  test("Shows map", async () => {});

  test("Shows turn nav", async () => {});

  test("Shows join button if game open to join", async () => {});

  test("Shows leave button if game open to join and joined", async () => {});

  test("Fires join game on click button", async () => {});

  test("Shows nation preference dialog", async () => {});

  test("Shows player count if open to join", async () => {});

  test("Doesn't show join button if game not open to join", async () => {});

  test("Doesn't show player count if game not open to join", async () => {});

  // TODO ready reminder
  // TODO work through old game and check for tests
});
