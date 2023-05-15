import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { diplicityService, ListGameFilters, selectors } from "../store";
import { RootState } from "../store/store";
import { actions } from "../store/views";
import { transformGame } from "../transformers/game";

// TODO push logic up to store
export const useListGamesQuery = (filters: ListGameFilters) => {
  const { data: user } = diplicityService.useGetRootQuery(undefined);
  const { data: games, ...query } = diplicityService.useListGamesQuery(filters);
  const transformedGames =
    games && user ? games.map((game) => transformGame(game, user)) : [];
  return { ...query, data: transformedGames };
};

export const useOrdersView = (gameId: string) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(actions.initializeOrdersView(gameId));
  }, [dispatch, gameId]);
  const view = useSelector((state) =>
    selectors.selectOrdersView(state as RootState, gameId)
  );
  return view;
};
