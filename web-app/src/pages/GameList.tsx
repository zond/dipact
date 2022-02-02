import {
  Container,
  Divider,
  Fab,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import React from "react";
import { generatePath } from "react-router-dom";
import GameCard from "../components/GameCard";
import Loading from "../components/Loading";
import MainMenu from "../components/MainMenu";
import useGameList, { GameStatus } from "../hooks/useGameList";
import useSearchParams from "../hooks/useSearchParams";
import { CreateMessageIcon } from "../icons";
import { RouteConfig } from "./RouteConfig";
import { useTranslation } from "react-i18next";
import tk from "../translations/translateKeys";

const useStyles = makeStyles((theme) => ({
  createGame: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
    textDecoration: "none",
  },
  filtersAndCreate: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: theme.spacing(2),
  },
}));

const GameList = () => {
  const { t } = useTranslation("common");
  const classes = useStyles();
  const { getParam } = useSearchParams();
  let status = getParam("status") as GameStatus;
  const myVal = getParam("my") || "0";
  const my = Boolean(parseInt(myVal));
  const masteredVal = getParam("mastered") || "0";
  const mastered = Boolean(parseInt(masteredVal));
  if (!(status && Object.values(GameStatus).includes(status))) {
    status = GameStatus.Started;
  }
  const { games, isFetching } = useGameList({
    my,
    status,
    mastered,
  });

  return (
    <MainMenu>
      <Container>
        {isFetching ? (
          <Loading />
        ) : (
          <>
            <div className={classes.filtersAndCreate}>
              <div></div>
              <a
                className={classes.createGame}
                href={generatePath(RouteConfig.CreateGame)}
              >
                <Fab
                  variant="extended"
                  size="small"
                  color="secondary"
                  aria-label="add"
                >
                  <CreateMessageIcon />
                  <label>{t(tk.gameList.createGameButton.title)}</label>
                </Fab>
              </a>
            </div>
            {games.length ? (
              <>
                {games.map((game) => (
                  <div key={game.id}>
                    <GameCard game={game} />
                    <Divider light />
                  </div>
                ))}
              </>
            ) : (
              <Typography>{tk.gameList.noGamesMessage}</Typography>
            )}
          </>
        )}
      </Container>
    </MainMenu>
  );
};

export default GameList;
