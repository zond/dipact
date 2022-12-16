import { diplicityService, GameDisplay } from "../store";
import { transformGame } from "../transformers/game";

interface JoinGameArgs {
  NationPreferences: string;
  GameAlias: string;
}

interface IUseGameCard {
  game: GameDisplay | undefined;
  deleteGame: () => void;
  isLoading: boolean;
  joinGame: (args: JoinGameArgs) => void;
}

const useGameCard = (gameId: string): IUseGameCard => {
  const { data: user } = diplicityService.useGetRootQuery(undefined);
  const [joinGame, joinGameQuery] = diplicityService.useJoinGameMutation();
  const [deleteGame, deleteGameQuery] =
    diplicityService.useDeleteGameMutation();
  const { data: game, ...getGameQuery } =
    diplicityService.useGetGameQuery(gameId);
  const transformedGame = game && user ? transformGame(game, user) : undefined;

  const isLoading =
    joinGameQuery.isLoading ||
    deleteGameQuery.isLoading ||
    getGameQuery.isLoading;

  return {
    game: transformedGame,
    deleteGame: () => deleteGame(gameId),
    isLoading,
    joinGame: (args) => joinGame({ gameId, ...args }),
  };
};

export default useGameCard;
