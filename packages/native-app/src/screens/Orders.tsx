import React from "react";
import { Text, View } from "react-native";

interface OrdersProps {
  gameId: string;
}

const Orders = ({ gameId }: OrdersProps) => {
  return (
    <View>
      <Text>Orders</Text>
      <Text>{gameId}</Text>
    </View>
  );
};

export default Orders;
