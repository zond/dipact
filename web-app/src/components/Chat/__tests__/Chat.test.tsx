import React from "react";

import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { generatePath, MemoryRouter, Route, Switch } from "react-router";
import "@testing-library/jest-dom/extend-expect";
import { setupServer } from "msw/node";

import { ChatMenu } from "..";
import { handlers } from "../../../mockService/handlers";
import { ReduxWrapper } from "../../../store/testUtils";
import { RouteConfig } from "../../../pages/RouteConfig";
import { diplicityServiceURL } from "../../../store/service";
import { EVERYONE } from "../../../hooks/useChatMenu";
import { NO_CHANNELS_MESSAGE } from "../ChatMenu";

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

interface WrappedChatMenuProps {
  initialEntries?: string[];
}

const WrappedChatMenu = ({ initialEntries }: WrappedChatMenuProps) => (
  <MemoryRouter initialEntries={initialEntries}>
    <Switch>
      <Route path={RouteConfig.Game}>
        <ReduxWrapper>
          <ChatMenu />
        </ReduxWrapper>
      </Route>
    </Switch>
  </MemoryRouter>
);

const gameId = "game-1234";
const chatTabParams = "?tab=chat";
const chatMenuUrl = generatePath(RouteConfig.Game, { gameId }) + chatTabParams;

const userSeesLoadingSpinner = async () => {
  await waitFor(() => screen.getByRole("progressbar"));
};

const userSeesChatChannelPreviews = async (): Promise<HTMLElement[]> => {
  const chatChannelPreviews = await waitFor(() => screen.getAllByTitle("Chat channel preview"));
  return chatChannelPreviews;
};

const userSeesNoChatChannelsMessage = async () => {
  await waitFor(() => screen.getByText(NO_CHANNELS_MESSAGE));
};

const userClicksChannelPreview = async (channel: HTMLElement) => {
  await fireEvent.click(channel);
};

const userSeesChannelTitle = async () => {
  await waitFor(() => screen.getByRole("progressbar"));
};

const channelPreviewHasTitle = async (channel: HTMLElement, title: string): Promise<void> => {
  const header = channel.querySelector("h4");
  expect(header).toBeTruthy();
  expect(header?.innerHTML).toContain(title);
}

describe("Chat functional tests", () => {

  let fetchSpy: jest.SpyInstance;

  beforeEach(() => {
    fetchSpy = jest.spyOn(global, "fetch");
  })

  test("Shows loading spinner when loading", async () => {
    server.use(handlers.variants.successShort, handlers.getGame.success, handlers.listChannels.success);
    render(<WrappedChatMenu initialEntries={[chatMenuUrl]} />);
    await userSeesLoadingSpinner();
  });

  test("Hits endpoints correctly", async () => {
    server.use(handlers.variants.successShort, handlers.getGame.success, handlers.listChannels.success);
    render(<WrappedChatMenu initialEntries={[chatMenuUrl]} />);
    await userSeesLoadingSpinner();
    const [firstCall, secondCall, thirdCall] = fetchSpy.mock.calls.map((call) => call[0] as Request);
    expect(fetchSpy.mock.calls.length).toBe(3);
    expect(firstCall.url).toBe(`${diplicityServiceURL}Variants`);
    expect(secondCall.url).toBe(`${diplicityServiceURL}Game/${gameId}`);
    expect(thirdCall.url).toBe(`${diplicityServiceURL}Game/${gameId}/Channels`);
  });

  test("Show chat channel previews", async () => {
    server.use(handlers.variants.successShort, handlers.getGame.success, handlers.listChannels.success);
    render(<WrappedChatMenu initialEntries={[chatMenuUrl]} />);
    await userSeesChatChannelPreviews();
  });

  test("Show chat channel previews correct order", async () => {
    server.use(handlers.variants.successShort, handlers.getGame.success, handlers.listChannels.success);
    render(<WrappedChatMenu initialEntries={[chatMenuUrl]} />);
    const chatChannelPreviews = await userSeesChatChannelPreviews();
    expect(chatChannelPreviews.length).toBe(3);
    const [firstChannel, secondChannel, thirdChannel] = chatChannelPreviews;
    await channelPreviewHasTitle(firstChannel, EVERYONE);
    await channelPreviewHasTitle(secondChannel, "Diplicity");
    await channelPreviewHasTitle(thirdChannel, "Russia");
  });

  test("Shows message when no chat channels", async () => {
    server.use(handlers.variants.successShort, handlers.getGame.success, handlers.listChannels.successNoChannels);
    render(<WrappedChatMenu initialEntries={[chatMenuUrl]} />);
    await userSeesNoChatChannelsMessage();
  });

  test("Clicking on preview button Shows chat channel", async () => {
    server.use(handlers.variants.successShort, handlers.getGame.success, handlers.listChannels.success);
    render(<WrappedChatMenu initialEntries={[chatMenuUrl]} />);
    const [firstChannel] = await userSeesChatChannelPreviews();
    await userClicksChannelPreview(firstChannel);
    await userSeesChannelTitle();
  });

  test("Shows loading spinner in channel", () => {});

  test("Shows italicised 'you' when preview message sent by user", () => {});

  test("Shows member avatars in preview", () => {});

  test("Shows UN flag when channel includes everyone", () => {});

  test("Shows 'Everyone' when channel includes everyone", () => {});

  test("Does not show member nation in title", () => {});

  test("Shows messages count", () => {});

  test("Shows messages count - no messages", () => {});

  test("Does not show create channel button when user is not member", () => {});

  test("Shows create channel button when user is member", () => {});

  test("Shows disabled channel button when loading", () => {});

  test("Clicking create channel button shows create channel dialog", () => {});

  test("Inside create channel dialog, create button is disabled if loading", () => {});

  test("Member's nation is disabled and checked when creating channel", () => {});

  test("Trying to create invalid channel shows error message", () => {});

  test("Opening create chat channel dialog adds querystring parameter", () => {});

  test("Querystring present opens create chat channel dialog", () => {});

  test("Cancel create channel hides dialog", () => {});

  test("Cancel create channel removes querystring parameter", () => {});

  test("Cancel create channel removes state when reopened", () => {});

  test("Creating channel shows newly created channel with participants", () => {});

  test("Abandonned channel without message does not appear", () => {});

  test("Opening chat channel adds querystring parameter", () => {});

  test("Chat menu go back button is anchor", () => {});

  test("Chat channel button is anchor", () => {});

  test("Chat channel go back button is anchor", () => {});

  test("Querystring present opens chat channel", () => {});

  test("Shows member avatars in channel", () => {});

  test("Shows 'Everyone' in channel if everyone is a member", () => {});

  test("Shows UN flag in channel if everyone is a member", () => {});

  test("Shows comma separated nations in channel", () => {});

  test("Shows message inside chat channel", () => {});

  test("Shows date for message", () => {});

  test("Shows username for Diplicity", () => {});

  test("Shows nation name for member", () => {});

  test("Shows avatar beside message", () => {});

  test("Shows user's messages on the left", () => {});

  test("Shows multiple messages in correct order", () => {});

  test("Shows phase before first message of each phase", () => {});

  test("Shows new messages banner if new messages", () => {});

  test("Clicking on send button sends message", () => {});

  test("Clicking on send button does not send message if empty", () => {});

  test("Clicking on send button does not send message if whitespace", () => {});

  test("Ctrl + Enter sends message", () => {});

  test("Shows 'sending...' for undelivered message", () => {});

  test("Updates messages once message is sent", () => {});

  test("Clicking on top bar closes chat channel", () => {});

  test("Chat channel unauthorized", () => {});

  test("Chat channel internal server error", () => {});

  // TODO caching
});
