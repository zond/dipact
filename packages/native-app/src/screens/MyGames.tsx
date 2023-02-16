import React, { useState } from "react";
import { GameStatus, selectors } from "@diplicity/common";

import GameList from "../components/GameList";
import PlayerCard from "../components/PlayerCard";
import { Stack } from "../components/Stack";
import { Filter } from "../components/Filter";
import { useAppSelector } from "../hooks/useAppSelector";

const MyGames = ({}) => {
  const id = useAppSelector(selectors.selectUserId) as string;
  const [status, setStatus] = useState<GameStatus>(GameStatus.Started);

  return (
    <Stack orientation="vertical">
      <PlayerCard variant="expanded" id={id} />
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
  );
};

export default MyGames;
