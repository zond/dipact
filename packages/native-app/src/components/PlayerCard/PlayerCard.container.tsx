import React, { useContext } from "react";
import PlayerCard from "./PlayerCard";
import PlayerCardSkeleton from "./PlayerCard.skeleton";
import QueryContainer from "../QueryContainer";
import { DiplicityApiContext } from "diplicity-common-internal";
import { PlayerCardContainerProps } from "./PlayerCard.types";

const PlayerCardContainer = ({ id, ...rest }: PlayerCardContainerProps) => {
  const query = useContext(DiplicityApiContext).useGetUserStatsQuery(id);

  return (
    <QueryContainer
      query={query}
      renderLoading={() => <PlayerCardSkeleton {...rest} />}
      render={(data) => <PlayerCard {...data} {...rest} />}
    />
  );
};

export default PlayerCardContainer;
