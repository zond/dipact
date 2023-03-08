import { diplicityService as service } from "..";

const useGameDetailView = (gameId: string) => {
  const [joinGame, joinGameMutation] = service.useJoinGameMutation();
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
