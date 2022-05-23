import { useOrders, translateKeys as tk } from "@diplicity/common";
import { ListItem } from "@rneui/base";
import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import NationOrders from "../components/NationOrders";
import NationSummary from "../components/NationSummary";
import Order from "../components/Order";
import PhaseSelector from "../components/PhaseSelector";

interface OrdersProps {
  gameId: string;
}

const Orders = ({ gameId }: OrdersProps) => {
  const {
    isLoading,
    isError,
    error,
    nationStatuses,
    noOrders,
    ordersConfirmed,
    phaseStateIsLoading,
    isCurrentPhase,
    toggleAcceptDraw,
    toggleConfirmOrders,
    userIsMember,
  } = useOrders(gameId);
  return (
    <View>
      <PhaseSelector gameId={gameId} />
      <ScrollView>
        {nationStatuses.map((nationStatus) => (
          <NationOrders
            nationStatus={nationStatus}
            key={nationStatus.nation.name}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default Orders;
