import { useDispatch } from "react-redux";
import { useSelectGamePlayersView } from "./selectors";
import { actions as uiActions } from "../store/ui";
import { createContext, useContext } from "react";

interface IUseGamePlayers extends ReturnType<typeof useSelectGamePlayersView> {
  toggleBanned: (userId: string) => void;
  toggleMuted: (nation: string) => void;
}

const useGamePlayers = (gameId: string): IUseGamePlayers => {
  const dispatch = useDispatch();
  const toggleBanned = (userId: string) =>
    dispatch(uiActions.toggleBanned(userId));
  const toggleMuted = (nation: string) =>
    dispatch(uiActions.toggleMuted(nation));
  const view = useSelectGamePlayersView(gameId);
  return {
    ...view,
    toggleBanned,
    toggleMuted,
  };
};

const createDIContext = <T,>() => createContext<null | T>(null);
export const useDIContext = createDIContext<typeof useGamePlayers>();

const useGetHook = () => useContext(useDIContext) || useGamePlayers;
const useDIHook = (gameId: string): IUseGamePlayers => useGetHook()(gameId);

export const gamePlayersDecorator = (values: IUseGamePlayers) => {
  return (Component: () => JSX.Element) => (
    <useDIContext.Provider value={() => values}>
      <Component />
    </useDIContext.Provider>
  );
};

export default useDIHook;
