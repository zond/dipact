import { usePlayerDisplay } from "@diplicity/common";
import React from "react";
import PlayerCard from "./PlayerCard";
import PlayerCardSkeleton from "./PlayerCard.skeleton";

interface PlayerCardContainerProps
  extends Omit<Parameters<typeof PlayerCard>[0], "player"> {
  id: string;
}

const PlayerCardContainer = ({ id, ...rest }: PlayerCardContainerProps) => {
  const playerDisplayQuery = usePlayerDisplay(id);

  if (playerDisplayQuery.isError) {
    return <></>;
  }

  if (playerDisplayQuery.isLoading || !playerDisplayQuery.data) {
    return <PlayerCardSkeleton {...rest} />;
  }

  return <PlayerCard player={playerDisplayQuery.data} {...rest} />;
};

export default PlayerCardContainer;
