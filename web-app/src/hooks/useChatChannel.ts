import { createContext, useContext, useEffect, useState } from "react";

import {
  Game,
  Member,
  Message as StoreMessage,
  Phase,
  User,
  Variant,
  getNationAbbreviation,
  getNationColor,
  getNationFlagLink,
} from "@diplicity/common";
import {
} from "../utils/general";
import { useSelectChannel, useSelectVariant } from "./selectors";
import {
  useCreateMessageMutation,
  useGetGameQuery,
  useGetRootQuery,
  useListChannelsQuery,
  useListMessagesQuery,
  useListPhasesQuery,
  useListVariantsQuery,
} from "./service";
import { Message, Channel, ApiError } from "./types";
import { getChannel, getMember, mergeErrors } from "./utils";

export interface IUseChatChannel {
  isError: boolean;
  isLoading: boolean;
  messages: Message[];
  channel: Channel | null;
  error: ApiError | null;
  sendMessage: (body: string) => void;
  undelivered: boolean;
}

const asDate = (dateString: string) =>
  new Date(Date.parse(dateString)).getTime();

const createdBeforeMessage = (phase: Phase, message: StoreMessage) =>
  asDate(phase.CreatedAt) <= asDate(message.CreatedAt);

// TODO it would be much nicer to push this into store/selectors
const enhanceMessage = (
  message: StoreMessage,
  phases: Phase[],
  game: Game,
  variant: Variant,
  user: User,
  undelivered: boolean
): Message => {
  let currentPhase = phases[0];
  phases.forEach((phase) => {
    if (createdBeforeMessage(phase, message)) {
      currentPhase = phase;
    }
  });
  const color = getNationColor(variant, message.Sender);
  const nationAbbreviation = getNationAbbreviation(variant, message.Sender);
  const link = getNationFlagLink(variant, message.Sender);
  const member = getMember(game, user);
  const selfish = member?.Nation === message.Sender;
  return {
    ...message,
    color,
    phase: currentPhase,
    undelivered,
    variant: game.Variant,
    selfish,
    nationAbbreviation,
    link,
  };
};

const useChatChannel = (gameId: string, channelId: string): IUseChatChannel => {
  const {
    error: variantsError,
    isLoading: variantsIsLoading,
    isError: variantsIsError,
  } = useListVariantsQuery(undefined);
  const {
    data: phases,
    error: phasesError,
    isLoading: phasesIsLoading,
    isError: phasesIsError,
    isSuccess: phasesIsSuccess,
  } = useListPhasesQuery(gameId);
  const {
    data: user,
    error: userError,
    isLoading: userIsLoading,
    isError: userIsError,
  } = useGetRootQuery(undefined);
  const {
    error: channelsError,
    isLoading: channelsIsLoading,
    isError: channelsIsError,
  } = useListChannelsQuery(gameId);
  const {
    data: messages,
    error: messagesError,
    isLoading: messagesIsLoading,
    isError: messagesIsError,
    isSuccess: messagesIsSuccess,
  } = useListMessagesQuery({ gameId, channelId });
  const {
    data: game,
    error: gameError,
    isLoading: gameIsLoading,
    isError: gameIsError,
    isSuccess: gameIsSuccess,
  } = useGetGameQuery(gameId);

  const [channel, setChannel] = useState<Channel | null>(null);
  const [undeliveredMessage, setUndeliveredMessage] = useState<Message | null>(
    null
  );
  const variant = useSelectVariant(game?.Variant || "");
  const [createMessage, { isLoading: undelivered }] =
    useCreateMessageMutation(undefined);

  useEffect(() => {
    if (!undelivered) setUndeliveredMessage(null);
  }, [undelivered]);

  const [enhancedMessages, setEnhancedMessages] = useState<Message[]>([]);

  const storeChannel = useSelectChannel(gameId, channelId);

  const isLoading =
    variantsIsLoading ||
    phasesIsLoading ||
    messagesIsLoading ||
    gameIsLoading ||
    channelsIsLoading ||
    userIsLoading;
  const isError =
    variantsIsError || phasesIsError || messagesIsError || gameIsError || channelsIsError || userIsError;
  const isSuccess = phasesIsSuccess || messagesIsSuccess || gameIsSuccess;
  const error = isError
    ? mergeErrors(
        variantsError as ApiError,
        userError as ApiError,
        gameError as ApiError,
        channelsError as ApiError,
        messagesError as ApiError,
        phasesError as ApiError
      )
    : null;

  useEffect(() => {
    if (game && variant && storeChannel && user) {
      setChannel(getChannel(storeChannel, variant, game, user));
    }
  }, [game, variant, storeChannel, user]);

  useEffect(() => {
    if (isSuccess && messages && phases && game && variant && user) {
      setEnhancedMessages(
        messages.map((message) =>
          enhanceMessage(message, phases, game, variant, user, false)
        )
      );
    }
  }, [isSuccess, messages, phases, game, variant, user]);

  // TODO it would be much nicer to push this into store/selectors
  const sendMessage = (body: string) => {
    if (phases && game && variant && user) {
      createMessage({
        Body: body,
        ChannelMembers: channel?.Members as string[],
        gameId,
      });
      // Create undelivered message
      const time = new Date().toISOString();
      const member = getMember(game, user) as Member;
      const message: StoreMessage = {
        ID: "undelivered",
        Sender: member.Nation,
        Body: body,
        ChannelMembers: channel?.Members as string[],
        GameID: gameId,
        CreatedAt: time,
        Age: 0,
      };
      setUndeliveredMessage(
        enhanceMessage(message, phases, game, variant, user, true)
      );
    }
  };

  const allMessages = [...enhancedMessages, undeliveredMessage].filter(
    (message) => Boolean(message)
  ) as Message[];

  return {
    isError,
    isLoading,
    messages: allMessages,
    channel,
    sendMessage,
    undelivered,
    error,
  };
};

export const ChatChannelStub = createContext<null | typeof useChatChannel>(
  null
);

const useGetHook = (): ((
  gameId: string,
  channelId: string
) => IUseChatChannel) => {
  const mockUseChatChannel = useContext(ChatChannelStub);
  return mockUseChatChannel ? mockUseChatChannel : useChatChannel;
};

export default useGetHook;
