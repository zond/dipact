import { createContext, useContext, useEffect, useState } from "react";

import { Game, Message as StoreMessage, Phase, Variant } from "../store/types";
import { getNationAbbreviation, getNationColor, getNationFlagLink } from "../utils/general";
import { useSelectChannel, useSelectVariant } from "./selectors";
import {
  useGetGameQuery,
  useGetRootQuery,
  useListChannelsQuery,
  useListMessagesQuery,
  useListPhasesQuery,
} from "./service";
import { Message, Channel } from './types';
import { getChannel } from "./utils";

export interface IUseChatChannel {
  isError: boolean;
  isLoading: boolean;
  messages: Message[];
  channel: Channel | null;
}

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

const useChatChannel = (
  gameId: string,
  channelId: string
): IUseChatChannel => {
  const {
    data: phases,
    isLoading: phasesIsLoading,
    isError: phasesIsError,
    isSuccess: phasesIsSuccess,
  } = useListPhasesQuery(gameId);
  const {
    data: user,
    isLoading: userIsLoading,
    isError: userIsError,
    isSuccess: userIsSuccess,
  } = useGetRootQuery(undefined);
  const {
    isLoading: channelsIsLoading,
    isError: channelsIsError,
    isSuccess: channelsIsSuccess,
  } = useListChannelsQuery(gameId);
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
  const [channel, setChannel] = useState<Channel | null>(null);
  const variant = useSelectVariant(game?.Variant || "");

  const [enhancedMessages, setEnhancedMessages] = useState<Message[]>([]);

  const storeChannel = useSelectChannel(gameId, channelId);

  const isLoading = phasesIsLoading || messagesIsLoading || gameIsLoading || channelsIsLoading || userIsLoading;
  const isError = phasesIsError || messagesIsError || gameIsError;
  const isSuccess = phasesIsSuccess || messagesIsSuccess || gameIsSuccess;

  useEffect(() => {
    if (game && variant && storeChannel && user) {
      setChannel(getChannel(storeChannel, variant, game, user));
    }
  }, [game, variant, storeChannel, user]);

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
    channel,
  };
};

export const ChatChannelStub = createContext<
  null | typeof useChatChannel
>(null);

const useGetHook = (): ((
  gameId: string,
  channelId: string
) => IUseChatChannel) => {
  const mockUseChatChannel = useContext(ChatChannelStub);
  return mockUseChatChannel
    ? mockUseChatChannel
    : useChatChannel;
};

export default useGetHook;
