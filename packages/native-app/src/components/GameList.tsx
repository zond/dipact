import React, { useState, useCallback } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleProp,
  Text,
  View,
} from "react-native";
import GameCard from "./GameCard/GameCard";
import { ListGameFilters, useGameList } from "@diplicity/common";
import { GameCardSkeleton } from "./GameCard";
import { useTheme } from "../hooks/useTheme";

const useStyles = (): StyleProp<any> => {
  const theme = useTheme();
  return {
    title: {
      fontSize: 16,
      fontWeight: "bold",
    },
    gameCardContainer: {
      paddingVertical: theme.spacing(0.5),
    },
  };
};

interface GameListProps {
  filters: ListGameFilters;
  title?: string;
  numSkeletons?: number;
}

const GameList = ({ filters, title, numSkeletons = 6 }: GameListProps) => {
  const styles = useStyles();
  const { games, isLoading, isSuccess, isError } = useGameList(filters);

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  if (isSuccess && !games.length) {
    return null;
  }
  return (
    <>
      {isError ? (
        <Text>Error!</Text>
      ) : (
        <>
          {Boolean(title) && <Text style={styles.title}>{title}</Text>}
          {isLoading ? (
            Array.from(Array(numSkeletons)).map((_, index) => (
              <View key={index} style={styles.gameCardContainer}>
                <GameCardSkeleton />
              </View>
            ))
          ) : (
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
          )}
        </>
      )}
    </>
  );
};

export default GameList;
