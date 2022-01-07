import { setupServer } from "msw/node";
import { handlers } from "../../mockService/handlers";
// import {
//   render,
//   screen,
//   waitFor,
//   fireEvent,
//   getByText,
//   getByDisplayValue,
//   waitForElementToBeRemoved,
//   getByLabelText,
// } from "@testing-library/react";
// import { diplicityServiceURL } from "../../store/service";

// import { generatePath, Router, Route, Switch } from "react-router";
// import "@testing-library/jest-dom/extend-expect";
// import { createMemoryHistory, MemoryHistory } from "history";
// import { ThemeProvider, StyledEngineProvider } from "@mui/material";

// import { RouteConfig } from "../../pages/RouteConfig";
// import { userSeesLoadingSpinner } from "../testUtils";
// import GameList, { NO_GAMES_MESSAGE } from "../GameList";
// import theme from "../../theme";
// import * as generalUtils from "../../utils/general";
// import NationPreferencesDialog from "../../components/NationPreferencesDialog";
// import FeedbackWrapper from "../../components/FeedbackWrapper";
// import { Provider } from "react-redux";
// import { createTestStore } from "../../store";
// import ReactGA from "react-ga";
// import RescheduleDialog from "../../components/RescheduleDialog";
// import ManageInvitationsDialog, {
//   MANAGE_INVITATIONS_DIALOG_TITLE,
// } from "../../components/ManageInvitationsDialog";
// import {
//   DELETE_BUTTON_LABEL,
//   MANAGE_INVITATIONS_BUTTON_LABEL,
//   RENAME_BUTTON_LABEL,
// } from "../../components/GameCard";
// import RenameGameDialog, {
//   RENAME_GAME_DIALOG_TITLE,
//   RENAME_INPUT_LABEL,
// } from "../../components/RenameGameDialog";

const server = setupServer(
  handlers.deleteGame.success,
  handlers.getGame.success,
  handlers.getUser.success,
  handlers.invite.success,
  handlers.joinGame.success,
  handlers.listGamesFinished.success,
  handlers.listGamesMasteredFinished.success,
  handlers.listGamesMasteredStaging.success,
  handlers.listGamesMasteredStarted.success,
  handlers.listGamesStaging.success,
  handlers.listGamesStarted.success,
  handlers.listGamesMyStaging.success,
  handlers.listGamesMyFinished.success,
  handlers.listGamesMyStarted.success,
  handlers.renameGame.success,
  handlers.rescheduleGame.success,
  handlers.unInvite.success,
  handlers.variants.successShort,
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

// interface WrappedGameProps {
//   path?: string;
// }

// let history: MemoryHistory<unknown>;

// const WrappedGameList = ({ path }: WrappedGameProps) => {
//   history = createMemoryHistory();
//   history.push(path || "/");
//   return (
//     <ThemeProvider theme={theme}>
//       <StyledEngineProvider injectFirst>
//         <Router history={history}>
//           <Switch>
//             <Route path={RouteConfig.GameList}>
//               <Provider store={createTestStore()}>
//                 <FeedbackWrapper>
//                   <GameList />
//                   <NationPreferencesDialog />
//                   <RescheduleDialog />
//                   <ManageInvitationsDialog />
//                   <RenameGameDialog />
//                 </FeedbackWrapper>
//               </Provider>
//             </Route>
//           </Switch>
//         </Router>
//       </StyledEngineProvider>
//     </ThemeProvider>
//   );
// };

// const gameId = "game-123";
// const phaseOrdinal = 1;
// const gameListUrl = generatePath(RouteConfig.GameList);

// const getTab = async (name: string, options?: any) => {
//   return await waitFor(() => screen.getByRole("tab", { name, ...options }));
// };

// const getExpandButton = async () => {
//   return await waitFor(() => screen.getByTestId("ExpandMoreIcon"));
// }

// const clickExpandButton = async () => {
//   const button = await getExpandButton();
//   fireEvent.click(button);
// }

describe("Game list functional tests", () => {
  // let fetchSpy: jest.SpyInstance;
  // let gaEventSpy: jest.SpyInstance;
  // let gaSetSpy: jest.SpyInstance;

  beforeEach(() => {
    // fetchSpy = jest.spyOn(global, "fetch");
    // gaEventSpy = jest.spyOn(ReactGA, "event");
    // gaSetSpy = jest.spyOn(ReactGA, "set");
  });

  // test("Renders", async () => {
  //   render(<WrappedGameList path={gameListUrl} />);
  //   await userSeesLoadingSpinner();
  // });

  // test("Shows loading spinner when loading games", async () => {
  //   render(<WrappedGameList path={gameListUrl} />);
  //   await userSeesLoadingSpinner();
  // });

  // test("Default tab is all games", async () => {
  //   render(<WrappedGameList path={gameListUrl} />);
  //   await getTab("All games", { selected: true });
  // });

  // test("Default filter started", async () => {
  //   render(<WrappedGameList path={gameListUrl} />);
  //   const select = await waitFor(() => screen.getByTestId("status-select"));
  //   await waitFor(() => getByDisplayValue(select, "started"));
  // });

  // test("Shows message if user has no started games", async () => {
  //   server.use(handlers.listGamesMyStarted.successEmpty);
  //   render(<WrappedGameList path={gameListUrl} />);
  //   const myGamesTab = await getTab("My games");
  //   fireEvent.click(myGamesTab);
  //   await waitFor(() => screen.getByText(NO_GAMES_MESSAGE));
  // });

  // test("Shows message if user has no finished games", async () => {
  //   server.use(handlers.listGamesMyFinished.successEmpty);
  //   render(<WrappedGameList path={gameListUrl + "?status=finished"} />);
  //   const myGamesTab = await getTab("My games");
  //   fireEvent.click(myGamesTab);
  //   await waitFor(() => screen.getByText(NO_GAMES_MESSAGE));
  // });

  // test("Shows message if user has no staging games", async () => {
  //   server.use(handlers.listGamesMyStaging.successEmpty);
  //   render(<WrappedGameList path={gameListUrl + "?status=staging"} />);
  //   const myGamesTab = await getTab("My games");
  //   fireEvent.click(myGamesTab);
  //   await waitFor(() => screen.getByText(NO_GAMES_MESSAGE));
  // });

  // test("Shows message if no started games", async () => {
  //   server.use(handlers.listGamesStarted.successEmpty);
  //   render(<WrappedGameList path={gameListUrl} />);
  //   await waitFor(() => screen.getByText(NO_GAMES_MESSAGE));
  // });
  // test("Shows message if no finished games", async () => {
  //   server.use(handlers.listGamesFinished.successEmpty);
  //   render(<WrappedGameList path={gameListUrl + "?status=finished"} />);
  //   await waitFor(() => screen.getByText(NO_GAMES_MESSAGE));
  // });
  // test("Shows message if no staging games", async () => {
  //   server.use(handlers.listGamesStaging.successEmpty);
  //   render(<WrappedGameList path={gameListUrl + "?status=staging"} />);
  //   await waitFor(() => screen.getByText(NO_GAMES_MESSAGE));
  // });

  // test("Hits endpoints correctly - my started games", async () => {
  //   server.use(handlers.listGamesMyStarted.successEmpty);
  //   render(<WrappedGameList path={gameListUrl + "?status=started&my=1"} />);
  //   await userSeesLoadingSpinner();
  //   const call = fetchSpy.mock.calls[1][0];
  //   expect(call.url).toBe(`${diplicityServiceURL}My/Games/Started`);
  // });

  // test("Hits endpoints correctly - my finished games", async () => {
  //   server.use(handlers.listGamesMyFinished.successEmpty);
  //   render(<WrappedGameList path={gameListUrl + "?status=finished&my=1"} />);
  //   await userSeesLoadingSpinner();
  //   const call = fetchSpy.mock.calls[1][0];
  //   expect(call.url).toBe(`${diplicityServiceURL}My/Games/Finished`);
  // });
  // test("Hits endpoints correctly - my staging games", async () => {
  //   server.use(handlers.listGamesMyStaging.successEmpty);
  //   render(<WrappedGameList path={gameListUrl + "?status=staging&my=1"} />);
  //   await userSeesLoadingSpinner();
  //   const call = fetchSpy.mock.calls[1][0];
  //   expect(call.url).toBe(`${diplicityServiceURL}My/Games/Staging`);
  // });

  // test("Hits endpoints correctly - started games", async () => {
  //   server.use(handlers.listGamesStarted.successEmpty);
  //   render(<WrappedGameList path={gameListUrl + "?status=started"} />);
  //   await userSeesLoadingSpinner();
  //   const call = fetchSpy.mock.calls[1][0];
  //   expect(call.url).toBe(`${diplicityServiceURL}Games/Started`);
  // });

  // test("Hits endpoints correctly - finished games", async () => {
  //   server.use(handlers.listGamesFinished.successEmpty);
  //   render(<WrappedGameList path={gameListUrl + "?status=finished"} />);
  //   await userSeesLoadingSpinner();
  //   const call = fetchSpy.mock.calls[1][0];
  //   expect(call.url).toBe(`${diplicityServiceURL}Games/Finished`);
  // });
  // test("Hits endpoints correctly - staging games", async () => {
  //   server.use(handlers.listGamesStaging.successEmpty);
  //   render(<WrappedGameList path={gameListUrl + "?status=staging"} />);
  //   await userSeesLoadingSpinner();
  //   const call = fetchSpy.mock.calls[1][0];
  //   expect(call.url).toBe(`${diplicityServiceURL}Games/Staging`);
  // });

  // test("Hits endpoints correctly - my mastered started games", async () => {
  //   server.use(handlers.listGamesMasteredStaging.successEmpty);
  //   render(
  //     <WrappedGameList path={gameListUrl + "?my=1&mastered=1&status=started"} />
  //   );
  //   await userSeesLoadingSpinner();
  //   const call = fetchSpy.mock.calls[1][0];
  //   expect(call.url).toBe(`${diplicityServiceURL}My/Mastered/Games/Started`);
  // });

  // test("Hits endpoints correctly - my mastered finished games", async () => {
  //   server.use(handlers.listGamesMasteredStaging.successEmpty);
  //   render(
  //     <WrappedGameList
  //       path={gameListUrl + "?my=1&mastered=1&status=finished"}
  //     />
  //   );
  //   await userSeesLoadingSpinner();
  //   const call = fetchSpy.mock.calls[1][0];
  //   expect(call.url).toBe(`${diplicityServiceURL}My/Mastered/Games/Finished`);
  // });

  // test("Hits endpoints correctly - my mastered staging games", async () => {
  //   server.use(handlers.listGamesMasteredStaging.successEmpty);
  //   render(
  //     <WrappedGameList path={gameListUrl + "?my=1&mastered=1&status=staging"} />
  //   );
  //   await userSeesLoadingSpinner();
  //   const call = fetchSpy.mock.calls[1][0];
  //   expect(call.url).toBe(`${diplicityServiceURL}My/Mastered/Games/Staging`);
  // });

  // test("Game card shows summary information", async () => {
  //   render(<WrappedGameList path={gameListUrl} />);
  //   await waitFor(() => screen.getByText("Name of started game"));
  //   await waitFor(() => screen.getByText("Classical 1d"));
  //   await waitFor(() => screen.getByText("Spring 901 Movement"));
  // });

  // test("If user can't join game reasons are shown", async () => {
  //   server.use(handlers.listGamesStarted.successFailedRequirements);
  //   render(<WrappedGameList path={gameListUrl} />);
  //   await clickExpandButton();
  //   await waitFor(() => screen.getByText("You can't join this game:"));
  //   await waitFor(() =>
  //     screen.getByText("You've been reported too often (hated score too high).")
  //   );
  //   await waitFor(() => screen.getByText("You're too good (rating too high)."));
  // });

  // test("If user can join game reasons are not shown", async () => {
  //   server.use(handlers.listGamesStarted.success);
  //   render(<WrappedGameList path={gameListUrl} />);
  //   await clickExpandButton();
  //   await waitFor(() => screen.getByText("Name of started game"));
  //   const text = screen.queryByText("You can't join this game:");
  //   expect(text).toBeNull();
  // });

  // test("Failed requirements disables join button", async () => {
  //   server.use(handlers.listGamesStarted.successFailedRequirements);
  //   render(<WrappedGameList path={gameListUrl} />);
  //   await clickExpandButton();
  //   const button = await waitFor(() => screen.getByText("Join"));
  //   expect(button).toHaveAttribute("disabled");
  // });

  // test("View game button is <a> tag", async () => {
  //   server.use(handlers.listGamesStarted.success);
  //   render(<WrappedGameList path={gameListUrl} />);
  //   await clickExpandButton();
  //   const link = await waitFor(() => screen.getByText("View").closest("a"));
  //   expect(link?.href).toBe(
  //     "http://localhost" +
  //       generatePath(RouteConfig.Game, { gameId: "game-123" })
  //   );
  // });

  // test("Invite button copies link to clipboard", async () => {
  //   const copyToClipboardSpy = jest.spyOn(generalUtils, "copyToClipboard");
  //   server.use(handlers.listGamesStarted.success);
  //   render(<WrappedGameList path={gameListUrl} />);
  //   await clickExpandButton();
  //   const button = await waitFor(() => screen.getByText("Invite"));
  //   fireEvent.click(button);
  //   const gameUrl = generatePath(RouteConfig.Game, { gameId: "game-123" });
  //   expect(copyToClipboardSpy).toBeCalledWith(gameUrl);
  // });

  // test("Join button opens nation preferences dialog if nation selection is preference", async () => {
  //   server.use(handlers.listGamesStarted.success);
  //   render(<WrappedGameList path={gameListUrl} />);
  //   await clickExpandButton();
  //   const button = await waitFor(() => screen.getByText("Join"));
  //   fireEvent.click(button);
  //   await waitFor(() => screen.getByText("Nation preferences"));
  // });

  // test("Join button shows errors when error", async () => {
  //   server.use(
  //     handlers.listGamesStaging.successRandomAllocation,
  //     handlers.joinGame.internalServerError
  //   );
  //   render(<WrappedGameList path={gameListUrl + "?status=staging"} />);
  //   await clickExpandButton();
  //   const button = await waitFor(() => screen.getByText("Join"));
  //   fireEvent.click(button);
  //   await waitFor(() => screen.getByText("Couldn't join game."));
  // });

  // test("Join button hits endpoint correctly", async () => {
  //   server.use(handlers.listGamesStaging.successRandomAllocation);
  //   render(<WrappedGameList path={gameListUrl + "?status=staging"} />);
  //   await clickExpandButton();
  //   const button = await waitFor(() => screen.getByText("Join"));
  //   fireEvent.click(button);
  //   await waitFor(() => screen.getByText("Joined game!"));
  //   const call = fetchSpy.mock.calls[3][0];
  //   expect(call.url).toBe(`${diplicityServiceURL}Game/${gameId}/Member`);
  //   expect(call.method).toBe("POST");
  // });

  // test("Join button calls GA", async () => {
  //   server.use(handlers.listGamesStaging.successRandomAllocation);
  //   render(<WrappedGameList path={gameListUrl + "?status=staging"} />);
  //   await clickExpandButton();
  //   const button = await waitFor(() => screen.getByText("Join"));
  //   fireEvent.click(button);
  //   await waitFor(() => screen.getByText("Joined game!"));
  //   expect(gaEventSpy).toBeCalledWith({
  //     category: "(not set)",
  //     action: "game_list_element_join",
  //   });
  // });

  // test("Join button shows success feedback", async () => {
  //   server.use(handlers.listGamesStaging.successRandomAllocation);
  //   render(<WrappedGameList path={gameListUrl + "?status=staging"} />);
  //   await clickExpandButton();
  //   const button = await waitFor(() => screen.getByText("Join"));
  //   fireEvent.click(button);
  //   await waitFor(() => screen.getByText("Joined game!"));
  // });

  // test("Nation preference dialog causes gtag page load event", async () => {
  //   render(<WrappedGameList path={gameListUrl + "?status=staging"} />);
  //   await clickExpandButton();
  //   const button = await waitFor(() => screen.getByText("Join"));
  //   gaEventSpy.mockClear();
  //   gaSetSpy.mockClear();
  //   fireEvent.click(button);
  //   await waitFor(() => screen.getByText("Nation preferences"));

  //   expect(gaSetSpy).toBeCalledWith({
  //     page_title: "NationPreferencesDialog",
  //     page_location: "http://localhost/",
  //   });
  //   expect(gaEventSpy).toBeCalledWith({
  //     category: "(not set)",
  //     action: "page_view",
  //   });
  // });

  // test("Nation preference dialog loads nations for game", async () => {
  //   render(<WrappedGameList path={gameListUrl + "?status=staging"} />);
  //   await clickExpandButton();
  //   const button = await waitFor(() => screen.getByText("Join"));
  //   fireEvent.click(button);
  //   await waitFor(() => screen.getByText("Nation preferences"));
  //   const nations = [
  //     "Austria",
  //     "England",
  //     "France",
  //     "Germany",
  //     "Italy",
  //     "Turkey",
  //     "Russia",
  //   ];
  //   await waitFor(() => screen.getByText("Austria"));
  //   nations.forEach((nation) => screen.getByText(nation));
  // });

  // test("Nation preference dialog submit button disables submit button", async () => {
  //   render(<WrappedGameList path={gameListUrl + "?status=staging"} />);
  //   await clickExpandButton();
  //   const joinButton = await waitFor(() => screen.getByText("Join"));
  //   fireEvent.click(joinButton);
  //   const dialog = await waitFor(() => screen.getByRole("dialog"));
  //   const dialogJoinButton = await waitFor(() => getByText(dialog, "Join"));
  //   expect(dialogJoinButton).not.toHaveAttribute("disabled");
  //   fireEvent.click(dialogJoinButton);
  //   expect(dialogJoinButton).toHaveAttribute("disabled");
  // });
  // test("Nation preference dialog submit button calls endpoint", async () => {
  //   render(<WrappedGameList path={gameListUrl + "?status=staging"} />);
  //   await clickExpandButton();
  //   const joinButton = await waitFor(() => screen.getByText("Join"));
  //   fireEvent.click(joinButton);
  //   const dialog = await waitFor(() => screen.getByRole("dialog"));
  //   const dialogJoinButton = await waitFor(() => getByText(dialog, "Join"));
  //   expect(dialogJoinButton).not.toHaveAttribute("disabled");
  //   fireEvent.click(dialogJoinButton);
  //   await waitFor(() => screen.getByText("Joined game!"));
  //   const call = fetchSpy.mock.calls[4][0] as Request;
  //   expect(call.url).toBe(`${diplicityServiceURL}Game/${gameId}/Member`);
  // });
  // test("Nation preference dialog submit button causes gtag event", async () => {
  //   render(<WrappedGameList path={gameListUrl + "?status=staging"} />);
  //   await clickExpandButton();
  //   const joinButton = await waitFor(() => screen.getByText("Join"));
  //   fireEvent.click(joinButton);
  //   const dialog = await waitFor(() => screen.getByRole("dialog"));
  //   const dialogJoinButton = await waitFor(() => getByText(dialog, "Join"));
  //   expect(dialogJoinButton).not.toHaveAttribute("disabled");
  //   fireEvent.click(dialogJoinButton);
  //   await waitFor(() => screen.getByText("Joined game!"));
  //   expect(gaEventSpy).toBeCalledWith({
  //     category: "(not set)",
  //     action: "game_list_element_join",
  //   });
  // });

  // test("Nation preference dialog submission closes dialog", async () => {
  //   render(<WrappedGameList path={gameListUrl + "?status=staging"} />);
  //   await clickExpandButton();
  //   const joinButton = await waitFor(() => screen.getByText("Join"));
  //   fireEvent.click(joinButton);
  //   const dialog = await waitFor(() => screen.getByRole("dialog"));
  //   const dialogJoinButton = await waitFor(() => getByText(dialog, "Join"));
  //   expect(dialogJoinButton).not.toHaveAttribute("disabled");
  //   fireEvent.click(dialogJoinButton);
  //   await waitFor(() => screen.getByText("Joined game!"));
  //   await waitForElementToBeRemoved(() =>
  //     screen.queryByText("Nation preferences")
  //   );
  // });

  // test("Nation preference dialog close button closes dialog", async () => {
  //   render(<WrappedGameList path={gameListUrl + "?status=staging"} />);
  //   await clickExpandButton();
  //   const joinButton = await waitFor(() => screen.getByText("Join"));
  //   fireEvent.click(joinButton);
  //   const dialog = await waitFor(() => screen.getByRole("dialog"));
  //   const dialogCancelButton = await waitFor(() => getByText(dialog, "Cancel"));
  //   expect(dialogCancelButton).not.toHaveAttribute("disabled");
  //   fireEvent.click(dialogCancelButton);
  //   await waitForElementToBeRemoved(() =>
  //     screen.queryByText("Nation preferences")
  //   );
  // });

  // test("Nation preference dialog submit button shows errors when error", async () => {
  //   server.use(handlers.joinGame.internalServerError);
  //   render(<WrappedGameList path={gameListUrl + "?status=staging"} />);
  //   await clickExpandButton();
  //   const joinButton = await waitFor(() => screen.getByText("Join"));
  //   fireEvent.click(joinButton);
  //   const dialog = await waitFor(() => screen.getByRole("dialog"));
  //   const dialogJoinButton = await waitFor(() => getByText(dialog, "Join"));
  //   fireEvent.click(dialogJoinButton);
  //   await waitFor(() => screen.getByText("Couldn't join game."));
  // });

  // test("Reschedule button appears if", async () => {
  //   server.use(handlers.listGamesMasteredStarted.success);
  //   render(
  //     <WrappedGameList path={gameListUrl + "?my=1&status=started&mastered=1"} />
  //   );
  //   await clickExpandButton();
  //   await waitFor(() => screen.getByText("Reschedule"));
  // });

  // test("Reschedule button does not appear if not game master", async () => {
  //   render(<WrappedGameList path={gameListUrl + "?status=staging"} />);
  //   await clickExpandButton();
  //   const rescheduleButton = screen.queryByText("Reschedule");
  //   expect(rescheduleButton).toBeNull();
  // });

  // test("Reschedule button shows reschedule dialog", async () => {
  //   server.use(handlers.listGamesMasteredStarted.success);
  //   render(
  //     <WrappedGameList path={gameListUrl + "?my=1&status=started&mastered=1"} />
  //   );
  //   await clickExpandButton();
  //   const button = await waitFor(() => screen.getByText("Reschedule"));
  //   fireEvent.click(button);
  //   await waitFor(() => screen.getByText("Reschedule game"));
  // });

  // test("Reschedule dialog causes gtag page load event", async () => {
  //   server.use(handlers.listGamesMasteredStarted.success);
  //   render(
  //     <WrappedGameList path={gameListUrl + "?my=1&status=started&mastered=1"} />
  //   );
  //   await clickExpandButton();
  //   const button = await waitFor(() => screen.getByText("Reschedule"));
  //   gaEventSpy.mockClear();
  //   gaSetSpy.mockClear();
  //   fireEvent.click(button);
  //   await waitFor(() => screen.getByText("Reschedule game"));
  //   expect(gaSetSpy).toBeCalledWith({
  //     page_title: "RescheduleDialog",
  //     page_location: "http://localhost/",
  //   });
  //   expect(gaEventSpy).toBeCalledWith({
  //     category: "(not set)",
  //     action: "page_view",
  //   });
  // });

  // test("Reschedule dialog submit button submits new deadline", async () => {
  //   render(
  //     <WrappedGameList path={gameListUrl + "?my=1&status=started&mastered=1"} />
  //   );
  //   await clickExpandButton();
  //   const button = await waitFor(() => screen.getByText("Reschedule"));
  //   fireEvent.click(button);
  //   await waitFor(() => screen.getByText("Reschedule game"));
  //   const dialog = await waitFor(() => screen.getByRole("dialog"));
  //   const dialogRescheduleButton = await waitFor(() =>
  //     getByText(dialog, "Reschedule")
  //   );
  //   fireEvent.click(dialogRescheduleButton);
  //   await waitFor(() => screen.getByText("Rescheduled game!"));
  //   const call = fetchSpy.mock.calls[4][0];
  //   expect(call.url).toBe(
  //     `${diplicityServiceURL}Game/${gameId}/Phase/${phaseOrdinal}/DeadlineAt`
  //   );
  //   expect(call.method).toBe("POST");
  // });

  // test("Reschedule dialog submit button disables submit button", async () => {
  //   render(
  //     <WrappedGameList path={gameListUrl + "?my=1&status=started&mastered=1"} />
  //   );
  //   await clickExpandButton();
  //   const button = await waitFor(() => screen.getByText("Reschedule"));
  //   fireEvent.click(button);
  //   await waitFor(() => screen.getByText("Reschedule game"));
  //   const dialog = await waitFor(() => screen.getByRole("dialog"));
  //   const dialogRescheduleButton = await waitFor(() =>
  //     getByText(dialog, "Reschedule")
  //   );
  //   expect(dialogRescheduleButton).not.toHaveAttribute("disabled");
  //   fireEvent.click(dialogRescheduleButton);
  //   expect(dialogRescheduleButton).toHaveAttribute("disabled");
  // });
  // test("Reschedule dialog submit button causes gtag event", async () => {
  //   render(
  //     <WrappedGameList path={gameListUrl + "?my=1&status=started&mastered=1"} />
  //   );
  //   await clickExpandButton();
  //   const button = await waitFor(() => screen.getByText("Reschedule"));
  //   fireEvent.click(button);
  //   await waitFor(() => screen.getByText("Reschedule game"));
  //   const dialog = await waitFor(() => screen.getByRole("dialog"));
  //   const dialogRescheduleButton = await waitFor(() =>
  //     getByText(dialog, "Reschedule")
  //   );
  //   fireEvent.click(dialogRescheduleButton);
  //   await waitFor(() => screen.getByText("Rescheduled game!"));
  //   expect(gaEventSpy).toBeCalledWith({
  //     category: "(not set)",
  //     action: "game_list_element_reschedule",
  //   });
  // });
  // test("Reschedule dialog submit button closes dialog", async () => {
  //   render(
  //     <WrappedGameList path={gameListUrl + "?my=1&status=started&mastered=1"} />
  //   );
  //   await clickExpandButton();
  //   const button = await waitFor(() => screen.getByText("Reschedule"));
  //   fireEvent.click(button);
  //   await waitFor(() => screen.getByText("Reschedule game"));
  //   const dialog = await waitFor(() => screen.getByRole("dialog"));
  //   const dialogRescheduleButton = await waitFor(() =>
  //     getByText(dialog, "Reschedule")
  //   );
  //   fireEvent.click(dialogRescheduleButton);
  //   await waitFor(() => screen.getByText("Rescheduled game!"));
  //   await waitForElementToBeRemoved(() =>
  //     screen.queryByText("Reschedule game")
  //   );
  // });
  // test("Reschedule dialog close button closes dialog", async () => {
  //   render(
  //     <WrappedGameList path={gameListUrl + "?my=1&status=started&mastered=1"} />
  //   );
  //   await clickExpandButton();
  //   const button = await waitFor(() => screen.getByText("Reschedule"));
  //   fireEvent.click(button);
  //   await waitFor(() => screen.getByText("Reschedule game"));
  //   const dialog = await waitFor(() => screen.getByRole("dialog"));
  //   const dialogCancelButton = await waitFor(() => getByText(dialog, "Cancel"));
  //   fireEvent.click(dialogCancelButton);
  //   await waitForElementToBeRemoved(() =>
  //     screen.queryByText("Reschedule game")
  //   );
  // });
  // test("Reschedule submit shows errors when error", async () => {
  //   server.use(handlers.rescheduleGame.internalServerError);
  //   render(
  //     <WrappedGameList path={gameListUrl + "?my=1&status=started&mastered=1"} />
  //   );
  //   await clickExpandButton();
  //   const button = await waitFor(() => screen.getByText("Reschedule"));
  //   fireEvent.click(button);
  //   await waitFor(() => screen.getByText("Reschedule game"));
  //   const dialog = await waitFor(() => screen.getByRole("dialog"));
  //   const dialogRescheduleButton = await waitFor(() =>
  //     getByText(dialog, "Reschedule")
  //   );
  //   fireEvent.click(dialogRescheduleButton);
  //   await waitFor(() => screen.getByText("Couldn't reschedule game."));
  // });

  // test("Manage invitations button appears if game master", async () => {
  //   render(
  //     <WrappedGameList path={gameListUrl + "?my=1&status=started&mastered=1"} />
  //   );
  //   await clickExpandButton();
  //   await waitFor(() => screen.getByText(MANAGE_INVITATIONS_BUTTON_LABEL));
  // });

  // test("Manage invitations button does not appear if", async () => {
  //   render(<WrappedGameList path={gameListUrl + "?my=1&status=started"} />);
  //   await clickExpandButton();
  //   const button = screen.queryByText(MANAGE_INVITATIONS_BUTTON_LABEL);
  //   expect(button).toBeNull();
  // });

  // test("Manage invitations button shows manage invitations dialog", async () => {
  //   render(
  //     <WrappedGameList path={gameListUrl + "?my=1&status=started&mastered=1"} />
  //   );
  //   await clickExpandButton();
  //   const button = await waitFor(() =>
  //     screen.getByText(MANAGE_INVITATIONS_BUTTON_LABEL)
  //   );
  //   fireEvent.click(button);
  //   const dialog = await waitFor(() => screen.getByRole("dialog"));
  //   await waitFor(() => getByText(dialog, MANAGE_INVITATIONS_DIALOG_TITLE));
  // });

  // test("Manage invitations dialog causes gtag page load event", async () => {
  //   render(
  //     <WrappedGameList path={gameListUrl + "?my=1&status=started&mastered=1"} />
  //   );
  //   await clickExpandButton();
  //   const button = await waitFor(() =>
  //     screen.getByText(MANAGE_INVITATIONS_BUTTON_LABEL)
  //   );
  //   gaEventSpy.mockClear();
  //   gaSetSpy.mockClear();
  //   fireEvent.click(button);
  //   const dialog = await waitFor(() => screen.getByRole("dialog"));
  //   await waitFor(() => getByText(dialog, MANAGE_INVITATIONS_DIALOG_TITLE));
  //   expect(gaSetSpy).toBeCalledWith({
  //     page_title: "ManageInvitationsDialog",
  //     page_location: "http://localhost/",
  //   });
  //   expect(gaEventSpy).toBeCalledWith({
  //     category: "(not set)",
  //     action: "page_view",
  //   });
  // });

  // test("Manage invitations dialog invite button disabled if no email", async () => {
  //   render(
  //     <WrappedGameList path={gameListUrl + "?my=1&status=started&mastered=1"} />
  //   );
  //   await clickExpandButton();
  //   const button = await waitFor(() =>
  //     screen.getByText(MANAGE_INVITATIONS_BUTTON_LABEL)
  //   );
  //   fireEvent.click(button);
  //   const dialog = await waitFor(() => screen.getByRole("dialog"));
  //   await waitFor(() => getByText(dialog, MANAGE_INVITATIONS_DIALOG_TITLE));
  //   const dialogSubmitButton = await waitFor(() => getByText(dialog, "Submit"));
  //   expect(dialogSubmitButton).toHaveAttribute("disabled");
  // });

  // test("Manage invitations dialog invite button submits invite", async () => {
  //   render(
  //     <WrappedGameList path={gameListUrl + "?my=1&status=started&mastered=1"} />
  //   );
  //   await clickExpandButton();
  //   const button = await waitFor(() =>
  //     screen.getByText(MANAGE_INVITATIONS_BUTTON_LABEL)
  //   );
  //   fireEvent.click(button);
  //   const dialog = await waitFor(() => screen.getByRole("dialog"));
  //   await waitFor(() => getByText(dialog, MANAGE_INVITATIONS_DIALOG_TITLE));
  //   const emailField = getByLabelText(dialog, "Email");
  //   fireEvent.change(emailField, { target: { value: "fakeemail@fake.com" } });
  //   const dialogSubmitButton = await waitFor(() => getByText(dialog, "Submit"));
  //   expect(dialogSubmitButton).not.toHaveAttribute("disabled");
  //   fireEvent.click(dialogSubmitButton);
  //   await waitFor(() => screen.getByText("Invited!"));
  //   const call = fetchSpy.mock.calls[4][0];
  //   expect(call.url).toBe(`${diplicityServiceURL}Game/${gameId}`);
  //   expect(call.method).toBe("POST");
  // });

  // test("Manage invitations dialog invite button disables invite button", async () => {
  //   render(
  //     <WrappedGameList path={gameListUrl + "?my=1&status=started&mastered=1"} />
  //   );
  //   await clickExpandButton();
  //   const button = await waitFor(() =>
  //     screen.getByText(MANAGE_INVITATIONS_BUTTON_LABEL)
  //   );
  //   fireEvent.click(button);
  //   const dialog = await waitFor(() => screen.getByRole("dialog"));
  //   const emailField = getByLabelText(dialog, "Email");
  //   fireEvent.change(emailField, { target: { value: "fakeemail@fake.com" } });
  //   await waitFor(() => getByText(dialog, MANAGE_INVITATIONS_DIALOG_TITLE));
  //   const dialogSubmitButton = await waitFor(() => getByText(dialog, "Submit"));
  //   expect(dialogSubmitButton).not.toHaveAttribute("disabled");
  //   fireEvent.click(dialogSubmitButton);
  //   expect(dialogSubmitButton).toHaveAttribute("disabled");
  // });

  // test("Manage invitations dialog invite button causes gtag event", async () => {
  //   render(
  //     <WrappedGameList path={gameListUrl + "?my=1&status=started&mastered=1"} />
  //   );
  //   await clickExpandButton();
  //   const button = await waitFor(() =>
  //     screen.getByText(MANAGE_INVITATIONS_BUTTON_LABEL)
  //   );
  //   fireEvent.click(button);
  //   const dialog = await waitFor(() => screen.getByRole("dialog"));
  //   await waitFor(() => getByText(dialog, MANAGE_INVITATIONS_DIALOG_TITLE));
  //   const emailField = getByLabelText(dialog, "Email");
  //   fireEvent.change(emailField, { target: { value: "fakeemail@fake.com" } });
  //   const dialogSubmitButton = await waitFor(() => getByText(dialog, "Submit"));
  //   fireEvent.click(dialogSubmitButton);
  //   await waitFor(() => screen.getByText("Invited!"));
  //   expect(gaEventSpy).toBeCalledWith({
  //     category: "(not set)",
  //     action: "manage_invitations_dialog_invite_user",
  //   });
  // });

  // test("Manage invitations dialog empty message", async () => {
  //   render(
  //     <WrappedGameList path={gameListUrl + "?my=1&status=started&mastered=1"} />
  //   );
  //   await clickExpandButton();
  //   const button = await waitFor(() =>
  //     screen.getByText(MANAGE_INVITATIONS_BUTTON_LABEL)
  //   );
  //   fireEvent.click(button);
  //   const dialog = await waitFor(() => screen.getByRole("dialog"));
  //   await waitFor(() =>
  //     getByText(dialog, "You have not invited any players yet.")
  //   );
  // });

  // test("Manage invitations dialog shows invite", async () => {
  //   server.use(handlers.listGamesMasteredStaging.successInvitation);
  //   render(
  //     <WrappedGameList path={gameListUrl + "?my=1&status=started&mastered=1"} />
  //   );
  //   await clickExpandButton();
  //   const button = await waitFor(() =>
  //     screen.getByText(MANAGE_INVITATIONS_BUTTON_LABEL)
  //   );
  //   fireEvent.click(button);
  //   const dialog = await waitFor(() => screen.getByRole("dialog"));
  //   await waitFor(() => getByText(dialog, "fakeemail@gmail.com"));
  //   await waitFor(() => getByText(dialog, "England"));
  // });

  // test("Manage invitations dialog un-invite button submits un-invite", async () => {
  //   server.use(handlers.listGamesMasteredStaging.successInvitation);
  //   render(
  //     <WrappedGameList path={gameListUrl + "?my=1&status=started&mastered=1"} />
  //   );
  //   await clickExpandButton();
  //   const button = await waitFor(() =>
  //     screen.getByText(MANAGE_INVITATIONS_BUTTON_LABEL)
  //   );
  //   fireEvent.click(button);
  //   const dialog = await waitFor(() => screen.getByRole("dialog"));
  //   await waitFor(() => getByText(dialog, "fakeemail@gmail.com"));
  //   const unInviteButton = getByLabelText(dialog, "Un-invite");
  //   fireEvent.click(unInviteButton);
  //   await waitFor(() => screen.getByText("Un-invited."));
  // });

  // test("Manage invitations dialog un-invite button disables un-invite button", async () => {
  //   server.use(handlers.listGamesMasteredStaging.successInvitation);
  //   render(
  //     <WrappedGameList path={gameListUrl + "?my=1&status=started&mastered=1"} />
  //   );
  //   await clickExpandButton();
  //   const button = await waitFor(() =>
  //     screen.getByText(MANAGE_INVITATIONS_BUTTON_LABEL)
  //   );
  //   fireEvent.click(button);
  //   const dialog = await waitFor(() => screen.getByRole("dialog"));
  //   await waitFor(() => getByText(dialog, "fakeemail@gmail.com"));
  //   const unInviteButton = getByLabelText(dialog, "Un-invite");
  //   fireEvent.click(unInviteButton);
  //   expect(unInviteButton).toHaveAttribute("disabled");
  // });
  // test("Manage invitations dialog un-invite button causes gtag event", async () => {
  //   server.use(handlers.listGamesMasteredStaging.successInvitation);
  //   render(
  //     <WrappedGameList path={gameListUrl + "?my=1&status=started&mastered=1"} />
  //   );
  //   await clickExpandButton();
  //   const button = await waitFor(() =>
  //     screen.getByText(MANAGE_INVITATIONS_BUTTON_LABEL)
  //   );
  //   fireEvent.click(button);
  //   const dialog = await waitFor(() => screen.getByRole("dialog"));
  //   await waitFor(() => getByText(dialog, "fakeemail@gmail.com"));
  //   const unInviteButton = getByLabelText(dialog, "Un-invite");
  //   fireEvent.click(unInviteButton);
  //   await waitFor(() => screen.getByText("Un-invited."));
  //   expect(gaEventSpy).toBeCalledWith({
  //     category: "(not set)",
  //     action: "manage_invitations_dialog_uninvite_user",
  //   });
  // });
  // test("Manage invitations dialog close button closes dialog", async () => {
  //   render(
  //     <WrappedGameList path={gameListUrl + "?my=1&status=started&mastered=1"} />
  //   );
  //   await clickExpandButton();
  //   const button = await waitFor(() =>
  //     screen.getByText(MANAGE_INVITATIONS_BUTTON_LABEL)
  //   );
  //   fireEvent.click(button);
  //   const dialog = await waitFor(() => screen.getByRole("dialog"));
  //   const dialogCancelButton = await waitFor(() => getByText(dialog, "Cancel"));
  //   fireEvent.click(dialogCancelButton);
  //   await waitForElementToBeRemoved(() => screen.queryByRole("dialog"));
  // });

  // test("Manage invitations submit shows errors when error", async () => {
  //   server.use(
  //     handlers.listGamesMasteredStaging.successInvitation,
  //     handlers.invite.internalServerError
  //   );
  //   render(
  //     <WrappedGameList path={gameListUrl + "?my=1&status=started&mastered=1"} />
  //   );
  //   await clickExpandButton();
  //   const button = await waitFor(() =>
  //     screen.getByText(MANAGE_INVITATIONS_BUTTON_LABEL)
  //   );
  //   fireEvent.click(button);
  //   const dialog = await waitFor(() => screen.getByRole("dialog"));
  //   const emailField = getByLabelText(dialog, "Email");
  //   fireEvent.change(emailField, { target: { value: "fakeemail@fake.com" } });
  //   const dialogSubmitButton = await waitFor(() => getByText(dialog, "Submit"));
  //   fireEvent.click(dialogSubmitButton);
  //   await waitFor(() => screen.getByText("Couldn't invite user."));
  // });

  // test("Manage invitations un-invite button shows errors when error", async () => {
  //   server.use(
  //     handlers.listGamesMasteredStaging.successInvitation,
  //     handlers.unInvite.internalServerError
  //   );
  //   render(
  //     <WrappedGameList path={gameListUrl + "?my=1&status=started&mastered=1"} />
  //   );
  //   await clickExpandButton();
  //   const button = await waitFor(() =>
  //     screen.getByText(MANAGE_INVITATIONS_BUTTON_LABEL)
  //   );
  //   fireEvent.click(button);
  //   const dialog = await waitFor(() => screen.getByRole("dialog"));
  //   await waitFor(() => getByText(dialog, "fakeemail@gmail.com"));
  //   const unInviteButton = getByLabelText(dialog, "Un-invite");
  //   fireEvent.click(unInviteButton);
  //   await waitFor(() => screen.getByText("Couldn't un-invite user."));
  // });

  // test("Rename button appears if user is member", async () => {
  //   render(
  //     <WrappedGameList path={gameListUrl + "?my=1&status=started&mastered=1"} />
  //   );
  //   await clickExpandButton();
  //   await waitFor(() => screen.getByText(RENAME_BUTTON_LABEL));
  // });

  // test("Rename button does not appear if user not member", async () => {
  //   render(
  //     <WrappedGameList path={gameListUrl + "?my=0&status=started&mastered=1"} />
  //   );
  //   await clickExpandButton();
  //   const button = screen.queryByText(RENAME_BUTTON_LABEL);
  //   expect(button).toBeNull();
  // });

  // test("Rename button shows rename dialog", async () => {
  //   render(
  //     <WrappedGameList path={gameListUrl + "?my=1&status=started&mastered=1"} />
  //   );
  //   await clickExpandButton();
  //   const button = await waitFor(() => screen.getByText(RENAME_BUTTON_LABEL));
  //   fireEvent.click(button);
  //   const dialog = await waitFor(() => screen.getByRole("dialog"));
  //   await waitFor(() => getByText(dialog, RENAME_GAME_DIALOG_TITLE));
  // });

  // test("Rename dialog causes gtag page load event", async () => {
  //   render(
  //     <WrappedGameList path={gameListUrl + "?my=1&status=started&mastered=1"} />
  //   );
  //   await clickExpandButton();
  //   const button = await waitFor(() => screen.getByText(RENAME_BUTTON_LABEL));
  //   gaEventSpy.mockClear();
  //   gaSetSpy.mockClear();
  //   fireEvent.click(button);
  //   const dialog = await waitFor(() => screen.getByRole("dialog"));
  //   await waitFor(() => getByText(dialog, RENAME_GAME_DIALOG_TITLE));

  //   expect(gaSetSpy).toBeCalledWith({
  //     page_title: "RenameGameDialog",
  //     page_location: "http://localhost/",
  //   });
  //   expect(gaEventSpy).toBeCalledWith({
  //     category: "(not set)",
  //     action: "page_view",
  //   });
  // });

  // test("Rename dialog submit button submits rename", async () => {
  //   render(
  //     <WrappedGameList path={gameListUrl + "?my=1&status=started&mastered=1"} />
  //   );
  //   await clickExpandButton();
  //   const button = await waitFor(() => screen.getByText(RENAME_BUTTON_LABEL));
  //   fireEvent.click(button);
  //   const dialog = await waitFor(() => screen.getByRole("dialog"));
  //   const nameField = getByLabelText(dialog, RENAME_INPUT_LABEL);
  //   fireEvent.change(nameField, { target: { value: "new name" } });
  //   const dialogSubmitButton = await waitFor(() =>
  //     getByText(dialog, RENAME_BUTTON_LABEL)
  //   );
  //   fireEvent.click(dialogSubmitButton);
  //   await waitFor(() => screen.getByText("Renamed!"));
  //   const call = fetchSpy.mock.calls[4][0];
  //   expect(call.url).toBe(
  //     `${diplicityServiceURL}Game/${gameId}/Member/123456789`
  //   );
  //   expect(call.method).toBe("PUT");
  // });
  // test("Rename dialog submit button disables submit button", async () => {
  //   render(
  //     <WrappedGameList path={gameListUrl + "?my=1&status=started&mastered=1"} />
  //   );
  //   await clickExpandButton();
  //   const button = await waitFor(() => screen.getByText(RENAME_BUTTON_LABEL));
  //   fireEvent.click(button);
  //   const dialog = await waitFor(() => screen.getByRole("dialog"));
  //   const nameField = getByLabelText(dialog, RENAME_INPUT_LABEL);
  //   fireEvent.change(nameField, { target: { value: "new name" } });
  //   const dialogSubmitButton = await waitFor(() =>
  //     getByText(dialog, RENAME_BUTTON_LABEL)
  //   );
  //   expect(dialogSubmitButton).not.toHaveAttribute("disabled");
  //   fireEvent.click(dialogSubmitButton);
  //   expect(dialogSubmitButton).toHaveAttribute("disabled");
  // });
  // test("Rename dialog submit button causes gtag event", async () => {
  //   render(
  //     <WrappedGameList path={gameListUrl + "?my=1&status=started&mastered=1"} />
  //   );
  //   await clickExpandButton();
  //   const button = await waitFor(() => screen.getByText(RENAME_BUTTON_LABEL));
  //   fireEvent.click(button);
  //   const dialog = await waitFor(() => screen.getByRole("dialog"));
  //   const nameField = getByLabelText(dialog, RENAME_INPUT_LABEL);
  //   fireEvent.change(nameField, { target: { value: "new name" } });
  //   const dialogSubmitButton = await waitFor(() =>
  //     getByText(dialog, RENAME_BUTTON_LABEL)
  //   );
  //   fireEvent.click(dialogSubmitButton);
  //   await waitFor(() => screen.getByText("Renamed!"));
  //   expect(gaEventSpy).toBeCalledWith({
  //     category: "(not set)",
  //     action: "game_list_element_rename",
  //   });
  // });
  // test("Rename dialog close button closes dialog", async () => {
  //   render(
  //     <WrappedGameList path={gameListUrl + "?my=1&status=started&mastered=1"} />
  //   );
  //   await clickExpandButton();
  //   const button = await waitFor(() => screen.getByText(RENAME_BUTTON_LABEL));
  //   fireEvent.click(button);
  //   const dialog = await waitFor(() => screen.getByRole("dialog"));
  //   const dialogCancelButton = await waitFor(() => getByText(dialog, "Cancel"));
  //   fireEvent.click(dialogCancelButton);
  //   await waitForElementToBeRemoved(() => screen.queryByRole("dialog"));
  // });
  // test("Rename submit shows errors when error", async () => {
  //   server.use(handlers.renameGame.internalServerError);
  //   render(
  //     <WrappedGameList path={gameListUrl + "?my=1&status=started&mastered=1"} />
  //   );
  //   await clickExpandButton();
  //   const button = await waitFor(() => screen.getByText(RENAME_BUTTON_LABEL));
  //   fireEvent.click(button);
  //   const dialog = await waitFor(() => screen.getByRole("dialog"));
  //   const nameField = getByLabelText(dialog, RENAME_INPUT_LABEL);
  //   fireEvent.change(nameField, { target: { value: "new name" } });
  //   const dialogSubmitButton = await waitFor(() =>
  //     getByText(dialog, RENAME_BUTTON_LABEL)
  //   );
  //   fireEvent.click(dialogSubmitButton);
  //   await waitFor(() => screen.getByText("Couldn't rename game."));
  // });

  // test("Delete button appears if game master", async () => {
  //   render(
  //     <WrappedGameList path={gameListUrl + "?my=1&status=started&mastered=1"} />
  //   );
  //   await clickExpandButton();
  //   await waitFor(() => screen.getByText(DELETE_BUTTON_LABEL));
  // });

  // test("Delete button does not appear if not game master", async () => {
  //   render(
  //     <WrappedGameList path={gameListUrl + "?my=1&status=started"} />
  //   );
  //   await clickExpandButton();
  //   const button = screen.queryByText(DELETE_BUTTON_LABEL);
  //   expect(button).toBeNull();
  // });

  // test("Delete button deletes game", async () => {
  //   render(
  //     <WrappedGameList path={gameListUrl + "?my=1&status=started&mastered=1"} />
  //   );
  //   await clickExpandButton();
  //   const button = await waitFor(() => screen.getByText(DELETE_BUTTON_LABEL));
  //   fireEvent.click(button);
  //   fetchSpy.mockClear();
  //   await waitFor(() => screen.getByText("Deleted!"));
  //   const call = fetchSpy.mock.calls[0][0];
  //   expect(call.url).toBe(`${diplicityServiceURL}Game/${gameId}`);
  //   expect(call.method).toBe("DELETE");
  // });
  // test("Delete button causes gtag event", async () => {
  //   render(
  //     <WrappedGameList path={gameListUrl + "?my=1&status=started&mastered=1"} />
  //   );
  //   await clickExpandButton();
  //   const button = await waitFor(() => screen.getByText(DELETE_BUTTON_LABEL));
  //   fireEvent.click(button);
  //   await waitFor(() => screen.getByText("Deleted!"));
  //   expect(gaEventSpy).toBeCalledWith({
  //     category: "(not set)",
  //     action: "game_list_element_delete",
  //   });
  // });
  // test("Delete button disables delete button", async () => {
  //   render(
  //     <WrappedGameList path={gameListUrl + "?my=1&status=started&mastered=1"} />
  //   );
  //   await clickExpandButton();
  //   const button = await waitFor(() => screen.getByText(DELETE_BUTTON_LABEL));
  //   fireEvent.click(button);
  //   expect(button).toHaveAttribute("disabled");
  // });
  // test("Delete shows errors when error", async () => {
  //   server.use(handlers.deleteGame.internalServerError);
  //   render(
  //     <WrappedGameList path={gameListUrl + "?my=1&status=started&mastered=1"} />
  //   );
  //   await clickExpandButton();
  //   const button = await waitFor(() => screen.getByText(DELETE_BUTTON_LABEL));
  //   fireEvent.click(button);
  //   await waitFor(() => screen.getByText("Couldn't delete game."));
  // });

  test.todo("Scroll to bottom of page triggers list request (infinite scroll)");

  test.todo("Create new game button appears");
  test.todo("Create new game button redirects to create new game page");
});
