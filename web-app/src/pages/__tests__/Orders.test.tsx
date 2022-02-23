import React from "react";

import {
  render,
  screen,
  waitFor,
  fireEvent,
  getByText,
  getByTestId,
} from "@testing-library/react";
import { generatePath, Router, Route, Switch } from "react-router-dom";
import "@testing-library/jest-dom/extend-expect";
import { setupServer } from "msw/node";
import { createMemoryHistory, MemoryHistory } from "history";

import {
  createListPhasesHandler,
  createListPhaseStateHandler,
  handlers,
} from "../../mockService/handlers";
import { diplicityServiceURL, ReduxWrapper } from "@diplicity/common";
import { RouteConfig } from "../../pages/RouteConfig";
import Orders from "../Orders";
import { userSeesLoadingSpinner, userSeesPhaseSelector } from "../testUtils";
import {
  createListPhaseResponse,
  createPhase,
} from "../../mockService/data/listPhases";
import {
  createListPhaseStateResponse,
  createPhaseState,
} from "../../mockService/data/listPhaseStates";
import { ThemeProvider, StyledEngineProvider } from "@mui/material";
import theme from "../../theme";
import { translateKeys as tk } from "@diplicity/common";

const server = setupServer(
  handlers.variants.successShort,
  handlers.getGame.success,
  handlers.listChannels.success,
  handlers.getUser.success,
  handlers.listPhases.success,
  handlers.listPhaseStates.success,
  handlers.updatePhaseState.success
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
            <StyledEngineProvider injectFirst>
              <ThemeProvider theme={theme}>
                <Orders />
              </ThemeProvider>
            </StyledEngineProvider>
          </ReduxWrapper>
        </Route>
      </Switch>
    </Router>
  );
};

const gameId = "game-1234";
const phaseId = "1";
const ordersUrl = generatePath(RouteConfig.Orders, { gameId });

const getSummaryForNation = (nation: string) => {
  const summary = screen.getByTitle(`${nation} summary`);
  return summary;
};

const getAcceptDrawButton = () => {
  const button = screen.getByText(tk.orders.toggleDiasButton.label);
  return button;
};

const getNextPhaseButton = () => screen.getByTitle(tk.phaseSelector.nextButton.title);

const getAcceptDrawCheckbox = () => screen.getByLabelText(tk.orders.toggleDiasButton.label);

const userSeesAcceptDrawButton = () => getAcceptDrawButton();

const getConfirmOrdersButton = () => screen.getByText(tk.orders.confirmOrdersButton.label);
const getOrdersConfirmedIcon = (element: HTMLElement) => getByTestId(element, "CheckBoxIcon");
const getOrdersNotConfirmedIcon = (element: HTMLElement) => getByTestId(element, "CheckBoxOutlineBlankIcon");
const userSeesConfirmOrdersButton = () => getConfirmOrdersButton();

const supplyCentersMap = {
  vie: {
    Province: "vie",
    Owner: "Austria",
  },
  tri: {
    Province: "tri",
    Owner: "Austria",
  },
};

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
    const [
      firstCall,
      secondCall,
      thirdCall,
      fourthCall,
    ] = fetchSpy.mock.calls.map((call) => call[0] as Request);
    expect(firstCall.url).toBe(`${diplicityServiceURL}Variants`);
    expect(secondCall.url).toBe(`${diplicityServiceURL}Game/${gameId}/Phases`);
    expect(thirdCall.url).toBe(`${diplicityServiceURL}`);
    expect(fourthCall.url).toBe(`${diplicityServiceURL}Game/${gameId}`);

    await userSeesPhaseSelector();
    expect(fetchSpy.mock.calls.length).toBe(5);
    const fifthCall = fetchSpy.mock.calls[4][0] as Request;
    expect(fifthCall.url).toBe(
      `${diplicityServiceURL}Game/${gameId}/Phase/${phaseId}/PhaseStates`
    );
  });

  test("Renders page", async () => {
    render(<WrappedOrders path={ordersUrl} />);
    await userSeesLoadingSpinner();
    await userSeesPhaseSelector();
  });

  // test("Shows nation status for each nation in variant", async () => {
  //   render(<WrappedOrders path={ordersUrl} />);
  //   await userSeesLoadingSpinner();
  //   await userSeesPhaseSelector();
  //   const nations = [
  //     "Austria",
  //     "England",
  //     "France",
  //     "Germany",
  //     "Italy",
  //     "Russia",
  //     "Turkey",
  //   ];
  //   nations.forEach((nation) => {
  //     screen.getByAltText(nation);
  //   });
  // });

  test("Nation status includes supply centers", async () => {
    const supplyCenters = [supplyCentersMap.tri];
    const phaseResponse = createPhase(
      gameId,
      1,
      "Spring",
      1901,
      "Movement",
      true,
      supplyCenters
    );
    const listPhaseResponse = createListPhaseResponse([phaseResponse]);
    const listPhaseHandler = createListPhasesHandler(listPhaseResponse, 200);
    server.use(listPhaseHandler);
    render(<WrappedOrders path={ordersUrl} />);
    await userSeesLoadingSpinner();
    await userSeesPhaseSelector();
    const summary = getSummaryForNation("Austria");
    getByText(summary, tk.orders.supplyCenterCount.singular, { exact: false });
  });

  test("Supply centers pluralized when multiple", async () => {
    const supplyCenters = [supplyCentersMap.tri, supplyCentersMap.vie];
    const phaseResponse = createPhase(
      gameId,
      1,
      "Spring",
      1901,
      "Movement",
      true,
      supplyCenters
    );
    const listPhaseResponse = createListPhaseResponse([phaseResponse]);
    const listPhaseHandler = createListPhasesHandler(listPhaseResponse, 200);
    server.use(listPhaseHandler);
    render(<WrappedOrders path={ordersUrl} />);
    await userSeesLoadingSpinner();
    await userSeesPhaseSelector();
    const summary = getSummaryForNation("Austria");
    getByText(summary, tk.orders.supplyCenterCount.plural, { exact: false });
  });

  test("Nation status includes num supply centers to win for user", async () => {
    render(<WrappedOrders path={ordersUrl} />);
    await userSeesLoadingSpinner();
    await userSeesPhaseSelector();
    const summary = getSummaryForNation("Austria");
    getByText(summary, "18 to win", { exact: false });
  });

  test("Nation status shows 0 builds when no builds or disbands", async () => {
    const messages = "MayBuild:0";

    const phaseStateResponse = createPhaseState(
      gameId,
      1,
      "Austria", // TODO remove hardcoding
      { messages }
    );
    const listPhaseStateResponse = createListPhaseStateResponse([
      phaseStateResponse,
    ]);
    const listPhaseStateHandler = createListPhaseStateHandler(
      listPhaseStateResponse,
      200
    );
    server.use(listPhaseStateHandler);

    render(<WrappedOrders path={ordersUrl} />);
    await userSeesLoadingSpinner();
    await userSeesPhaseSelector();
    const summary = getSummaryForNation("Austria");
    getByText(summary, tk.orders.buildCount.plural, { exact: false });
  });

  test("Nation status shows num builds when builds", async () => {
    const messages = "MayBuild:1";

    const phaseStateResponse = createPhaseState(
      gameId,
      1,
      "Austria", // TODO remove hardcoding
      { messages }
    );
    const listPhaseStateResponse = createListPhaseStateResponse([
      phaseStateResponse,
    ]);
    const listPhaseStateHandler = createListPhaseStateHandler(
      listPhaseStateResponse,
      200
    );
    server.use(listPhaseStateHandler);

    render(<WrappedOrders path={ordersUrl} />);
    await userSeesLoadingSpinner();
    await userSeesPhaseSelector();
    const summary = getSummaryForNation("Austria");
    getByText(summary, tk.orders.buildCount.singular, { exact: false });
  });

  test("Nation status shows num disbands when disbands", async () => {
    const messages = "MustDisband:1";

    const phaseStateResponse = createPhaseState(
      gameId,
      1,
      "Austria", // TODO remove hardcoding
      { messages }
    );
    const listPhaseStateResponse = createListPhaseStateResponse([
      phaseStateResponse,
    ]);
    const listPhaseStateHandler = createListPhaseStateHandler(
      listPhaseStateResponse,
      200
    );
    server.use(listPhaseStateHandler);

    render(<WrappedOrders path={ordersUrl} />);
    await userSeesLoadingSpinner();
    await userSeesPhaseSelector();
    const summary = getSummaryForNation("Austria");
    getByText(summary, tk.orders.disbandCount.singular, { exact: false });
  });

  test("Shows (You) beside player's nation", async () => {
    render(<WrappedOrders path={ordersUrl} />);
    await userSeesLoadingSpinner();
    await userSeesPhaseSelector();
    const summary = getSummaryForNation("Austria");
    getByText(summary, "Austria (You)", { exact: false });
  });

  test("Shows accept draw button", async () => {
    render(<WrappedOrders path={ordersUrl} />);
    await userSeesLoadingSpinner();
    await userSeesPhaseSelector();
    await userSeesAcceptDrawButton();
  });

  test("Accept draw button is not checked if false", async () => {
    render(<WrappedOrders path={ordersUrl} />);
    await userSeesLoadingSpinner();
    await userSeesPhaseSelector();
    const checkbox = await getAcceptDrawCheckbox();
    expect(checkbox).not.toHaveAttribute("checked");
  });

  test("Accept draw button is checked if true", async () => {
    const phaseStateResponse = createPhaseState(
      gameId,
      1,
      "Austria", // TODO remove hardcoding
      { wantsDraw: true }
    );
    const listPhaseStateResponse = createListPhaseStateResponse([
      phaseStateResponse,
    ]);
    const listPhaseStateHandler = createListPhaseStateHandler(
      listPhaseStateResponse,
      200
    );
    server.use(listPhaseStateHandler);
    render(<WrappedOrders path={ordersUrl} />);
    await userSeesLoadingSpinner();
    await userSeesPhaseSelector();
    const checkbox = await getAcceptDrawCheckbox();
    expect(checkbox).toHaveAttribute("checked");
  });

  test("Accept draw button does not appear for old phase", async () => {});

  test("Clicking accept draw disables button", async () => {
    render(<WrappedOrders path={ordersUrl} />);
    await userSeesLoadingSpinner();
    await userSeesPhaseSelector();
    const checkbox = await getAcceptDrawCheckbox();
    fireEvent.click(checkbox);
    expect(checkbox).toHaveAttribute("disabled");
    await waitFor(() => expect(checkbox).not.toBeDisabled());
  });

  // test("Clicking accept draw creates request", async () => {
  //   render(<WrappedOrders path={ordersUrl} />);
  //   await userSeesLoadingSpinner();
  //   await userSeesPhaseSelector();

  //   fetchSpy.mockReset();

  //   const checkbox = await getAcceptDrawCheckbox();
  //   fireEvent.click(checkbox);
  //   expect(checkbox).toHaveAttribute("disabled");
  //   await waitFor(() => expect(checkbox).not.toBeDisabled());

  //   const [call] = fetchSpy.mock.calls.map((call) => call[0] as Request);
  //   expect(call.url).toBe(
  //     `${diplicityServiceURL}Game/${gameId}/Phase/${phaseId}/PhaseState`
  //   );
  //   expect(call.method).toBe("PUT");
  // });

  // test("Clicking accept draw fetches updated state", async () => {
  //   render(<WrappedOrders path={ordersUrl} />);
  //   await userSeesLoadingSpinner();
  //   await userSeesPhaseSelector();

  //   fetchSpy.mockReset();

  //   const checkbox = await getAcceptDrawCheckbox();
  //   fireEvent.click(checkbox);
  //   await waitFor(() => expect(checkbox).not.toBeDisabled());

  //   const call = fetchSpy.mock.calls.map((call) => call[0] as Request)[2];
  //   expect(call.url).toBe(
  //     `${diplicityServiceURL}Game/${gameId}/Phase/${phaseId}/PhaseStates`
  //   );
  //   expect(call.method).toBe("GET");
  // });

  test("Shows confirm orders button", async () => {
    render(<WrappedOrders path={ordersUrl} />);
    await userSeesLoadingSpinner();
    await userSeesPhaseSelector();
    await userSeesConfirmOrdersButton();
  });

  test("Shows orders confirmed icon when orders confirmed", async () => {});

  test("Shows orders confirmed icon when no orders to give", async () => {});

  test("Confirm orders button is not checked if orders are not confirmed", async () => {
    const phaseStateResponse = createPhaseState(
      gameId,
      1,
      "Austria" // TODO remove hardcoding
    );
    const listPhaseStateResponse = createListPhaseStateResponse([
      phaseStateResponse,
    ]);
    const listPhaseStateHandler = createListPhaseStateHandler(
      listPhaseStateResponse,
      200
    );
    server.use(listPhaseStateHandler);
    render(<WrappedOrders path={ordersUrl} />);
    await userSeesLoadingSpinner();
    await userSeesPhaseSelector();
    const confirmOrdersButton = userSeesConfirmOrdersButton();
    await getOrdersNotConfirmedIcon(confirmOrdersButton);
  });

  test("Confirm orders button is checked if orders are confirmed", async () => {
    const phaseStateResponse = createPhaseState(
      gameId,
      1,
      "Austria", // TODO remove hardcoding
      { ordersConfirmed: true }
    );
    const listPhaseStateResponse = createListPhaseStateResponse([
      phaseStateResponse,
    ]);
    const listPhaseStateHandler = createListPhaseStateHandler(
      listPhaseStateResponse,
      200
    );
    server.use(listPhaseStateHandler);
    render(<WrappedOrders path={ordersUrl} />);
    await userSeesLoadingSpinner();
    await userSeesPhaseSelector();
    const confirmOrdersButton = userSeesConfirmOrdersButton();
    await getOrdersConfirmedIcon(confirmOrdersButton);
  });

  test("Confirm orders button is checked if no orders to give", async () => {
    const phaseStateResponse = createPhaseState(
      gameId,
      1,
      "Austria", // TODO remove hardcoding
      { noOrders: true }
    );
    const listPhaseStateResponse = createListPhaseStateResponse([
      phaseStateResponse,
    ]);
    const listPhaseStateHandler = createListPhaseStateHandler(
      listPhaseStateResponse,
      200
    );
    server.use(listPhaseStateHandler);
    render(<WrappedOrders path={ordersUrl} />);
    await userSeesLoadingSpinner();
    await userSeesPhaseSelector();
    const confirmOrdersButton = userSeesConfirmOrdersButton();
    await getOrdersConfirmedIcon(confirmOrdersButton);
  });

  test("Message appears if orders to give", async () => {
    render(<WrappedOrders path={ordersUrl} />);
    await userSeesLoadingSpinner();
    await userSeesPhaseSelector();

    screen.getByText(tk.orders.confirmOrdersButton.prompt);
  });

  test("Message appears if no orders to give", async () => {
    const phaseStateResponse = createPhaseState(
      gameId,
      1,
      "Austria", // TODO remove hardcoding
      { noOrders: true }
    );
    const listPhaseStateResponse = createListPhaseStateResponse([
      phaseStateResponse,
    ]);
    const listPhaseStateHandler = createListPhaseStateHandler(
      listPhaseStateResponse,
      200
    );
    server.use(listPhaseStateHandler);
    render(<WrappedOrders path={ordersUrl} />);
    await userSeesLoadingSpinner();
    await userSeesPhaseSelector();

    screen.getByText(tk.orders.confirmOrdersButton.noOrders);
  });

  test("Shows turn navigator", async () => {
    render(<WrappedOrders path={ordersUrl} />);
    await userSeesLoadingSpinner();
    await userSeesPhaseSelector();
  });

  // test("Turn navigator lists each turn that has happened", async () => {
  //   const phase_1 = createPhase(
  //     gameId,
  //     1,
  //     "Spring",
  //     1901,
  //     "Movement",
  //     true,
  //   );
  //   const phase_2 = createPhase(
  //     gameId,
  //     2,
  //     "Spring",
  //     1901,
  //     "Retreat",
  //     false,
  //   );
  //   const listPhaseResponse = createListPhaseResponse([phase_1, phase_2]);
  //   const listPhaseHandler = createListPhasesHandler(listPhaseResponse, 200);
  //   server.use(listPhaseHandler);

  //   render(<WrappedOrders path={ordersUrl} />);
  //   await userSeesLoadingSpinner();
  //   await userSeesPhaseSelector();
  // });

  test("Phase selector forward button disabled when no next turn", async () => {
    render(<WrappedOrders path={ordersUrl} />);
    await userSeesLoadingSpinner();
    await userSeesPhaseSelector();
    const nextPhaseButton = getNextPhaseButton();
    expect(nextPhaseButton).toHaveAttribute("disabled");
  });

  test("Phase selector backwards button disabled when no previous turn", async () => {
    render(<WrappedOrders path={ordersUrl} />);
    await userSeesLoadingSpinner();
    await userSeesPhaseSelector();
    const nextPhaseButton = getNextPhaseButton();
    expect(nextPhaseButton).toHaveAttribute("disabled");
  });

  test.todo("Phase selector forward button enabled when next turn");
  // , async () => {
  //   const phase_1 = createPhase(
  //     gameId,
  //     1,
  //     "Spring",
  //     1901,
  //     "Movement",
  //     true,
  //   );
  //   const phase_2 = createPhase(
  //     gameId,
  //     2,
  //     "Spring",
  //     1901,
  //     "Retreat",
  //     false,
  //   );
  //   const listPhaseResponse = createListPhaseResponse([phase_1, phase_2]);
  //   const listPhaseHandler = createListPhasesHandler(listPhaseResponse, 200);
  //   server.use(listPhaseHandler);

  //   const listPhaseStateResponse = createListPhaseStateResponse([
  //     createPhaseState(gameId, 2, Nations.standard.Austria),
  //     createPhaseState(gameId, 2, Nations.standard.England),
  //     createPhaseState(gameId, 2, Nations.standard.France),
  //     createPhaseState(gameId, 2, Nations.standard.Germany),
  //     createPhaseState(gameId, 2, Nations.standard.Italy),
  //     createPhaseState(gameId, 2, Nations.standard.Russia),
  //     createPhaseState(gameId, 2, Nations.standard.Turkey),
  //   ]);
  //   const listPhaseStateHandler = createListPhaseStateHandler(
  //     listPhaseStateResponse,
  //     200
  //   );
  //   server.use(listPhaseStateHandler);

  //   render(<WrappedOrders path={ordersUrl} />);
  //   await userSeesLoadingSpinner();
  //   await userSeesPhaseSelector();

  //   const nextPhaseButton = getNextPhaseButton();
  //   expect(nextPhaseButton).not.toHaveAttribute("disabled");

  //   const previousPhaseButton = getPreviousPhaseButton();
  //   expect(previousPhaseButton).toHaveAttribute("disabled");
  // });

  test("Phase selector backwards button enabled when previous turn", async () => {});

  test("Back button on turn navigator shows previous turn", async () => {});

  test("Next button on turn navigator shows next turn", async () => {});

  test("Selecting specific turn shows that turn", async () => {});

  test("Shows order outcome for moves on previous turn", async () => {});

  test("Shows confirmed orders icon for each nation on previous turn", async () => {});

  test("Shows text for move", async () => {
    render(<WrappedOrders path={ordersUrl + "?phase=1"} />);
    await userSeesLoadingSpinner();
    await userSeesPhaseSelector();
    const summary = getSummaryForNation("Austria");
    getByText(summary, "18 to win", { exact: false });
  });

  test("Shows success for successful move", async () => {});

  test("Shows bounce message correctly", async () => {});

  test("Shows support broken message correctly", async () => {});

  test("Shows prompt message when user has not given order", async () => {});

  test("Shows No order message when user did not give order in previous turn", async () => {});

  test("Shows No order icon for other user when user did not give order in previous turn", async () => {});

  test("Shows Wants a draw icon when user wants a draw", async () => {});
});
