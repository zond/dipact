import { useEffect, createContext, useContext, useState } from "react";
import { Game, Variant } from "@diplicity/common";
import { useSelectVariant } from "./selectors";
import {
  useGetGameQuery,
  useGetRootQuery,
  useListChannelsQuery,
  useListVariantsQuery,
} from "./service";
import { ApiError, Channel } from "./types";
import { getChannel, getMember, mergeErrors, sortChannels } from "./utils";

interface IUseChatMenu {
  channels: Channel[] | undefined;
  variant: Variant | null;
  userNation: string | undefined;
  isLoading: boolean;
  isError: boolean;
  error: ApiError | null;
  validationMessage: string | null;
  createChannel: (members: string[]) => void;
}

type Validator = (members: string[], game: Game, variant: Variant) => boolean;

const conferenceChatValidation = (
  members: string[],
  game: Game,
  variant: Variant
) => game.DisableConferenceChat && members.length === variant.Nations.length;
const conferenceChatValidationMessage =
  "Conference chat is disabled for this game, you can't create a channel with everyone as a member.";

const groupChatValidation = (members: string[], game: Game, variant: Variant) =>
  game.DisableGroupChat &&
  members.length > 2 &&
  members.length !== variant.Nations.length;
const groupChatValidationMessage =
  "Group chat is disabled for this game, you can't create a channel with more than two, but less than everyone, as members.";

const privateChatValidation = (
  members: string[],
  game: Game,
  variant: Variant
) => game.DisablePrivateChat && members.length === 2;
const privateChatValidationMessage =
  "Conference chat is disabled for this game, you can't create a channel with everyone as a member.";

const validators: [Validator, string][] = [
  [conferenceChatValidation, conferenceChatValidationMessage],
  [groupChatValidation, groupChatValidationMessage],
  [privateChatValidation, privateChatValidationMessage],
];

const useChatMenu = (gameId: string) => {
  const {
    isLoading: variantsIsLoading,
    isError: variantsIsError,
    error: variantsError,
  } = useListVariantsQuery(undefined);
  const {
    data: user,
    isLoading: userIsLoading,
    isError: userIsError,
    error: userError,
  } = useGetRootQuery(undefined);
  const {
    data: game,
    isLoading: gameIsLoading,
    isError: gameIsError,
    error: gameError,
  } = useGetGameQuery(gameId);
  const {
    data: storeChannels,
    isLoading: channelsIsLoading,
    isError: channelsIsError,
    error: channelsError,
  } = useListChannelsQuery(gameId);

  const [channels, setChannels] = useState<Channel[]>([]);
  const [userNation, setUserNation] = useState<string | undefined>(undefined);
  const variant = useSelectVariant(game?.Variant || "");

  const [validationMessage, setValidationMessage] = useState<null | string>(
    null
  );

  const createChannel = (members: string[]) => {
    if (!game || !variant) return;
    validators.forEach(([validator, message]) => {
      if (!validator(members, game, variant)) {
        setValidationMessage(message);
        return;
      }
    });
    console.log("Creating channel");
  };

  const isLoading =
    variantsIsLoading || channelsIsLoading || gameIsLoading || userIsLoading;
  const isError =
    variantsIsError || channelsIsError || gameIsError || userIsError;
  const error = isError
    ? mergeErrors(
        variantsError as ApiError,
        userError as ApiError,
        gameError as ApiError,
        channelsError as ApiError
      )
    : null;

  useEffect(() => {
    if (game && variant && storeChannels && user) {
      const channels = storeChannels.map((storeChannel) =>
        getChannel(storeChannel, variant, game, user)
      );
      const sortedChannels = sortChannels(channels);
      setChannels(sortedChannels);
    }
    if (game && user) {
      const member = getMember(game, user);
      setUserNation(member?.Nation);
    }
  }, [game, variant, storeChannels, user]);

  return {
    channels,
    variant,
    isLoading,
    isError,
    userNation,
    error,
    createChannel,
    validationMessage,
  };
};

export const ChatMenuStub = createContext<null | typeof useChatMenu>(null);

const useGetHook = (): ((gameId: string) => IUseChatMenu) => {
  const mockUseChatMenu = useContext(ChatMenuStub);
  return mockUseChatMenu ? mockUseChatMenu : useChatMenu;
};

export default useGetHook;
