import { StoryFnReactReturnType } from "@storybook/react/dist/ts3.9/client/preview/types";

import { IUseChatMessage } from "../hooks/useChatMessage";
import { ChatMessageStub } from "../hooks/useChatMessage";

export const getChatMessageStubDecorator = (values: IUseChatMessage) => {
  return (Story: () => StoryFnReactReturnType) => (
    <ChatMessageStub.Provider value={() => values}>
      <Story />
    </ChatMessageStub.Provider>
  );
};
