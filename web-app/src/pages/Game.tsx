import React from "react";
import useRegisterPageView from "../hooks/useRegisterPageview";
import useGame from "../hooks/useGame";
import { useParams } from "react-router";
import Loading from "../components/Loading";
import { AppBar, Toolbar, Container, Button } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import PhaseSelector from "../components/PhaseSelector";
import PlayerCount from "../components/PlayerCount";

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
    canJoin,
    canLeave,
    combinedQueryState: { isLoading },
    maxNumPlayers,
    numPlayers,
    variant,
  } = useGame()(gameId);

  if (isLoading || !variant) return <Loading />;

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
      {/* {isSuccess && <Map variant={variant} variantSVG={variantSVG as string} variantUnitSvgs={variantUnitSvgs} />} */}
    </div>
  );
};

export default Game;
