import React, { useState } from "react";
import { StyleProp, Text, View } from "react-native";
import GameCard from "../components/GameCard";
import { ListGameFilters, useGameList } from "@diplicity/common";
import { Divider, ListItem } from "@rneui/base";

const useStyles = (): StyleProp<any> => {
  return {
    title: {
      fontSize: 16,
      fontWeight: "bold",
    },
    gameListItem: {
      width: "100%",
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
            <>
              {games.map((game) => (
                <View key={game.id}>
                  <GameCard game={game} />
                  <Divider />
                </View>
              ))}
            </>
          )}
        </>
      </ListItem.Accordion>
    </>
  );
};

export default GameList;
