import React from "react";

import {
  render,
  screen,
  waitFor,
  fireEvent,
  getByText,
  getByTitle,
  queryByTitle,
} from "@testing-library/react";
import { generatePath, Router, Route, Switch } from "react-router-dom";
import "@testing-library/jest-dom/extend-expect";
import { setupServer } from "msw/node";
import { createMemoryHistory } from "history";

import { handlers } from "../../mockService/handlers";
import { RouteConfig } from "../../pages/RouteConfig";
import { MemoryHistory } from "history";
import ChatChannel from "../ChatChannel";
import {
  userSeesInternalServerErrorMessage,
  userSeesLoadingSpinner,
} from "../testUtils";
import { ThemeProvider, StyledEngineProvider } from "@mui/material";
import theme from "../../theme";
import { Provider } from "react-redux";
import { createTestStore, diplicityServiceURL } from "@diplicity/common";

const server = setupServer(
  handlers.getGame.success,
  handlers.getUser.success,
  handlers.listChannels.success,
  handlers.listPhases.success,
  handlers.messages.success,
  handlers.variants.successShort,
  handlers.createMessage.success
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

const gameId = "game-1234";
const everyoneChannelId = "Austria,England,France,Germany,Italy,Russia,Turkey";
const channelId = "Austria,Russia";
const chatChannelUrl = generatePath(RouteConfig.GameChatChannel, {
  gameId,
  channelId,
});
const everyoneChannelUrl = generatePath(RouteConfig.GameChatChannel, {
  gameId,
  channelId: everyoneChannelId,
});

interface WrappedChannelProps {
  path?: string;
  history: MemoryHistory<unknown>;
}

export const WrappedChannel = ({ path, history }: WrappedChannelProps) => {
  history.push(path || "/");
  return (
    <ThemeProvider theme={theme}>
      <StyledEngineProvider injectFirst>
        <Router history={history}>
          <Switch>
            <Route path={RouteConfig.GameChatChannel}>
              <Provider store={createTestStore()}>
                <ChatChannel />
              </Provider>
            </Route>
          </Switch>
        </Router>
      </StyledEngineProvider>
    </ThemeProvider>
  );
};

const userSeesMessages = async (): Promise<HTMLElement[]> => {
  return await waitFor(() => screen.getAllByTestId("message"));
};

const userSeesBackButton = async (): Promise<HTMLElement> => {
  return await waitFor(() => screen.getByTitle("back"));
};

const getMessageInput = async () => {
  return await waitFor(() => screen.getByLabelText("Message"));
};

const userFillsMessageInput = async (message: string) => {
  const input = await getMessageInput();
  fireEvent.change(input, { target: { value: message } });
};

const userClicksSendButton = async () => {
  const button = await waitFor(() => screen.getByTitle("Send message"));
  fireEvent.click(button);
};

const getAvatarFromTopBar = async (nation: string): Promise<Element | null> => {
  const topBar = screen.getByTestId("channel-top-bar");
  return queryByTitle(topBar, nation);
};

const getChannelTitle = async (): Promise<string | undefined> => {
  const topBar = screen.getByTestId("channel-top-bar");
  return topBar.querySelector("h2")?.innerHTML;
};

const messageHasText = async (
  message: HTMLElement,
  text: string
): Promise<void> => {
  const messageText = message.querySelector(".message-text");
  expect(messageText).toBeTruthy();
  expect(messageText?.innerHTML).toContain(text);
};

const getMessageStatus = async (
  message: HTMLElement
): Promise<string | undefined | null> => {
  const messageStatus = message.querySelector(".message-status");
  expect(messageStatus).toBeTruthy();
  return messageStatus?.textContent;
};

let history: MemoryHistory<unknown>;

describe("ChatChannel functional tests", () => {
  let fetchSpy: jest.SpyInstance;

  beforeEach(() => {
    fetchSpy = jest.spyOn(global, "fetch");
    history = createMemoryHistory();
  });

  test("Shows loading spinner when loading", async () => {
    render(<WrappedChannel path={chatChannelUrl} history={history} />);
    await userSeesLoadingSpinner();
  });

  test("Hits endpoints correctly", async () => {
    render(<WrappedChannel path={chatChannelUrl} history={history} />);
    await userSeesLoadingSpinner();
    const [
      firstCall,
      secondCall,
      thirdCall,
      fourthCall,
      fifthCall,
      sixthCall,
    ] = fetchSpy.mock.calls.map((call) => call[0] as Request);
    expect(fetchSpy.mock.calls.length).toBe(6);
    expect(firstCall.url).toBe(`${diplicityServiceURL}Variants`);
    expect(secondCall.url).toBe(`${diplicityServiceURL}Game/${gameId}/Phases`);
    expect(thirdCall.url).toBe(`${diplicityServiceURL}`);
    expect(fourthCall.url).toBe(
      `${diplicityServiceURL}Game/${gameId}/Channels`
    );
    expect(fifthCall.url).toBe(
      `${diplicityServiceURL}Game/${gameId}/Channel/${channelId}/Messages`
    );
    expect(sixthCall.url).toBe(`${diplicityServiceURL}Game/${gameId}`);
  });

  test("User sees messages", async () => {
    render(<WrappedChannel path={chatChannelUrl} history={history} />);
    const messages = await userSeesMessages();
    expect(messages.length).toBe(3);
  });

  test("Messages appear in correct order", async () => {
    render(<WrappedChannel path={chatChannelUrl} history={history} />);
    const messages = await userSeesMessages();
    const [firstMessage, secondMessage, thirdMessage] = messages;
    await messageHasText(
      firstMessage,
      "Please note that all messages become public after the game ends."
    );
    await messageHasText(
      secondMessage,
      "If you help me into Romania you can have the rest of the Balkans I want to get out of the black sea"
    );
    await messageHasText(thirdMessage, "Yep Rumania is all yours");
  });

  test("Chat channel go back button is anchor", async () => {
    render(<WrappedChannel path={chatChannelUrl} history={history} />);
    await userSeesMessages();
    const backButton = await userSeesBackButton();
    expect(backButton.nodeName).toBe("A");
  });

  test("Shows member avatar in channel", async () => {
    render(<WrappedChannel path={chatChannelUrl} history={history} />);
    await userSeesMessages();
    const avatar = await getAvatarFromTopBar("Russia");
    expect(avatar).toBeTruthy();
  });

  test("Does not show other avatar in channel", async () => {
    render(<WrappedChannel path={chatChannelUrl} history={history} />);
    await userSeesMessages();
    const avatar = await getAvatarFromTopBar("Austria");
    expect(avatar).toBeNull();
  });

  test("Shows 'Everyone' in channel if everyone is a member", async () => {
    render(<WrappedChannel path={everyoneChannelUrl} history={history} />);
    await userSeesMessages();
    const channelTitle = await getChannelTitle();
    expect(channelTitle).toBe("Everyone");
  });

  test("Shows UN flag in channel if everyone is a member", async () => {
    render(<WrappedChannel path={everyoneChannelUrl} history={history} />);
    await userSeesMessages();
    const avatar = await getAvatarFromTopBar("Everyone");
    const img = avatar?.querySelector('img');
    expect(img?.getAttribute("src")).toContain("un_logo");
  });

  test("Shows nation in channel title", async () => {
    render(<WrappedChannel path={chatChannelUrl} history={history} />);
    await userSeesMessages();
    const channelTitle = await getChannelTitle();
    expect(channelTitle).toBe("Russia");
  });

  test("Shows date for message", async () => {
    render(<WrappedChannel path={chatChannelUrl} history={history} />);
    const [message] = await userSeesMessages();
    const status = await getMessageStatus(message);
    expect(status?.includes("48:49")).toBeTruthy();
  });

  test("Shows username for Diplicity", async () => {
    render(<WrappedChannel path={chatChannelUrl} history={history} />);
    const messages = await userSeesMessages();
    const [message] = messages;
    getByText(message, "Diplicity");
  });

  test("Shows nation name for member", async () => {
    render(<WrappedChannel path={chatChannelUrl} history={history} />);
    const messages = await userSeesMessages();
    const message = messages[1];
    getByText(message, "Russia");
  });

  test("Shows avatar beside message", async () => {
    render(<WrappedChannel path={chatChannelUrl} history={history} />);
    const messages = await userSeesMessages();
    const message = messages[1];
    getByTitle(message.parentNode as HTMLElement, "Russia");
  });

  test("Shows other user's messages on the left", async () => {
    render(<WrappedChannel path={chatChannelUrl} history={history} />);
    const messages = await userSeesMessages();
    const messageContainer = messages[1].parentNode as HTMLElement;
    const flexDirection = getComputedStyle(messageContainer).getPropertyValue(
      "flex-direction"
    );
    expect(flexDirection).toBe("row");
  });

  test("Shows user's messages on the right", async () => {
    render(<WrappedChannel path={chatChannelUrl} history={history} />);
    const messages = await userSeesMessages();
    const messageContainer = messages[2].parentNode as HTMLElement;
    const flexDirection = getComputedStyle(messageContainer).getPropertyValue(
      "flex-direction"
    );
    expect(flexDirection).toBe("row-reverse");
  });

  test("Shows phase before first message", async () => {
    render(<WrappedChannel path={chatChannelUrl} history={history} />);
    await userSeesMessages();
    screen.getByText("Spring 1901, Movement", { exact: false });
  });

  test("Text input appears when user is member of channel", async () => {
    render(<WrappedChannel path={chatChannelUrl} history={history} />);
    await userSeesMessages();
    screen.getByLabelText("Message");
  });

  test("Text input doesn't appear when user not member of channel", async () => {
    server.use(handlers.getGame.successUserNotMember);
    render(<WrappedChannel path={chatChannelUrl} history={history} />);
    await userSeesMessages();
    const messageInput = screen.queryByLabelText("Message");
    expect(messageInput).toBeNull();
  });

  test("Shows new messages banner if new messages", async () => {
    render(<WrappedChannel path={chatChannelUrl} history={history} />);
    await userSeesMessages();
    screen.getByText("New messages");
  });

  test("Clicking on send button sends message", async () => {
    render(<WrappedChannel path={chatChannelUrl} history={history} />);
    await userSeesMessages();
    await userFillsMessageInput("Test message");
    await userClicksSendButton();

    const call = fetchSpy.mock.calls.map((call) => call[0] as Request)[6];
    expect(fetchSpy.mock.calls.length).toBe(7);
    expect(call.url).toBe(`${diplicityServiceURL}Game/${gameId}/Messages`);
    const body = await call.json();
    expect(body.Body).toBe("Test message");
    expect(JSON.stringify(body.ChannelMembers)).toBe(
      JSON.stringify(["Austria", "Russia"])
    );
  });

  test("Clicking on send button does not send message if whitespace", async () => {
    render(<WrappedChannel path={chatChannelUrl} history={history} />);
    await userSeesMessages();
    await userFillsMessageInput("");
    await userClicksSendButton();
    expect(fetchSpy).toBeCalledTimes(6);
  });

  test.todo("Input is disabled when message is being sent");

  test.todo("Input is cleared when message is sent");

  test.todo("Input is not cleared when message is unsuccessful");

  test.todo("Clicking on send button does not send message if empty");

  test.todo("Ctrl + Enter sends message");

  test.todo("Shows 'sending...' for undelivered message");

  test("Chat channel list variants api error", async () => {
    server.use(handlers.variants.internalServerError);
    render(<WrappedChannel path={chatChannelUrl} history={history} />);
    await userSeesInternalServerErrorMessage();
  });

  test("Chat channel get game api error", async () => {
    server.use(handlers.getGame.internalServerError);
    render(<WrappedChannel path={chatChannelUrl} history={history} />);
    await userSeesInternalServerErrorMessage();
  });

  test("Chat channel get root api error", async () => {
    server.use(handlers.getUser.internalServerError);
    render(<WrappedChannel path={chatChannelUrl} history={history} />);
    await userSeesInternalServerErrorMessage();
  });

  test("Chat channel list channels api error", async () => {
    server.use(handlers.listChannels.internalServerError);
    render(<WrappedChannel path={chatChannelUrl} history={history} />);
    await userSeesInternalServerErrorMessage();
  });

  test("Chat channel list messages api error", async () => {
    server.use(handlers.messages.internalServerError);
    render(<WrappedChannel path={chatChannelUrl} history={history} />);
    await userSeesInternalServerErrorMessage();
  });

  test("Chat channel list phases api error", async () => {
    server.use(handlers.listPhases.internalServerError);
    render(<WrappedChannel path={chatChannelUrl} history={history} />);
    await userSeesInternalServerErrorMessage();
  });
});
