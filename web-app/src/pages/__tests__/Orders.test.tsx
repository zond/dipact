import React from "react";

import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { generatePath, Router, Route, Switch } from "react-router";
import "@testing-library/jest-dom/extend-expect";
import { setupServer } from "msw/node";
import { createMemoryHistory, MemoryHistory } from "history";

import { handlers } from "../../mockService/handlers";
import { ReduxWrapper } from "../../store/testUtils";
import { RouteConfig } from "../../pages/RouteConfig";
import { diplicityServiceURL } from "../../store/service";
import { EVERYONE } from "../../hooks/utils";
import Orders from "../Orders";
import {
  userSeesInternalServerErrorMessage,
  userSeesLoadingSpinner,
} from "./utils";

const server = setupServer(
  handlers.variants.successShort,
  handlers.getGame.success,
  handlers.listChannels.success,
  handlers.getUser.success
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

interface WrappedOrdersProps {
  path?: string;
}

let history: MemoryHistory<unknown>;

const WrappedOrders = ({ path }: WrappedOrdersProps) => {
  history = createMemoryHistory();
  history.push(path || "/");
  return (
    <Router history={history}>
      <Switch>
        <Route path={RouteConfig.Game}>
          <ReduxWrapper>
            <Orders />
          </ReduxWrapper>
        </Route>
      </Switch>
    </Router>
  );
};

const gameId = "game-1234";
const ordersUrl = generatePath(RouteConfig.Orders, { gameId });

describe("Orders functional tests", () => {
  let fetchSpy: jest.SpyInstance;

  beforeEach(() => {
    fetchSpy = jest.spyOn(global, "fetch");
  });

  test("Shows loading spinner when loading", async () => {
    render(<WrappedOrders path={ordersUrl} />);
    await userSeesLoadingSpinner();
  });

  test("Hits endpoints correctly", async () => {
    render(<WrappedOrders path={ordersUrl} />);
    await userSeesLoadingSpinner();
    // const [firstCall, secondCall, thirdCall, fourthCall] =
    //   fetchSpy.mock.calls.map((call) => call[0] as Request);
    // expect(fetchSpy.mock.calls.length).toBe(4);
    // expect(firstCall.url).toBe(`${diplicityServiceURL}Variants`);
    // expect(secondCall.url).toBe(`${diplicityServiceURL}User`);
    // expect(thirdCall.url).toBe(`${diplicityServiceURL}Game/${gameId}`);
    // expect(fourthCall.url).toBe(
    //   `${diplicityServiceURL}Game/${gameId}/Channels`
    // );
  });

  test("Renders page", async () => {});

  test("Shows nation status for each nation in variant", async () => {});

  test("Nation status includes supply centers", async () => {});

  test("Nation status includes num supply centers to win for user", async () => {});

  test("Nation status includes avatar", async () => {});

  test("Nation status includes nation name", async () => {});

  test("Nation status does not include num supply centers to win for non user", async () => {});

  test("Nation status shows 0 builds when no builds or disbands", async () => {});

  test("Nation status shows num builds when builds", async () => {});

  test("Nation status shows num disbands when disbands", async () => {});

  test("Nation status does not include num orders on previous turn", async () => {});

  test("Nation status includes num builds/disbands on previous turn", async () => {});

  test("Nation status includes num supply centers on previous turn", async () => {});

  test("Shows (You) beside player's nation", async () => {});

  test("Shows accept draw button", async () => {});

  test("Accept draw button is checked if true", async () => {});

  test("Clicking accept draw creates request", async () => {});

  test("Clicking accept draw fetches updated state", async () => {});

  test("Shows orders confirmed icon when orders confirmed", async () => {});

  test("Shows orders confirmed icon when no orders to give", async () => {});

  test("Shows confirm orders button", async () => {});

  test("Confirm orders button is checked if orders are confirmed", async () => {});

  test("Confirm orders button is checked if no orders to give", async () => {});

  test("Message appears if no orders to give", async () => {});

  test("Shows turn navigator", async () => {});

  test("Turn navigator lists each turn that has happened", async () => {});

  test("Back button on turn navigator shows previous turn", async () => {});

  test("Next button on turn navigator shows next turn", async () => {});

  test("Selecting specific turn shows that turn", async () => {});

  test("Shows order outcome for moves on previous turn", async () => {});

  test("Shows confirmed orders icon for each nation on previous turn", async () => {});

  test("Shows text for move", async () => {});

  test("Shows success for successful move", async () => {});

  test("Shows bounce message correctly", async () => {});

  test("Shows support broken message correctly", async () => {});

  test("Shows prompt message when user has not given order", async () => {});

  test("Shows No order message when user did not give order in previous turn", async () => {});

  test("Shows No order icon for other user when user did not give order in previous turn", async () => {});

  test("Shows Wants a draw icon when user wants a draw", async () => {});
});
