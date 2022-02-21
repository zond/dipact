import React from "react";
import { Text, View } from "react-native";
import { Divider } from "react-native-elements";
import GameCard from "../components/GameCard";

const GameList = ({}) => {
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
