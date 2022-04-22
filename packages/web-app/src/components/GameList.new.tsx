import React from "react";
import GameCard from "./GameCard";
import { ListGameFilters, useGameList } from "@diplicity/common";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { ExpandMore } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  title: {
    fontWeight: "bold",
  },
  accordionDetails: {
    display: "flex",
    flexDirection: "column",
    padding: 0,
  },
  gameListItem: {
    width: "100%",
  },
}));

interface GameListProps
  extends Pick<Parameters<typeof GameCard>[0], "summaryOnly"> {
  title: string;
  filters: ListGameFilters;
  startClosed?: true;
}

const GameList = ({
  title,
  filters,
  startClosed,
  summaryOnly,
}: GameListProps) => {
  const classes = useStyles();
  const { games, isLoading, isSuccess, isError } = useGameList(filters);
  if (isLoading || (isSuccess && !games.length)) {
    return null;
  }
  return (
    <Accordion defaultExpanded={!startClosed}>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Typography>{title}</Typography>
      </AccordionSummary>
      <AccordionDetails className={classes.accordionDetails}>
        {games.map((game) => (
          <div key={game.id} className={classes.gameListItem}>
            <GameCard game={game} summaryOnly={summaryOnly} />
          </div>
        ))}
      </AccordionDetails>
    </Accordion>
  );
};

export default GameList;
