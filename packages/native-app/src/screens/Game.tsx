import React from "react";
import { ScrollView, Text } from "react-native";
import { useParams } from "../hooks/useParams";

const Game = () => {
  const { gameId } = useParams<"Game">();
  return (
    <ScrollView>
      <Text>{gameId}</Text>
    </ScrollView>
  );
};

export default Game;
