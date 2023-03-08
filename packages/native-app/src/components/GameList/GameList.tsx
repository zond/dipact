import React, { useState, useCallback } from "react";
import { RefreshControl, ScrollView, Text, View } from "react-native";
import GameCard from "../GameCard/GameCard";
import { GameCardSkeleton } from "../GameCard";
import { useStyles } from "./GameList.styles";
import useGameListView from "../../../common/hooks/useGameListView";
import QueryContainer from "../QueryContainer";
import { assertDefined } from "../../utils/general";

interface GameListProps {
  filters: Parameters<typeof useGameListView>[0];
  title?: string;
  numSkeletons?: number;
}

const GameList = ({ filters, title, numSkeletons = 6 }: GameListProps) => {
  const styles = useStyles();
  const query = useGameListView(filters);

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
        const { games, user } = assertDefined(data);
        return (
            <ScrollView
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            >
              {games.map((game) => (
                <View key={game.id} style={styles.gameCardContainer}>
                  <GameCard game={game} />
                </View>
              ))}
            </ScrollView>
      )}}
    />
  );

export default GameList;
