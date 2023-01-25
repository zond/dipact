import React, { useState } from "react";
import { StyleProp, Text, View } from "react-native";
import GameCard from "./GameCard/GameCard";
import { ListGameFilters, useGameList } from "@diplicity/common";
import { Divider, ListItem } from "@rneui/base";

const useStyles = (): StyleProp<any> => {
  return {
    title: {
      fontSize: 16,
      fontWeight: "bold",
    },
  };
};

interface GameListProps {
  title: string;
  filters: ListGameFilters;
  startClosed?: true;
}

const GameList = ({ title, filters, startClosed }: GameListProps) => {
  const styles = useStyles();
  const { games, isLoading, isSuccess, isError } = useGameList(filters);
  const [expanded, setExpanded] = useState(!startClosed);
  if (isLoading || (isSuccess && !games.length)) {
    return null;
  }
  return (
    <>
      <ListItem.Accordion
        content={
          <ListItem.Content>
            <ListItem.Title style={styles.title}>{title}</ListItem.Title>
          </ListItem.Content>
        }
        isExpanded={expanded}
        onPress={() => {
          setExpanded(!expanded);
        }}
        bottomDivider
      >
        <>
          {isError ? (
            <Text>Error!</Text>
          ) : (
            <View style={{ display: "flex" }}>
              {games.map((game) => (
                <View key={game.id} style={{ paddingTop: 4 }}>
                  <GameCard game={game} />
                </View>
              ))}
            </View>
          )}
        </>
      </ListItem.Accordion>
    </>
  );
};

export default GameList;
