import { createContext, useContext, useEffect } from "react";
import { useDispatch } from "react-redux";
import { actions as feedbackActions } from "../store/feedback";
import { useDeleteGameMutation, useJoinGameMutation } from "../hooks/service";
import { copyToClipboard } from "../utils/general";
import { registerEvent } from "./useRegisterPageview";

const LINK_COPIED_TO_CLIPBOARD_FEEDBACK =
  "Game URL copied to clipboard. Share it with other players.";

interface JoinGameArgs {
  gameId: string;
  NationPreferences: string;
  GameAlias: string;
}

// TODO should get game
interface IUseGameCard {
  deleteGame: (id: string) => void;
  isLoading: boolean;
  joinGame: (args: JoinGameArgs) => void;
  onClickInvite: (url: string) => void;
}

const useGameCard = (): IUseGameCard => {
  const dispatch = useDispatch();
  const [joinGame, joinGameQuery] = useJoinGameMutation();
  const [deleteGame, deleteGameQuery] = useDeleteGameMutation();

  const isLoading = joinGameQuery.isLoading || deleteGameQuery.isLoading;

  // TODO move to middleware
  useEffect(() => {
    if (joinGameQuery.isSuccess) {
      registerEvent("game_list_element_join");
    }
  }, [joinGameQuery.isSuccess]);

  const onClickInvite = (url: string) => {
    if (false) {
      // TODO do native share on native app
    } else {
      copyToClipboard(url)
        .then(() => {
          const message = LINK_COPIED_TO_CLIPBOARD_FEEDBACK;
          dispatch(feedbackActions.add({ message, severity: "info" }));
        })
        .catch((error) => {
          dispatch(feedbackActions.add({ message: error, severity: "error" }));
        });
      // TODO
      // gtag("event", "game_share");
    }
  };

  return { deleteGame, isLoading, joinGame, onClickInvite };
};

export const useGameCardContext =
  createContext<null | typeof useGameCard>(null);

const createDIContext = <T,>() => createContext<null | T>(null);
export const useDIContext = createDIContext<typeof useGameCard>();

const useGetHook = () => useContext(useDIContext) || useGameCard;
const useDIHook = (): IUseGameCard => useGetHook()();

export const gameCardDecorator = (values: IUseGameCard) => {
  return (Component: () => JSX.Element) => (
    <useDIContext.Provider value={() => values}>
      <Component />
    </useDIContext.Provider>
  );
};

export default useDIHook;
