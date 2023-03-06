import { diplicityService as service } from "@diplicity/common";

export const useGameDetailView = (gameId: string) => {
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
  };
  return {
    actions: actions,
  };
};
