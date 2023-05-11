import { useContext } from "react";
import { DiplicityApiContext } from "../store";

const useGameDetailView = (gameId: string) => {
  const api = useContext(DiplicityApiContext);
  const [joinGame, joinGameMutation] = api.useJoinGameMutation();
  const actions = {
    joinGame: {
      call: () => joinGame({ gameId, NationPreferences: "", GameAlias: "" }),
      mutation: joinGameMutation,
    },
    leaveGame: {
      call: () => joinGame({ gameId, NationPreferences: "", GameAlias: "" }),
      mutation: joinGameMutation,
    },
  } as const;
  return {
    actions: actions,
  };
};

export default useGameDetailView;
