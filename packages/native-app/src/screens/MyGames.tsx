import React from "react";
import { GameStatus } from "@diplicity/common";

import GameList from "../components/GameList";
import PlayerCard from "../components/PlayerCard";
import { Stack } from "../components/Stack";

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
  return (
    <Stack gap={0.5} orientation="vertical">
      <PlayerCard {...playerProps} />
      <GameList
        filters={{ my: true, status: GameStatus.Started, mastered: false }}
      />
    </Stack>
  );
};

export default MyGames;
