import { GameStatus, useGameList } from "@diplicity/common";
import React from "react";
import { Text, View } from "react-native";
import { Divider } from "react-native-elements";
import GameCard from "../components/GameCard";

const GameList = ({}) => {
  const games = useGameList({
    my: true,
    status: GameStatus.Started,
    mastered: false,
  });
  return (
    <View>
      <GameCard />
      <Divider />
      <GameCard />
      <Divider />
      <GameCard />
    </View>
  );
};

export default GameList;
