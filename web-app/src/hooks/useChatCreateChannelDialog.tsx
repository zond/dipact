import { createContext, useContext, useState } from "react";

import { Game, Variant } from "../store/types";
import { useSelectVariant } from "./selectors";
import { useGetGameQuery } from "./service";

interface IUseChatCreateChannelDialog {
  isLoading: boolean;
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

const useChatCreateChannelDialog = (
  gameId: string
): IUseChatCreateChannelDialog => {

  const {
    data: game,
    isLoading: gameIsLoading,
    isError: gameIsError,
    isSuccess: gameIsSuccess,
  } = useGetGameQuery(gameId);

  const variant = useSelectVariant(game?.Variant || "");
  const isLoading = gameIsLoading || !variant;

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

  return {
    isLoading,
    createChannel,
    validationMessage,
  };
};

export const ChatCreateChannelDialogStub = createContext<null | typeof useChatCreateChannelDialog>(null);

const useGetHook = (): (gameId: string) => IUseChatCreateChannelDialog => {
  const mockUseChatCreateChannelDialog = useContext(ChatCreateChannelDialogStub);
  return mockUseChatCreateChannelDialog ? mockUseChatCreateChannelDialog : useChatCreateChannelDialog;
}

export default useGetHook;
