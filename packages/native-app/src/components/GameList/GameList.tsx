import React, { useState, useCallback, useContext } from "react";
import { RefreshControl, ScrollView, Text, View } from "react-native";
import GameCard from "../GameCard/GameCard";
import { GameCardSkeleton } from "../GameCard";
import { useStyles } from "./GameList.styles";
import {
  DiplicityApiContext,
  ListGameFilters,
  assertDefined,
  combineQueries,
  findDefined,
} from "@diplicity/common";
import QueryContainer from "../QueryContainer";

interface GameListProps {
  filters: ListGameFilters;
  title?: string;
  numSkeletons?: number;
}

const GameList = ({ filters, title, numSkeletons = 6 }: GameListProps) => {
  const styles = useStyles();
  const api = useContext(DiplicityApiContext);
  const listGamesQuery = api.useListGamesQuery(filters);
  const listVariantsQuery = api.useListVariantsQuery(undefined);
  const getRootQuery = api.useGetRootQuery(undefined);
  const query = combineQueries({
    games: listGamesQuery,
    user: getRootQuery,
    variants: listVariantsQuery,
  });

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <QueryContainer
      query={query}
      renderLoading={() => (
        <ScrollView>
          {Array.from(Array(numSkeletons)).map((_, index) => (
            <View key={index} style={styles.gameCardContainer}>
              <GameCardSkeleton />
            </View>
          ))}
        </ScrollView>
      )}
      render={(data) => {
        const { games, variants, user } = assertDefined(data);

        return (
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            {games.map((game) => {
              const variant = findDefined(
                variants,
                (v) => v.name === game.variant
              );
              return (
                <View key={game.id} style={styles.gameCardContainer}>
                  <GameCard game={game} user={user} variant={variant} />
                </View>
              );
            })}
          </ScrollView>
        );
      }}
    />
  );
};

export default GameList;
