import { StoryFnReactReturnType } from "@storybook/react/dist/ts3.9/client/preview/types";

import {
  IUseChatMessagesList,
  ChatMessagesListStub,
} from "../hooks/useChatMessagesList";
import {
  IUseOrders,
  useDIContext as useOrdersDIContext,
} from "../hooks/useOrders";
import { IUsePhaseSelector, useDIContext as usePhaseSelectorContext } from "../hooks/usePhaseSelector";

export const getChatMessagesListDecorator = (values: IUseChatMessagesList) => {
  return (Story: () => StoryFnReactReturnType) => (
    <ChatMessagesListStub.Provider value={() => values}>
      <Story />
    </ChatMessagesListStub.Provider>
  );
};

export const ordersDecorator = (values: IUseOrders) => {
  return (Story: () => StoryFnReactReturnType) => (
    <useOrdersDIContext.Provider value={() => values}>
      <Story />
    </useOrdersDIContext.Provider>
  );
};

export const phaseSelectorDecorator = (values: IUsePhaseSelector) => {
  return (Story: () => StoryFnReactReturnType) => (
    <usePhaseSelectorContext.Provider value={() => values}>
      <Story />
    </usePhaseSelectorContext.Provider>
  );
};
