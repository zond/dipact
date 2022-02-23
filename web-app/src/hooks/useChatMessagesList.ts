import { createContext, useContext, useEffect, useState } from "react";

import {
  Game,
  Message as StoreMessage,
  Phase,
  Variant,
  getNationAbbreviation,
  getNationColor,
  getNationFlagLink,
} from "@diplicity/common";
import { useSelectVariant } from "./selectors";
import {
  useGetGameQuery,
  useListMessagesQuery,
  useListPhasesQuery,
} from "./service";

export interface IUseChatMessagesList {
  isError: boolean;
  isLoading: boolean;
  messages: Message[];
}

export type Message = StoreMessage & {
  phase: Phase;
  undelivered: boolean;
  color: string;
  variant: string;
  selfish: boolean;
  nationAbbreviation: string;
  link: string | undefined;
};

const asDate = (dateString: string) =>
  new Date(Date.parse(dateString)).getTime();

const resolvedBeforeMessage = (phase: Phase, message: StoreMessage) =>
  asDate(phase.ResolvedAt) <= asDate(message.CreatedAt);

const enhanceMessage = (
  message: StoreMessage,
  phases: Phase[],
  game: Game,
  variant: Variant
): Message => {
  let currentPhase = phases[0];
  phases.forEach((phase) => {
    if (resolvedBeforeMessage(phase, message)) {
      currentPhase = phase;
    }
  });
  const color = getNationColor(variant, message.Sender);
  const nationAbbreviation = getNationAbbreviation(variant, message.Sender);
  const link = getNationFlagLink(variant, message.Sender);
  return {
    ...message,
    color,
    phase: currentPhase,
    undelivered: false,
    variant: game.Variant,
    selfish: false,
    nationAbbreviation,
    link,
  };
};

const useChatMessagesList = (
  gameId: string,
  channelId: string
): IUseChatMessagesList => {
  const {
    data: phases,
    isLoading: phasesIsLoading,
    isError: phasesIsError,
    isSuccess: phasesIsSuccess,
  } = useListPhasesQuery(gameId);
  const {
    data: messages,
    isLoading: messagesIsLoading,
    isError: messagesIsError,
    isSuccess: messagesIsSuccess,
  } = useListMessagesQuery({ gameId, channelId });
  const {
    data: game,
    isLoading: gameIsLoading,
    isError: gameIsError,
    isSuccess: gameIsSuccess,
  } = useGetGameQuery(gameId);
  const variant = useSelectVariant(game?.Variant || "");

  const [enhancedMessages, setEnhancedMessages] = useState<Message[]>([]);

  const isLoading = phasesIsLoading || messagesIsLoading || gameIsLoading;
  const isError = phasesIsError || messagesIsError || gameIsError;
  const isSuccess = phasesIsSuccess || messagesIsSuccess || gameIsSuccess;

  useEffect(() => {
    if (isSuccess && messages && phases && game && variant) {
      setEnhancedMessages(
        messages.map((message) =>
          enhanceMessage(message, phases, game, variant)
        )
      );
    }
  }, [isSuccess, messages, phases, game, variant]);

  return {
    isError,
    isLoading,
    messages: enhancedMessages,
  };
};

export const ChatMessagesListStub =
  createContext<null | typeof useChatMessagesList>(null);

const useGetHook = (): ((
  gameId: string,
  chatChannelId: string
) => IUseChatMessagesList) => {
  const mockUseChatMessagesList = useContext(ChatMessagesListStub);
  return mockUseChatMessagesList
    ? mockUseChatMessagesList
    : useChatMessagesList;
};

export default useGetHook;
