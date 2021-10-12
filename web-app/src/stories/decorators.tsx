import { StoryFnReactReturnType } from "@storybook/react/dist/ts3.9/client/preview/types";

import { IUseChatMessagesList, ChatMessagesListStub } from "../hooks/useChatMessagesList";
import { IUseOrders, OrdersStub } from "../hooks/useOrders";

export const getChatMessagesListDecorator = (values: IUseChatMessagesList) => {
  return (Story: () => StoryFnReactReturnType) => (
    <ChatMessagesListStub.Provider value={() => values}>
      <Story />
    </ChatMessagesListStub.Provider>
  );
};

export const ordersDecorator = (values: IUseOrders) => {
  return (Story: () => StoryFnReactReturnType) => (
    <OrdersStub.Provider value={() => values}>
      <Story />
    </OrdersStub.Provider>
  );
};