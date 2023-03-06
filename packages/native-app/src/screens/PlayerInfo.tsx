import React from "react";
import { ScrollView } from "react-native";

import { Text } from "../components/Text";
import QueryContainer from "../components/QueryContainer";
import { Stack } from "../components/Stack";
import { useParams } from "../hooks/useParams";
import { usePlayerInfoView } from "../hooks/usePlayerInfoView";
import PlayerCard from "../components/PlayerCard";
import { useCommonStyles } from "../hooks/useCommonStyles";

const PlayerInfo = () => {
  const commonStyles = useCommonStyles();
  const { gameId } = useParams<"PlayerInfo">();
  const { query } = usePlayerInfoView(gameId);

  return (
    <QueryContainer
      query={query}
      render={(data) => {
        return (
          <ScrollView>
            <Stack orientation="vertical">
              {data.members.map(({ User: { Id: id } }) => (
                <PlayerCard
                  id={id}
                  variant="compact"
                  style={commonStyles.section}
                  key={id}
                />
              ))}
            </Stack>
          </ScrollView>
        );
      }}
    />
  );
};

export default PlayerInfo;
