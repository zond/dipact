import React, { useContext, useState, useEffect } from "react";

import {
  DiplicityApiContext,
  GameStatus,
  useTelemetry,
} from "@diplicity/common";
import PlayerCard from "../../components/PlayerCard";
import { Stack } from "../../components/Stack";
import Filter from "../../components/Filter";
import QueryContainer from "../../components/QueryContainer";
import GameList from "../../components/GameList";

const MyGames = ({}) => {
  const telemetryService = useTelemetry();
  const [status, setStatus] = useState<GameStatus>(GameStatus.Started);
  const getRootQuery =
    useContext(DiplicityApiContext).useGetRootQuery(undefined);

  telemetryService.logInfo("Rendering MyGames screen");

  useEffect(() => {
    telemetryService.logInfo("MyGames screen mounted");
  }, [telemetryService]);

  const onPressMore = () => {
    telemetryService.logInfo("MyGames screen: More button pressed");
  };

  return (
    <QueryContainer
      query={getRootQuery}
      render={(data) => (
        <Stack orientation="vertical">
          <PlayerCard
            variant="expanded"
            onPressMore={onPressMore}
            id={data.id}
          />
          <Stack align="flex-start" fillWidth padding={1}>
            <Filter
              placeholder="State"
              value={status}
              onChange={(value) => setStatus(value as GameStatus)}
              options={[
                { value: GameStatus.Staging, label: "Staging" },
                { value: GameStatus.Started, label: "Started" },
                { value: GameStatus.Finished, label: "Finished" },
              ]}
              nullable={false}
              variant="select"
            />
          </Stack>
          <GameList filters={{ my: true, status: status, mastered: false }} />
        </Stack>
      )}
    />
  );
};

export default MyGames;
