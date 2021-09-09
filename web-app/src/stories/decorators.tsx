import { StoryFnReactReturnType } from "@storybook/react/dist/ts3.9/client/preview/types";

import { IUseChatMessagesList, ChatMessagesListStub } from "../hooks/useChatMessagesList";

export const getChatMessagesListDecorator = (values: IUseChatMessagesList) => {
  return (Story: () => StoryFnReactReturnType) => (
    <ChatMessagesListStub.Provider value={() => values}>
      <Story />
    </ChatMessagesListStub.Provider>
  );
};
