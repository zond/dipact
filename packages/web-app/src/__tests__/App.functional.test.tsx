import "jest-location-mock";
import React from "react";
import {
  render,
  screen,
  waitFor,
  fireEvent,
  getByText,
  getByRole,
  waitForElementToBeRemoved,
  act,
} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { setupServer } from "msw/node";
import { MemoryRouter as Router } from "react-router-dom";
import { ConnectedRouter } from "connected-react-router";

import App from "../App";
import { handlers } from "../mocks/handlers";
import { Provider } from "react-redux";
import { PageName, translateKeys as tk } from "@diplicity/common";
import ReactGA from "react-ga";
import { createStore } from "../store";
import ProgressDialog from "../components/ProgressDialog";

const server = setupServer(
  handlers.bans.success,
  handlers.createGame.success,
  handlers.forumMail.success,
  handlers.getUser.success,
  handlers.getUserConfig.success,
  handlers.getUserStats.successEmpty,
  handlers.getVariantSVG.success,
  handlers.histogram.success,
  handlers.variants.successShort
);

beforeAll((): void => {
  server.listen();
});

beforeEach((): void => {});

afterEach((): void => {
  server.resetHandlers();
});

afterAll((): void => {
  server.close();
});

const randomGameName = "Random game name";

jest.mock("connected-react-router", () => ({
  ...jest.requireActual("connected-react-router"),
  ConnectedRouter: jest.fn(),
}));

jest.mock("../helpers", () => ({
  ...jest.requireActual("../helpers"),
  incProgress: jest.fn(),
  decProgress: jest.fn(),
  randomGameName: jest.fn(() => randomGameName),
}));

const renderApp = () => {
  render(
    <Provider store={createStore()}>
      <Router>
        <ProgressDialog />
        <App />
      </Router>
    </Provider>
  );
};

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

const userSeesInternalServerErrorMessage = async () => {
  await waitFor(() =>
    screen.getByText("Internal server error", { exact: false })
  );
};

interface IGlobals {
  [key: string]: any;
}

interface IWrapper {}

declare global {
  interface Window {
    Globals: IGlobals;
    Wrapper?: IWrapper;
  }
}

describe("Login", () => {
  const loginUrl =
    "https://diplicity-engine.appspot.com/Auth/Login?redirect-to=http%3A%2F%2Flocalhost%2F&token-duration=72000";
  const getLoginButton = async () => {
    return await waitFor(() => screen.getByText("Sign in with Google"));
  };
  beforeEach(async () => {
    (ConnectedRouter as jest.Mock).mockImplementation(({ children }) => (
      <div>{children}</div>
    ));
  });
  test("Renders withouth error", async () => {
    server.use(handlers.getUser.successEmpty);
    await renderApp();
  });
  test("Clicking login on web pushes user to login url", async () => {
    server.use(handlers.getUser.successEmpty);
    await renderApp();
    const loginButton = await getLoginButton();
    fireEvent.click(loginButton);
    expect(window.location).toBeAt(loginUrl);
  });
  test("WrapperCallback.getToken is defined when Wrapper.getToken is called during Android login", async () => {
    server.use(handlers.getUser.successEmpty);
    let callbackWasDefined = false;
    const mockGetToken = jest.fn(() => {
      if (typeof window.Globals.WrapperCallbacks.getToken === "function") {
        callbackWasDefined = true;
      }
    });
    window.Wrapper = { getToken: mockGetToken };
    await renderApp();
    const loginButton = await getLoginButton();
    expect(callbackWasDefined).toBe(false);
    fireEvent.click(loginButton);
    expect(mockGetToken).toBeCalled();
    expect(callbackWasDefined).toBe(true);
  });
});

describe("CreateGame", () => {
  let gaEventSpy: jest.SpyInstance;
  let gaSetSpy: jest.SpyInstance;

  const navigateToCreateGame = async () => {
    const createGameButton = await waitFor(() =>
      screen.getByText("Create game")
    );
    act(() => {
      fireEvent.click(createGameButton);
    });
    await waitFor(() => screen.getByText(tk.createGame.title));
  };

  beforeEach(async () => {
    (ConnectedRouter as jest.Mock).mockImplementation(({ children }) => (
      <div>{children}</div>
    ));
    gaEventSpy = jest.spyOn(ReactGA, "event");
    gaSetSpy = jest.spyOn(ReactGA, "set");

    await renderApp();
  });

  test("Page load causes ga event", async () => {
    await navigateToCreateGame();
    pageLoadGAEventHappens(gaSetSpy, gaEventSpy, PageName.CreateGame);
  });
  test("Name input has random name by default", async () => {
    await navigateToCreateGame();
    await waitFor(() => screen.getByDisplayValue(randomGameName));
  });
  test("Clicking randomize button creates new random name", async () => {
    await navigateToCreateGame();
    const input = await waitFor(() =>
      screen.getByLabelText(tk.createGame.nameInput.label)
    );
    const button = screen.getByTitle(
      tk.createGame.randomizeGameNameButton.title
    );
    fireEvent.change(input, { target: { value: "Some string" } });
    await waitFor(() => screen.getByDisplayValue("Some string"));
    fireEvent.click(button);
    // await waitFor(() => screen.getByDisplayValue(randomGameName));
  });
  test("Game master help text when not private", async () => {
    await navigateToCreateGame();
    await waitFor(() =>
      screen.getByText(tk.createGame.gameMasterCheckbox.helpText.disabled)
    );
  });
  test("Game master help text when private", async () => {
    await navigateToCreateGame();
    const checkbox = (await waitFor(() =>
      screen.getByLabelText(tk.createGame.privateCheckbox.label)
    )) as HTMLInputElement;
    fireEvent.click(checkbox);
    await waitFor(() =>
      screen.getByText(tk.createGame.gameMasterCheckbox.helpText.default)
    );
  });
  test("Variant section shows description, image, start year, author, rules", async () => {
    await navigateToCreateGame();
    await waitFor(() => screen.getByText("The original Diplomacy."));
    await waitFor(() => screen.getByText("1901"));
    await waitFor(() => screen.getByText("Allan B. Calhamer"));
    await waitFor(() =>
      screen.getByText("The first to 18 Supply Centers", { exact: false })
    );
  });
  test("Variant select shows different variant", async () => {
    await navigateToCreateGame();
    const select = await waitFor(() =>
      screen.getByLabelText(tk.createGame.variantSelect.label)
    );
    fireEvent.change(select, { target: { value: "Twenty Twenty" } });
    await waitFor(() => screen.getByText("TTTPPP"));
  });
  test("Changing variant select shows loading spinner", async () => {
    await navigateToCreateGame();
    const select = await waitFor(() =>
      screen.getByLabelText(tk.createGame.variantSelect.label)
    );
    fireEvent.change(select, { target: { value: "Twenty Twenty" } });
    await waitFor(() => screen.getByRole("progressbar"));
  });
  test("Nation selection options appear", async () => {
    await navigateToCreateGame();
    await waitFor(() =>
      screen.getByLabelText(tk.nationAllocationOptions.random)
    );
    await waitFor(() =>
      screen.getByLabelText(tk.nationAllocationOptions.preference)
    );
  });
  test("Nation selection random is default", async () => {
    await navigateToCreateGame();
    const randomOption = await waitFor(() =>
      screen.getByLabelText(tk.nationAllocationOptions.random)
    );
    expect(randomOption).toHaveAttribute("checked");
  });
  test("Phase length value defaults to 1", async () => {
    await navigateToCreateGame();
    const phaseLengthMultiplierInput = (await waitFor(() =>
      screen.getByLabelText(tk.createGame.phaseLengthMultiplierInput.label)
    )) as HTMLInputElement;
    expect(phaseLengthMultiplierInput.value).toBe("1");
  });
  test("Phase length unit defaults to day", async () => {
    await navigateToCreateGame();
    const phaseLengthUnitSelect = await waitFor(() =>
      screen.getByLabelText(tk.createGame.phaseLengthUnitSelect.label)
    );
    getByText(phaseLengthUnitSelect, tk.durations.day.singular);
  });
  test("Increasing game length makes unit plural", async () => {
    await navigateToCreateGame();
    const phaseLengthMultiplierInput = await waitFor(() =>
      screen.getByLabelText(tk.createGame.phaseLengthMultiplierInput.label)
    );
    const val = screen.queryByText(tk.durations.day.plural);
    expect(val).toBeNull();
    fireEvent.change(phaseLengthMultiplierInput, { target: { value: 2 } });
    await waitFor(() => screen.getByText(tk.durations.day.plural));
  });
  test("Shorter adjustment phases false by default", async () => {
    await navigateToCreateGame();
    const shorterAdjustmentPhaseCheckbox = (await waitFor(() =>
      screen.getByLabelText(
        tk.createGame.customAdjustmentPhaseLengthCheckbox.label
      )
    )) as HTMLInputElement;
    expect(shorterAdjustmentPhaseCheckbox.checked).toBe(false);
  });
  test("Adjustment phase selects not present", async () => {
    await navigateToCreateGame();
    const shorterAdjustmentPhaseMultiplierInput = screen.queryByLabelText(
      tk.createGame.adjustmentPhaseLengthMultiplierInput.label
    );
    expect(shorterAdjustmentPhaseMultiplierInput).toBeNull();
  });
  test("Clicking shorter adjustment phases shows adjustment phase selects", async () => {
    await navigateToCreateGame();
    const shorterAdjustmentPhaseCheckbox = (await waitFor(() =>
      screen.getByLabelText(
        tk.createGame.customAdjustmentPhaseLengthCheckbox.label
      )
    )) as HTMLInputElement;
    fireEvent.click(shorterAdjustmentPhaseCheckbox);
    await waitFor(() =>
      screen.getByLabelText(
        tk.createGame.adjustmentPhaseLengthMultiplierInput.label
      )
    );
  });
  test("Adjustment phase length value defaults to 1", async () => {
    await navigateToCreateGame();
    const shorterAdjustmentPhaseCheckbox = (await waitFor(() =>
      screen.getByLabelText(
        tk.createGame.customAdjustmentPhaseLengthCheckbox.label
      )
    )) as HTMLInputElement;
    fireEvent.click(shorterAdjustmentPhaseCheckbox);
    const adjustmentPhaseLengthMultiplierInput = await waitFor(
      () =>
        screen.getByLabelText(
          tk.createGame.adjustmentPhaseLengthMultiplierInput.label
        ) as HTMLInputElement
    );
    expect(adjustmentPhaseLengthMultiplierInput.value).toBe("1");
  });
  test("Adjustment phase length unit defaults to day", async () => {
    await navigateToCreateGame();
    const shorterAdjustmentPhaseCheckbox = (await waitFor(() =>
      screen.getByLabelText(
        tk.createGame.customAdjustmentPhaseLengthCheckbox.label
      )
    )) as HTMLInputElement;
    fireEvent.click(shorterAdjustmentPhaseCheckbox);
    const adjustmentPhaseLengthUnitSelect = await waitFor(() =>
      screen.getByLabelText(tk.createGame.adjustmentPhaseLengthUnitSelect.label)
    );
    getByText(adjustmentPhaseLengthUnitSelect, tk.durations.day.singular);
  });
  test("Increasing adjustment phase length makes unit plural", async () => {
    await navigateToCreateGame();
    const shorterAdjustmentPhaseCheckbox = (await waitFor(() =>
      screen.getByLabelText(
        tk.createGame.customAdjustmentPhaseLengthCheckbox.label
      )
    )) as HTMLInputElement;
    fireEvent.click(shorterAdjustmentPhaseCheckbox);
    const adjustmentPhaseLengthMultiplierInput = await waitFor(() =>
      screen.getByLabelText(
        tk.createGame.adjustmentPhaseLengthMultiplierInput.label
      )
    );
    const adjustmentPhaseLengthUnitSelect = await waitFor(() =>
      screen.getByLabelText(tk.createGame.adjustmentPhaseLengthUnitSelect.label)
    );
    fireEvent.change(adjustmentPhaseLengthMultiplierInput, {
      target: { value: 2 },
    });
    await waitFor(() =>
      getByText(adjustmentPhaseLengthUnitSelect, tk.durations.day.plural)
    );
  });
  test("Skip get ready phase checked by default", async () => {
    await navigateToCreateGame();
    const skipGetReadyPhaseCheckbox = await waitFor(
      () =>
        screen.getByLabelText(
          tk.createGame.skipGetReadyPhaseCheckbox.label
        ) as HTMLInputElement
    );
    expect(skipGetReadyPhaseCheckbox.checked).toBe(true);
  });
  test("Skip get ready phase help text appears", async () => {
    await navigateToCreateGame();
    await waitFor(() =>
      screen.getByText(tk.createGame.skipGetReadyPhaseCheckbox.helpText)
    );
  });
  test("End after year input not present", async () => {
    await navigateToCreateGame();
    const input = screen.queryByLabelText(
      tk.createGame.endAfterYearsInput.label
    );
    expect(input).toBeNull();
  });
  test("End in draw after years checkbox unchecked by default", async () => {
    await navigateToCreateGame();
    const endInDrawAfterYears = await waitFor(
      () =>
        screen.getByLabelText(
          tk.createGame.endAfterYearsCheckbox.label
        ) as HTMLInputElement
    );
    expect(endInDrawAfterYears.checked).toBe(false);
  });
  test("Clicking end in draw after years checkbox show end after year input", async () => {
    await navigateToCreateGame();
    const checkbox = await waitFor(
      () =>
        screen.getByLabelText(
          tk.createGame.endAfterYearsCheckbox.label
        ) as HTMLInputElement
    );
    const input = screen.queryByLabelText(
      tk.createGame.endAfterYearsInput.label
    );
    expect(input).toBeNull();
    fireEvent.click(checkbox);
    await waitFor(() =>
      screen.getByLabelText(tk.createGame.endAfterYearsInput.label)
    );
  });
  test("End after year input value eight more than variant start year", async () => {
    await navigateToCreateGame();
    const checkbox = await waitFor(
      () =>
        screen.getByLabelText(
          tk.createGame.endAfterYearsCheckbox.label
        ) as HTMLInputElement
    );
    fireEvent.click(checkbox);
    const input = await waitFor(
      () =>
        screen.getByLabelText(
          tk.createGame.endAfterYearsInput.label
        ) as HTMLInputElement
    );
    expect(input.value).toBe("1909");
  });
  test("End after year input min value same as start year", async () => {
    await navigateToCreateGame();
    const checkbox = await waitFor(
      () =>
        screen.getByLabelText(
          tk.createGame.endAfterYearsCheckbox.label
        ) as HTMLInputElement
    );
    fireEvent.click(checkbox);
    const input = await waitFor(
      () =>
        screen.getByLabelText(
          tk.createGame.endAfterYearsInput.label
        ) as HTMLInputElement
    );
    expect(input.min).toBe("1902");
  });
  test("Conference checked by default", async () => {
    await navigateToCreateGame();
    const checkbox = await waitFor(
      () =>
        screen.getByLabelText(
          tk.createGame.conferenceChatCheckbox.label
        ) as HTMLInputElement
    );
    expect(checkbox.checked).toBe(true);
  });
  test("Group checked by default", async () => {
    await navigateToCreateGame();
    const checkbox = await waitFor(
      () =>
        screen.getByLabelText(
          tk.createGame.groupChatCheckbox.label
        ) as HTMLInputElement
    );
    expect(checkbox.checked).toBe(true);
  });
  test("Individual checked by default", async () => {
    await navigateToCreateGame();
    const checkbox = await waitFor(
      () =>
        screen.getByLabelText(
          tk.createGame.individualChatCheckbox.label
        ) as HTMLInputElement
    );
    expect(checkbox.checked).toBe(true);
  });
  test("Anonymous unchecked by default", async () => {
    await navigateToCreateGame();
    const checkbox = await waitFor(
      () =>
        screen.getByLabelText(
          tk.createGame.anonymousChatCheckbox.label
        ) as HTMLInputElement
    );
    expect(checkbox.checked).toBe(false);
  });
  test("Anonymous disabled when not private", async () => {
    await navigateToCreateGame();
    const checkbox = await waitFor(
      () =>
        screen.getByLabelText(
          tk.createGame.anonymousChatCheckbox.label
        ) as HTMLInputElement
    );
    expect(checkbox.disabled).toBe(true);
  });
  test("Anonymous help text when not private", async () => {
    await navigateToCreateGame();
    await waitFor(() =>
      screen.getByText(tk.createGame.anonymousChatCheckbox.explanation)
    );
  });
  test("Anonymous not disabled when private", async () => {
    await navigateToCreateGame();
    const privateCheckbox = await waitFor(
      () =>
        screen.getByLabelText(
          tk.createGame.privateCheckbox.label
        ) as HTMLInputElement
    );
    fireEvent.click(privateCheckbox);
    const checkbox = await waitFor(
      () =>
        screen.getByLabelText(
          tk.createGame.anonymousChatCheckbox.label
        ) as HTMLInputElement
    );
    expect(checkbox.disabled).toBe(false);
  });
  test("Anonymous help text disappears when private", async () => {
    await navigateToCreateGame();
    const privateCheckbox = await waitFor(
      () =>
        screen.getByLabelText(
          tk.createGame.privateCheckbox.label
        ) as HTMLInputElement
    );
    await act(async () => {
      fireEvent.click(privateCheckbox);
      await waitForElementToBeRemoved(() =>
        screen.queryByText(tk.createGame.anonymousChatCheckbox.explanation)
      );
    });
  });
  test("Chat language defaults to Player's choice", async () => {
    await navigateToCreateGame();
    const select = await waitFor(
      () =>
        screen.getByLabelText(
          tk.createGame.chatLanguageSelect.label
        ) as HTMLSelectElement
    );
    const input = await waitFor(
      () =>
        getByRole(select.parentElement as HTMLElement, "textbox", {
          hidden: true,
        }) as HTMLInputElement
    );
    expect(input.value).toBe("players_choice");
  });
  test("Reliability checked by default", async () => {
    await navigateToCreateGame();
    const checkbox = await waitFor(
      () =>
        screen.getByLabelText(
          tk.createGame.reliabilityEnabledCheckbox.label
        ) as HTMLInputElement
    );
    expect(checkbox.checked).toBe(true);
  });
  test("Reliability value defaults to 0", async () => {
    await navigateToCreateGame();
    const input = await waitFor(
      () =>
        screen.getByLabelText(
          tk.createGame.minReliabilityInput.label
        ) as HTMLInputElement
    );
    expect(input.value).toBe("0");
  });
  test("Unchecking reliability removes reliability input", async () => {
    await navigateToCreateGame();
    const checkbox = await waitFor(
      () =>
        screen.getByLabelText(
          tk.createGame.reliabilityEnabledCheckbox.label
        ) as HTMLInputElement
    );
    await act(async () => {
      fireEvent.click(checkbox);
      await waitForElementToBeRemoved(() =>
        screen.queryByLabelText(tk.createGame.minReliabilityInput.label)
      );
    });
  });
  test("Reliability higher than user's reliability shows validation error and disables submit button", async () => {
    await navigateToCreateGame();
    const input = await waitFor(
      () =>
        screen.getByLabelText(
          tk.createGame.minReliabilityInput.label
        ) as HTMLInputElement
    );
    fireEvent.change(input, { target: { value: 20 } });
    await waitFor(() =>
      screen.getByText(
        tk.createGame.minReliabilityInput.errorMessage.moreThanUserReliability
      )
    );
  });
  test("Quickness checked by default", async () => {
    await navigateToCreateGame();
    const checkbox = await waitFor(
      () =>
        screen.getByLabelText(
          tk.createGame.quicknessEnabledCheckbox.label
        ) as HTMLInputElement
    );
    expect(checkbox.checked).toBe(true);
  });
  test("Quickness value defaults to 0", async () => {
    await navigateToCreateGame();
    const input = await waitFor(
      () =>
        screen.getByLabelText(
          tk.createGame.minQuicknessInput.label
        ) as HTMLInputElement
    );
    expect(input.value).toBe("0");
  });
  test("Unchecking quickness removes quickness input", async () => {
    await navigateToCreateGame();
    const checkbox = await waitFor(
      () =>
        screen.getByLabelText(
          tk.createGame.quicknessEnabledCheckbox.label
        ) as HTMLInputElement
    );
    await act(async () => {
      fireEvent.click(checkbox);
      await waitForElementToBeRemoved(() =>
        screen.queryByLabelText(tk.createGame.minQuicknessInput.label)
      );
    });
  });
  test("Quickness higher than user's quickness shows validation error and disables submit button", async () => {
    await navigateToCreateGame();
    const input = await waitFor(
      () =>
        screen.getByLabelText(
          tk.createGame.minQuicknessInput.label
        ) as HTMLInputElement
    );
    fireEvent.change(input, { target: { value: 20 } });
    await waitFor(() =>
      screen.getByText(
        tk.createGame.minQuicknessInput.errorMessage.moreThanUserQuickness
      )
    );
  });
  test("MinRating unchecked by default", async () => {
    await navigateToCreateGame();
    const checkbox = await waitFor(
      () =>
        screen.getByLabelText(
          tk.createGame.minRatingEnabledCheckbox.label
        ) as HTMLInputElement
    );
    expect(checkbox.checked).toBe(false);
  });
  test("MinRating value defaults to 0", async () => {
    await navigateToCreateGame();
    const checkbox = await waitFor(
      () =>
        screen.getByLabelText(
          tk.createGame.minRatingEnabledCheckbox.label
        ) as HTMLInputElement
    );
    fireEvent.click(checkbox);
    const input = await waitFor(
      () =>
        screen.getByLabelText(
          tk.createGame.minRatingInput.label
        ) as HTMLInputElement
    );
    expect(input.value).toBe("0");
  });
  test("Unchecking minRating removes minRating input", async () => {
    await navigateToCreateGame();
    const checkbox = await waitFor(
      () =>
        screen.getByLabelText(
          tk.createGame.minRatingEnabledCheckbox.label
        ) as HTMLInputElement
    );
    fireEvent.click(checkbox);
    await act(async () => {
      fireEvent.click(checkbox);
      await waitForElementToBeRemoved(() =>
        screen.queryByLabelText(tk.createGame.minRatingInput.label)
      );
    });
  });
  test("MinRating higher than user's minRating shows validation error and disables submit button", async () => {
    await navigateToCreateGame();
    const checkbox = await waitFor(
      () =>
        screen.getByLabelText(
          tk.createGame.minRatingEnabledCheckbox.label
        ) as HTMLInputElement
    );
    fireEvent.click(checkbox);
    const input = await waitFor(
      () =>
        screen.getByLabelText(
          tk.createGame.minRatingInput.label
        ) as HTMLInputElement
    );
    fireEvent.change(input, { target: { value: 20 } });
    await waitFor(() =>
      screen.getByText(
        tk.createGame.minRatingInput.errorMessage.moreThanUserRating
      )
    );
  });
  test("MaxRating unchecked by default", async () => {
    await navigateToCreateGame();
    const checkbox = await waitFor(
      () =>
        screen.getByLabelText(
          tk.createGame.maxRatingEnabledCheckbox.label
        ) as HTMLInputElement
    );
    expect(checkbox.checked).toBe(false);
  });
  test("MaxRating value defaults to 0", async () => {
    await navigateToCreateGame();
    const checkbox = await waitFor(
      () =>
        screen.getByLabelText(
          tk.createGame.maxRatingEnabledCheckbox.label
        ) as HTMLInputElement
    );
    fireEvent.click(checkbox);
    const input = await waitFor(
      () =>
        screen.getByLabelText(
          tk.createGame.maxRatingInput.label
        ) as HTMLInputElement
    );
    expect(input.value).toBe("0.00");
  });
  test("Unchecking maxRating removes maxRating input", async () => {
    await navigateToCreateGame();
    const checkbox = await waitFor(
      () =>
        screen.getByLabelText(
          tk.createGame.maxRatingEnabledCheckbox.label
        ) as HTMLInputElement
    );
    fireEvent.click(checkbox);
    await act(async () => {
      fireEvent.click(checkbox);
      await waitForElementToBeRemoved(() =>
        screen.queryByLabelText(tk.createGame.maxRatingInput.label)
      );
    });
  });
  test("MaxRating higher than user's maxRating shows validation error and disables submit button", async () => {
    await navigateToCreateGame();
    const checkbox = await waitFor(
      () =>
        screen.getByLabelText(
          tk.createGame.maxRatingEnabledCheckbox.label
        ) as HTMLInputElement
    );
    fireEvent.click(checkbox);
    const input = await waitFor(
      () =>
        screen.getByLabelText(
          tk.createGame.maxRatingInput.label
        ) as HTMLInputElement
    );
    fireEvent.change(input, { target: { value: -1 } });
    await waitFor(() =>
      screen.getByText(
        tk.createGame.maxRatingInput.errorMessage.lessThanUserRating
      )
    );
  });
  test("Click submit button triggers ga event if successful", async () => {
    await navigateToCreateGame();
    const submitButton = await waitFor(
      () =>
        screen.getByText(tk.createGame.submitButton.label) as HTMLButtonElement
    );
    await act(async () => {
      fireEvent.click(submitButton);
    });
    await waitFor(() => screen.getByText(tk.feedback.createGame.fulfilled));
    expect(gaEventSpy).toBeCalledWith({
      category: "(not set)",
      action: "create_game",
    });
  });
  test("Click submit button shows error if error", async () => {
    server.use(handlers.createGame.internalServerError);
    await navigateToCreateGame();
    const submitButton = await waitFor(
      () =>
        screen.getByText(tk.createGame.submitButton.label) as HTMLButtonElement
    );
    await act(async () => {
      fireEvent.click(submitButton);
    });
    await waitFor(() => screen.getByText(tk.feedback.createGame.rejected));
  });
  test("Click submit button does not trigger ga event if unsuccessful", async () => {
    server.use(handlers.createGame.internalServerError);
    await navigateToCreateGame();
    const submitButton = await waitFor(
      () =>
        screen.getByText(tk.createGame.submitButton.label) as HTMLButtonElement
    );
    await act(async () => {
      fireEvent.click(submitButton);
    });
    expect(gaEventSpy).not.toBeCalledWith({
      category: "(not set)",
      action: "create_game",
    });
  });
  test("Click submit button shows success if success", async () => {
    await navigateToCreateGame();
    const submitButton = await waitFor(
      () =>
        screen.getByText(tk.createGame.submitButton.label) as HTMLButtonElement
    );
    await act(async () => {
      fireEvent.click(submitButton);
    });
    await waitFor(() => screen.getByText(tk.feedback.createGame.fulfilled));
  });
  test("Error shows error screen", async () => {
    server.use(handlers.variants.internalServerError);
    await navigateToCreateGame();
    await userSeesInternalServerErrorMessage();
  });
  test("When fetching variant shows error", async () => {
    server.use(handlers.getVariantSVG.internalServerError);
    await navigateToCreateGame();
    await userSeesInternalServerErrorMessage();
  });
  test("Click submit button shows preference dialog if preference", async () => {
    await navigateToCreateGame();
    const preferenceOption = await waitFor(() =>
      screen.getByLabelText(tk.nationAllocationOptions.preference)
    );
    act(() => {
      fireEvent.click(preferenceOption);
    });
    const submitButton = await waitFor(
      () =>
        screen.getByText(tk.createGame.submitButton.label) as HTMLButtonElement
    );
    await act(async () => {
      fireEvent.click(submitButton);
    });
    await waitFor(() => screen.getByText(tk.nationPreferences.title));
  });
  test("Click submit button on preference dialog calls create game endpoint with preferences", async () => {
    await navigateToCreateGame();
    const preferenceOption = await waitFor(() =>
      screen.getByLabelText(tk.nationAllocationOptions.preference)
    );
    act(() => {
      fireEvent.click(preferenceOption);
    });
    const submitButton = await waitFor(
      () =>
        screen.getByText(tk.createGame.submitButton.label) as HTMLButtonElement
    );
    await act(async () => {
      fireEvent.click(submitButton);
    });
    const submitPreferencesButton = await waitFor(() =>
      screen.getByText(tk.nationPreferences.joinButton.label)
    );
    await act(() => {
      fireEvent.click(submitPreferencesButton);
    });
    await waitFor(() => screen.getByText(tk.feedback.createGame.fulfilled));
  });
});
