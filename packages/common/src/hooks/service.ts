import { diplicityService, ListGameFilters } from "../store";
import { transformGame } from "../transformers/game";

// TODO push logic up to store
export const useListGamesQuery = (filters: ListGameFilters) => {
  const { data: user } = diplicityService.useGetRootQuery(undefined);
  const { data: games, ...query } = diplicityService.useListGamesQuery(filters);
  const transformedGames =
    games && user ? games.map((game) => transformGame(game, user)) : [];
  return { ...query, data: transformedGames };
};
