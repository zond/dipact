import React from "react";
import { Text, View } from "react-native";

interface MapProps {
  gameId: string;
}

const Map = ({ gameId }: MapProps) => {
  return (
    <View>
      <Text>Map</Text>
      <Text>{gameId}</Text>
    </View>
  );
};

export default Map;
