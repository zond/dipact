import { createContext, useContext } from "react";
import { useSelectNationColor } from "./selectors";

export interface IUseChatMessage {
  color: string;
}

const useChatMessage = (nation: string, variant: string): IUseChatMessage => {
  const color = useSelectNationColor(variant, nation);
  return { color }
}

export const ChatMessageStub = createContext<null | typeof useChatMessage>(null);

const useGetHook = (): (gameId: string, chatChannelId: string) => IUseChatMessage => {
  const mockUseChatMessage = useContext(ChatMessageStub);
  return mockUseChatMessage ? mockUseChatMessage : useChatMessage;
}

export default useGetHook;
