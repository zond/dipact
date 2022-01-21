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
import ChatMenu from "../ChatMenu";
import {
  userSeesInternalServerErrorMessage,
  userSeesLoadingSpinner,
} from "../testUtils";
import { ThemeProvider, StyledEngineProvider } from "@mui/material";
import theme from "../../theme";
import tk from "../../translations/translateKeys";

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

interface WrappedChatMenuProps {
  path?: string;
}

let history: MemoryHistory<unknown>;

const WrappedChatMenu = ({ path }: WrappedChatMenuProps) => {
  history = createMemoryHistory();
  history.push(path || "/");
  return (
    <ThemeProvider theme={theme}>
      <StyledEngineProvider injectFirst>
        <Router history={history}>
          <Switch>
            <Route path={RouteConfig.Game}>
              <ReduxWrapper>
                <ChatMenu />
              </ReduxWrapper>
            </Route>
          </Switch>
        </Router>
      </StyledEngineProvider>
    </ThemeProvider>
  );
};

const gameId = "game-1234";
const chatMenuUrl = generatePath(RouteConfig.GameChat, { gameId });

const userSeesChatChannelPreviews = async (): Promise<HTMLElement[]> => {
  const chatChannelPreviews = await waitFor(() =>
    screen.getAllByTitle("Chat channel preview")
  );
  return chatChannelPreviews;
};

const userSeesNoChatChannelsMessage = async () => {
  await waitFor(() => screen.getByText(tk.chatMenu.noChannelsMessage));
};

const userDoesNotSeeCreateChannelButton = async () => {
  const button = screen.queryByTitle(tk.chatMenu.createChannelButton.title);
  expect(button).toBeNull();
};

const userSeesCreateChannelButton = async () => {
  await waitFor(() => screen.getByTitle(tk.chatMenu.createChannelButton.title));
};

const userClicksCreateChannelButton = async () => {
  const button = await waitFor(() => screen.getByTitle(tk.chatMenu.createChannelButton.title));
  fireEvent.click(button);
};

const userClicksCancelCreateChannel = async () => {
  const button = await waitFor(() => screen.getByText("Cancel"));
  fireEvent.click(button);
};

const userSeesCreateChannelDialog = async () => {
  await waitFor(() => screen.getByText("Create channel"));
  await waitFor(() =>
    screen.getByText("Pick the participants of the new channel.")
  );
};

const userDoesNotSeeCreateChannelDialog = async () => {
  const title = screen.queryByText("Create channel");
  expect(title).toBeNull();
};

const channelPreviewHasTitle = async (
  channel: HTMLElement,
  title: string
): Promise<void> => {
  const header = channel.querySelector("h4");
  expect(header).toBeTruthy();
  expect(header?.innerHTML).toContain(title);
};

const getAvatarFromPreview = async (
  channel: HTMLElement,
  nation: string
): Promise<Element | null> => {
  const parent = channel.parentElement as Element;
  return parent.querySelector(`img[alt="${nation}"]`);
};

describe("ChatMenu functional tests", () => {
  let fetchSpy: jest.SpyInstance;

  beforeEach(() => {
    fetchSpy = jest.spyOn(global, "fetch");
  });

  test("Shows loading spinner when loading", async () => {
    render(<WrappedChatMenu path={chatMenuUrl} />);
    await userSeesLoadingSpinner();
  });

  test("Hits endpoints correctly", async () => {
    render(<WrappedChatMenu path={chatMenuUrl} />);
    await userSeesLoadingSpinner();
    const [
      firstCall,
      secondCall,
      thirdCall,
      fourthCall,
    ] = fetchSpy.mock.calls.map((call) => call[0] as Request);
    expect(fetchSpy.mock.calls.length).toBe(4);
    expect(firstCall.url).toBe(`${diplicityServiceURL}Variants`);
    expect(secondCall.url).toBe(`${diplicityServiceURL}`);
    expect(thirdCall.url).toBe(`${diplicityServiceURL}Game/${gameId}`);
    expect(fourthCall.url).toBe(
      `${diplicityServiceURL}Game/${gameId}/Channels`
    );
  });

  test("Show chat channel previews", async () => {
    render(<WrappedChatMenu path={chatMenuUrl} />);
    await userSeesChatChannelPreviews();
  });

  test("Show chat channel previews correct order", async () => {
    render(<WrappedChatMenu path={chatMenuUrl} />);
    const chatChannelPreviews = await userSeesChatChannelPreviews();
    expect(chatChannelPreviews.length).toBe(3);
    const [firstChannel, secondChannel, thirdChannel] = chatChannelPreviews;
    await channelPreviewHasTitle(firstChannel, EVERYONE);
    await channelPreviewHasTitle(secondChannel, "Russia");
    await channelPreviewHasTitle(thirdChannel, "Diplicity");
  });

  test("Shows message when no chat channels", async () => {
    render(<WrappedChatMenu path={chatMenuUrl} />);
    await userSeesNoChatChannelsMessage();
  });

  test("Shows italicised 'you' when preview message sent by user", async () => {
    render(<WrappedChatMenu path={chatMenuUrl} />);
    await userSeesChatChannelPreviews();
    const senderLabels = await screen.findAllByTitle("sender");
    const senderLabel = senderLabels[1];
    const fontStyle = getComputedStyle(senderLabel).getPropertyValue(
      "font-style"
    );
    const label = senderLabel.innerHTML;
    expect(label).toBe("You: ");
    expect(fontStyle).toBe("italic");
  });

  test("Shows nation name as sender label - no italics", async () => {
    render(<WrappedChatMenu path={chatMenuUrl} />);
    await userSeesChatChannelPreviews();
    const senderLabels = await screen.findAllByTitle("sender");
    const senderLabel = senderLabels[0];
    const fontStyle = getComputedStyle(senderLabel).getPropertyValue(
      "font-style"
    );
    const label = senderLabel.innerHTML;
    expect(label).toBe("England: ");
    expect(fontStyle).toBe("inherit");
  });

  // test("Shows avatar in preview", async () => {
  //   render(<WrappedChatMenu path={chatMenuUrl} />);
  //   await userSeesChatChannelPreviews();
  //   const chatChannelPreviews = await userSeesChatChannelPreviews();
  //   const channel = chatChannelPreviews[1];
  //   const avatar = await getAvatarFromPreview(channel, "Russia");
  //   expect(avatar).toBeTruthy();
  // });

  test("Does not show member avatar in preview", async () => {
    render(<WrappedChatMenu path={chatMenuUrl} />);
    await userSeesChatChannelPreviews();
    const chatChannelPreviews = await userSeesChatChannelPreviews();
    const channel = chatChannelPreviews[1];
    const avatar = await getAvatarFromPreview(channel, "Austria");
    expect(avatar).toBeNull();
  });

  test("Shows UN flag when channel includes everyone", async () => {
    render(<WrappedChatMenu path={chatMenuUrl} />);
    await userSeesChatChannelPreviews();
    const chatChannelPreviews = await userSeesChatChannelPreviews();
    const channel = chatChannelPreviews[0];
    const avatar = await getAvatarFromPreview(channel, "Everyone");
    expect(avatar?.getAttribute("src")).toContain("un_logo");
  });

  test("Shows 'Everyone' when channel includes everyone", async () => {
    render(<WrappedChatMenu path={chatMenuUrl} />);
    await userSeesChatChannelPreviews();
    const chatChannelPreviews = await userSeesChatChannelPreviews();
    const [firstChannel] = chatChannelPreviews;
    await channelPreviewHasTitle(firstChannel, EVERYONE);
  });

  test("Does not show member nation in title", async () => {
    render(<WrappedChatMenu path={chatMenuUrl} />);
    await userSeesChatChannelPreviews();
    const chatChannelPreviews = await userSeesChatChannelPreviews();
    const channel = chatChannelPreviews[1];
    const header = channel.querySelector("h4");
    expect(header).toBeTruthy();
    expect(header?.innerHTML).not.toContain("Austria");
  });

  test("Shows messages count", async () => {
    render(<WrappedChatMenu path={chatMenuUrl} />);
    await userSeesChatChannelPreviews();
    const chatChannelPreviews = await userSeesChatChannelPreviews();
    const channel = chatChannelPreviews[1];
    const header = channel.querySelector("h4");
    expect(header).toBeTruthy();
    expect(header?.innerHTML).toContain("(3)");
  });

  test("Does not show create channel button when user is not member", async () => {
    server.use(handlers.getGame.successUserNotMember);
    render(<WrappedChatMenu path={chatMenuUrl} />);
    await userSeesChatChannelPreviews();
    await userDoesNotSeeCreateChannelButton();
  });

  test("Shows create channel button when user is member", async () => {
    render(<WrappedChatMenu path={chatMenuUrl} />);
    await userSeesChatChannelPreviews();
    await userSeesCreateChannelButton();
  });

  test("Clicking create channel button shows create channel dialog", async () => {
    render(<WrappedChatMenu path={chatMenuUrl} />);
    await userClicksCreateChannelButton();
    await userSeesCreateChannelDialog();
  });

  test("Member's nation is disabled and checked when creating channel", async () => {
    render(<WrappedChatMenu path={chatMenuUrl} />);
    await userClicksCreateChannelButton();
    const checkbox = await waitFor(() => screen.getByLabelText("Austria"));
    expect(checkbox).toHaveAttribute("disabled");
    expect(checkbox).toHaveAttribute("checked");
  });

  test("Other nation not disabled and unchecked when creating channel", async () => {
    render(<WrappedChatMenu path={chatMenuUrl} />);
    await userClicksCreateChannelButton();
    const checkbox = await waitFor(() => screen.getByLabelText("Germany"));
    expect(checkbox).not.toHaveAttribute("disabled");
    expect(checkbox).not.toHaveAttribute("checked");
  });

  test("Cancel create channel hides dialog", async () => {
    render(<WrappedChatMenu path={chatMenuUrl} />);
    await userClicksCreateChannelButton();
    await userClicksCancelCreateChannel();
    await userDoesNotSeeCreateChannelDialog();
  });

  test("Opening create chat channel dialog adds querystring parameter", async () => {
    render(<WrappedChatMenu path={chatMenuUrl} />);
    await userClicksCreateChannelButton();
    expect(history.location.search).toBe("?createChannelOpen=1");
  });

  test("Querystring present opens create chat channel dialog", async () => {
    render(<WrappedChatMenu path={chatMenuUrl + "?createChannelOpen=1"} />);
    await userSeesCreateChannelDialog();
  });

  test("Cancel create channel removes querystring parameter", async () => {
    render(<WrappedChatMenu path={chatMenuUrl} />);
    await userClicksCreateChannelButton();
    await userClicksCancelCreateChannel();
    expect(history.location.search).toBe("");
  });

  test("Trying to create invalid channel shows error message", () => {});

  test("Creating channel shows newly created channel with participants", () => {});

  test("Abandonned channel without message does not appear", () => {});

  test("Chat menu go back button is anchor", () => {});

  test("Chat channel button is anchor", () => {});

  test("Chat menu api error", () => {});

  test("Chat menu list variants api error", async () => {
    server.use(handlers.variants.internalServerError);
    render(<WrappedChatMenu path={chatMenuUrl} />);
    await userSeesInternalServerErrorMessage();
  });

  test("Chat menu get game api error", async () => {
    server.use(handlers.getGame.internalServerError);
    render(<WrappedChatMenu path={chatMenuUrl} />);
    await userSeesInternalServerErrorMessage();
  });

  test("Chat menu get root api error", async () => {
    server.use(handlers.getUser.internalServerError);
    render(<WrappedChatMenu path={chatMenuUrl} />);
    await userSeesInternalServerErrorMessage();
  });

  test("Chat menu list channels api error", async () => {
    server.use(handlers.listChannels.internalServerError);
    render(<WrappedChatMenu path={chatMenuUrl} />);
    await userSeesInternalServerErrorMessage();
  });
  // TODO caching
});
