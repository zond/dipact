import React from "react";
import { View } from "react-native";
import { Divider } from "@rneui/themed";
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
