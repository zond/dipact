import React from "react";
import useRegisterPageView from "../hooks/useRegisterPageview";
import useGame from "../hooks/useGame";
import { useParams } from "react-router";
import Loading from "../components/Loading";
import {
  makeStyles,
  AppBar,
  Toolbar,
  Container,
  Button,
} from "@material-ui/core";
import PhaseSelector from "../components/PhaseSelector";
import PlayerCount from "../components/PlayerCount";
import DipMap from "../components/DipMap";
import Map from "../components/Map";

interface GameUrlParams {
  gameId: string;
}

const useStyles = makeStyles((theme) => ({
  appBar: {
    color: theme.palette.text.primary,
    backgroundColor: "transparent",
  },
  container: {
    display: "flex",
    paddingTop: theme.spacing(2),
    justifyContent: "space-between",
    "& > div": {
      display: "flex",
      gap: theme.spacing(1),
    },
    alignItems: "center",
  },
}));

const Game = () => {
  const classes = useStyles();
  useRegisterPageView("Game");
  const { gameId } = useParams<GameUrlParams>();
  const {
    combinedQueryState: { isLoading, isSuccess },
    canJoin,
    canLeave,
    numPlayers,
    maxNumPlayers,
    variantSVG,
  } = useGame()(gameId);

  if (isLoading) return <Loading />;

  return (
    <div>
      <AppBar position="static" className={classes.appBar} elevation={0}>
        <Toolbar variant="dense">
          <Container className={classes.container}>
            <div>
              {canJoin && <Button variant="outlined">Join</Button>}
              {canLeave && <Button variant="outlined">Leave</Button>}
            </div>
            <div>
              <PhaseSelector />
            </div>
            <div>
              <PlayerCount
                numPlayers={numPlayers}
                maxNumPlayers={maxNumPlayers}
              />
            </div>
          </Container>
        </Toolbar>
      </AppBar>
      {isSuccess && <Map variantSVG={variantSVG as string} />}
    </div>
  );
};

export default Game;
