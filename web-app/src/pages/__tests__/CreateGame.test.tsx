import React from "react";
import {
  render,
  screen,
  waitFor,
  fireEvent,

} from "@testing-library/react";
import { diplicityServiceURL } from "../../store/service";

import { generatePath, Router, Route, Switch } from "react-router";
import "@testing-library/jest-dom/extend-expect";
import { setupServer } from "msw/node";
import { createMemoryHistory, MemoryHistory } from "history";
import { ThemeProvider, StyledEngineProvider } from "@mui/material";

import { handlers } from "../../mockService/handlers";
import { RouteConfig } from "../../pages/RouteConfig";
import { userSeesLoadingSpinner } from "../testUtils";
import CreateGame from "../CreateGame";
import theme from "../../theme";
import FeedbackWrapper from "../../components/FeedbackWrapper";
import { Provider } from "react-redux";
import { createTestStore } from "../../store";
import ReactGA from "react-ga";
import tk from "../../translations/translateKeys";

const server = setupServer(
  handlers.getUser.success,
  handlers.variants.successShort,
  handlers.getUserStats.successEmpty,
  handlers.getVariantSVG.success
);

const randomGameName = "Random game name";

jest.mock("../../helpers", () => ({
  ...jest.requireActual("../../helpers"),
  randomGameName: () => randomGameName,
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({t: (key: string) => key})
}));

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
            <Route path={RouteConfig.CreateGame}>
              <Provider store={createTestStore()}>
                <FeedbackWrapper>
                  <CreateGame />
                </FeedbackWrapper>
              </Provider>
            </Route>
          </Switch>
        </Router>
      </StyledEngineProvider>
    </ThemeProvider>
  );
};

const createGameUrl = generatePath(RouteConfig.CreateGame);
const userId = "123456789";

const renderPage = async (path: string) => {
  render(<WrappedGameList path={createGameUrl} />);
  await userSeesLoadingSpinner();
};

// TODO use in other tests
const pageLoadGAEventHappens = (
  gaSetSpy: jest.SpyInstance,
  gaEventSpy: jest.SpyInstance,
  title: string
) => {
  expect(gaSetSpy).toBeCalledWith({
    page_title: title,
    page_location: "http://localhost/",
  });
  expect(gaEventSpy).toBeCalledWith({
    category: "(not set)",
    action: "page_view",
  });
};

describe("Create game functional tests", () => {
  let fetchSpy: jest.SpyInstance;
  let gaEventSpy: jest.SpyInstance;
  let gaSetSpy: jest.SpyInstance;

  beforeEach(() => {
    fetchSpy = jest.spyOn(global, "fetch");
    gaEventSpy = jest.spyOn(ReactGA, "event");
    gaSetSpy = jest.spyOn(ReactGA, "set");
  });

  test("Renders", async () => {
    await renderPage(createGameUrl);
  });

  test("Page load causes ga event", async () => {
    await renderPage(createGameUrl);
    await waitFor(() => screen.getByLabelText(tk.createGame.nameInput.label));
    pageLoadGAEventHappens(gaSetSpy, gaEventSpy, "CreateGame");
  });

  test("Hits endpoints correctly", async () => {
    await renderPage(createGameUrl);
    await waitFor(() => screen.getByLabelText(tk.createGame.nameInput.label));
    const calls = fetchSpy.mock.calls.map((call) => call[0] as Request);
    expect(
      calls.find((call) => call.url === `${diplicityServiceURL}`)
    ).toBeTruthy();
    expect(
      calls.find((call) => call.url === `${diplicityServiceURL}Variants`)
    ).toBeTruthy();
    expect(
      calls.find(
        (call) => call.url === `${diplicityServiceURL}User/${userId}/Stats`
      )
    ).toBeTruthy();
    expect(
      calls.find(
        (call) => call.url === `${diplicityServiceURL}Variant/Classical/Map.svg`
      )
    ).toBeTruthy();
  });

  test("Name input has random name by default", async () => {
    await renderPage(createGameUrl);
    await waitFor(() => screen.getByLabelText(tk.createGame.nameInput.label));
    await waitFor(() => screen.getByDisplayValue(randomGameName));
  });

  test("Clicking randomize button creates new random name", async () => {
    await renderPage(createGameUrl);
    await waitFor(() => screen.getByLabelText(tk.createGame.nameInput.label));
    await waitFor(() => screen.getByDisplayValue(randomGameName));
    const input = screen.getByLabelText(tk.createGame.nameInput.label);
    const button = screen.getByTitle(tk.createGame.randomizeGameNameButton.title);
    fireEvent.change(input, { target: { value: "Some string" } });
    await waitFor(() => screen.getByDisplayValue("Some string"));
    fireEvent.click(button);
    await waitFor(() => screen.getByDisplayValue(randomGameName));
  });

  test("Private unchecked by default", async () => {
    await renderPage(createGameUrl);
    const checkbox = (await waitFor(() =>
      screen.getByLabelText(tk.createGame.privateCheckbox.label)
    )) as HTMLInputElement;
    expect(checkbox.checked).toBe(false);
  });

  test("Game master help text when not private", async () => {
    await renderPage(createGameUrl);
    await waitFor(() =>
      screen.getByText(tk.createGame.gameMasterCheckbox.helpText.disabled)
    );
  });

  test("Game master help text when private", async () => {
    await renderPage(createGameUrl);
    const checkbox = (await waitFor(() =>
      screen.getByLabelText(tk.createGame.privateCheckbox.label)
    )) as HTMLInputElement;
    fireEvent.click(checkbox);
    await waitFor(() =>
      screen.getByText(tk.createGame.gameMasterCheckbox.helpText.default)
    );
  });

  test("Variant section shows description, image, start year, author, rules", async () => {
    await renderPage(createGameUrl);
    await waitFor(() => screen.getByText("The original Diplomacy."));
    await waitFor(() => screen.getByText("1901"));
    await waitFor(() => screen.getByText("Allan B. Calhamer"));
    await waitFor(() =>
      screen.getByText("The first to 18 Supply Centers", { exact: false })
    );
  });

  test("Variant select shows different variant", async () => {
    await renderPage(createGameUrl);
    const select = await waitFor(() =>
      screen.getByLabelText(tk.createGame.variantSelect.label)
    );
    fireEvent.change(select, { target: { value: "Twenty Twenty" } });
    await waitFor(() => screen.getByText("TTTPPP"));
  });

  test("Changing variant select shows loading spinner", async () => {
    await renderPage(createGameUrl);
    const select = await waitFor(() =>
      screen.getByLabelText(tk.createGame.variantSelect.label)
    );
    fireEvent.change(select, { target: { value: "Twenty Twenty" } });
    await waitFor(() => screen.getByRole("progressbar"));
  });

  test.todo("Changing variant select disables submit button while loading");
  // test("Changing variant select disables submit button while loading", async () => {
  //   await renderPage(createGameUrl);
  //   const select = await waitFor(() =>
  //     screen.getByLabelText(tk.CreateGameVariantSelectLabel)
  //   );
  //   fireEvent.change(select, { target: { value: "Twenty Twenty" } });
  //   const button = await waitFor(() =>
  //     screen.getByText(tk.CreateGameSubmitButtonLabel)
  //   );
  //   await waitFor(() => screen.getByRole("progressbar"));
  //   expect(button).toHaveAttribute("disabled");
  // });

  test("Nation selection options appear", async () => {
    await renderPage(createGameUrl);
    await waitFor(() =>
      screen.getByLabelText(tk.nationAllocationOptions.random)
    );
    await waitFor(() =>
      screen.getByLabelText(tk.nationAllocationOptions.preference)
    );
  });

  test("Nation selection random is default", async () => {
    await renderPage(createGameUrl);
    const randomOption = await waitFor(() =>
      screen.getByLabelText(tk.nationAllocationOptions.random)
    );
    expect(randomOption).toHaveAttribute("checked");
  });

  test("Game length value defaults to 1", async () => {
    await renderPage(createGameUrl);
    const phaseLengthMultiplierInput = (await waitFor(() =>
      screen.getByLabelText(tk.createGame.phaseLengthMultiplierInput.label)
    )) as HTMLInputElement;
    expect(phaseLengthMultiplierInput.value).toBe("1");
  });

  test.todo("Game length unit defaults to hour");
  // test("Game length unit defaults to hour", async () => {
  //   await renderPage(createGameUrl);
  //   const phaseLengthUnitInput = (await waitFor(() =>
  //     screen.getByLabelText(tk.CreateGamePhaseLengthUnitSelectLabel)
  //   )) as HTMLInputElement;
  //   expect(phaseLengthUnitInput.value).toBe(tk.DurationsHourSingular);
  // });

  test.todo("Increasing game length makes unit plural");
  test.todo("Shorter adjustment phases false by default");
  test.todo("Adjustment phase selects not present");
  test.todo(
    "Clicking shorter adjustment phases shows adjustment phase selects"
  );
  test.todo("Adjustment phase length value defaults to 1");
  test.todo("Adjustment phase length unit defaults to hour");
  test.todo("Increasing adjustment phase length makes unit plural");
  test.todo("Skip get ready phase checked by default");
  test.todo("Skip get ready phase help text appears");
  test.todo("End after year input not present");
  test.todo("End in draw after years checkbox unchecked by default");
  test.todo(
    "Clicking end in draw after years checkbox show end after year input"
  );
  test.todo(
    "End after year shows validation error and disables submit button if not greater than variant year"
  );
  test.todo("Conference checked by default");
  test.todo("Group checked by default");
  test.todo("Individual checked by default");
  test.todo("Anonymous unchecked by default");
  test.todo("Anonymous disabled when not private");
  test.todo("Anonymous help text when not private");
  test.todo("Anonymous not disabled when private");
  test.todo("Anonymous help text disappears when private");
  test.todo("Chat language defaults to Player's choice");
  test.todo("Chat language select shows options for each language");
  test.todo("Reliability checked by default");
  test.todo("Reliability value defaults to 0");
  test.todo("Unchecking reliability removes reliability input");
  test.todo(
    "Reliability higher than user's reliability shows validation error and disables submit button"
  );
  test.todo("Quickness checked by default");
  test.todo("Quickness value defaults to 0");
  test.todo("Unchecking quickness removes quickness input");
  test.todo(
    "Quickness higher than user's quickness shows validation error and disables submit button"
  );
  test.todo("Min rating checked by default");
  test.todo("Min rating value defaults to 0");
  test.todo("Unchecking min rating removes min rating input");
  test.todo(
    "Min rating higher than user's min rating shows validation error and disables submit button"
  );
  test.todo("Max rating checked by default");
  test.todo("Max rating value defaults to user rating (rounded)");
  test.todo("Unchecking max rating removes max rating input");
  test.todo(
    "Max rating lower than user's max rating shows validation error and disables submit button"
  );
  test.todo("Click submit button calls disables submit button");
  test.todo("Click submit button calls create game endpoint");
  test.todo("Click submit button triggers ga event if successful");
  test.todo("Click submit button shows error if error");
  test.todo("Click submit button does not trigger ga event if unsuccessful");
  test.todo("Click submit button shows success if success");
  test.todo("Click submit button shows preference dialog if preference");
  test.todo(
    "Click submit button on preference dialog calls create game endpoint with preferences"
  );
  test.todo("Error shows error screen");
  test.todo("When fetching variant shows error");
});
