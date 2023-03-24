import { usePlayerCardView } from "../../../common";
import React from "react";
import PlayerCard from "./PlayerCard";
import PlayerCardSkeleton from "./PlayerCard.skeleton";
import QueryContainer from "../QueryContainer";

interface PlayerCardContainerProps
  extends Omit<Parameters<typeof PlayerCard>[0], "userStats"> {
  id: string | undefined;
}

const PlayerCardContainer = ({ id, ...rest }: PlayerCardContainerProps) => {
  const { query } = usePlayerCardView(id);

  return (
    <QueryContainer
      query={query}
      renderLoading={() => <PlayerCardSkeleton {...rest} />}
      render={(data) => <PlayerCard userStats={data} {...rest} />}
    />
  );
};

export default PlayerCardContainer;
