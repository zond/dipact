import { useEffect, createContext, useContext, useState } from "react";
import { Variant } from "../store/types";
import { useSelectVariant } from "./selectors";
import {
  useGetGameQuery,
  useGetRootQuery,
  useListChannelsQuery,
  useListVariantsQuery,
} from "./service";
import { Channel } from "./types";
import { getChannel, getMember, sortChannels } from "./utils";

interface IUseChatMenu {
  channels: Channel[] | undefined;
  variant: Variant | null;
  userNation: string | undefined;
  isLoading: boolean;
}

const useChatMenu = (gameId: string) => {
  const { isLoading: variantsIsLoading } = useListVariantsQuery(undefined);
  const { data: user, isLoading: userIsLoading } = useGetRootQuery(undefined);
  const { data: game, isLoading: gameIsLoading } = useGetGameQuery(gameId);
  const { data: storeChannels, isLoading: channelsIsLoading } =
    useListChannelsQuery(gameId);

  const [channels, setChannels] = useState<Channel[]>([]);
  const [userNation, setUserNation] = useState<string | undefined>(undefined);
  const variant = useSelectVariant(game?.Variant || "");

  const isLoading = variantsIsLoading || channelsIsLoading || gameIsLoading || userIsLoading;

  useEffect(() => {
    if (game && variant && storeChannels && user) {
      const channels = storeChannels.map((storeChannel) =>
        getChannel(storeChannel, variant, game, user)
      );
      const sortedChannels = sortChannels(channels);
      setChannels(sortedChannels);
    }
    if (game && user) {
      setUserNation(getMember(game, user)?.Nation);
    }
  }, [game, variant, storeChannels, user]);

  return {
    channels,
    variant,
    isLoading,
    userNation,
  };
};

export const ChatMenuStub = createContext<null | typeof useChatMenu>(null);

const useGetHook = (): ((gameId: string) => IUseChatMenu) => {
  const mockUseChatMenu = useContext(ChatMenuStub);
  return mockUseChatMenu ? mockUseChatMenu : useChatMenu;
};

export default useGetHook;
