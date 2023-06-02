import React from "react";
import { ScrollView } from "react-native";

import QueryContainer from "../../components/QueryContainer";
import { Stack } from "../../components/Stack";
import { useParams } from "../../hooks/useParams";
import { usePlayerInfoView } from "diplicity-common-internal";
import PlayerCard from "../../components/PlayerCard";
import { useCommonStyles } from "../../hooks/useCommonStyles";

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
              {data.players.map(({ id }) => (
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
