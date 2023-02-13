import React, { useState } from "react";
import { GameStatus } from "@diplicity/common";

import GameList from "../components/GameList";
import PlayerCard from "../components/PlayerCard";
import { Stack } from "../components/Stack";
import { Filter } from "../components/Filter";

const playerProps = {
  variant: "expanded",
  username: "johnpooch",
  src: "https://lh3.googleusercontent.com/a/AEdFTp5Uz8Syu_d064B_2CdLy7aYcjXPJZ2la_3ScPe-=s96-c",
  reliabilityLabel: "commited",
  reliabilityRating: 1,
  numPlayedGames: 1,
  numWonGames: 1,
  numDrawnGames: 1,
  numAbandonnedGames: 1,
} as const;

const MyGames = ({}) => {
  const [status, setStatus] = useState<GameStatus>(GameStatus.Started);

  return (
    <Stack orientation="vertical">
      <PlayerCard {...playerProps} />
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
