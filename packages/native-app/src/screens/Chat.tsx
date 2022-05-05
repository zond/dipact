import React from "react";
import { Text, View } from "react-native";

interface ChatProps {
  gameId: string;
}

const Chat = ({ gameId }: ChatProps) => {
  return (
    <View>
      <Text>Chat</Text>
      <Text>{gameId}</Text>
    </View>
  );
};

export default Chat;
