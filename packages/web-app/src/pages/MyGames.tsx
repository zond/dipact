import React from "react";
import { GameStatus, translateKeys as tk } from "@diplicity/common";
import GameList from "../components/GameList.new";
import { useTranslation } from "react-i18next";
import MainMenu from "../components/MainMenu.new";
import { Container, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.default,
  },
  container: {
    marginTop: theme.spacing(2),
  },
}));

const MyGames = () => {
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <MainMenu title={t(tk.gameList.myGamesTab.label)}>
      <div className={classes.root}>
        <Container className={classes.container}>
          <GameList
            title={t(tk.gameList.gameStatusLabels.started)}
            filters={{ my: true, status: GameStatus.Started, mastered: false }}
            summaryOnly
          />
          <GameList
            title={t(tk.gameList.gameStatusLabels.staging)}
            filters={{ my: true, status: GameStatus.Staging, mastered: false }}
            summaryOnly
          />
          <GameList
            title={t(tk.gameList.gameStatusLabels.finished)}
            filters={{ my: true, status: GameStatus.Finished, mastered: false }}
            summaryOnly
            startClosed
          />
        </Container>
      </div>
    </MainMenu>
  );
};

export default MyGames;
