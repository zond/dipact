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
    isLoading,
    phasesDisplay,
    setSelectedPhase,
    selectedPhase,
    canJoin,
    canLeave,
    numPlayers,
    maxNumPlayers,
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
              {phasesDisplay && selectedPhase && (
                <PhaseSelector
                  phases={phasesDisplay}
                  selectedPhase={selectedPhase}
                  onSelectPhase={setSelectedPhase}
                />
              )}
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
      <DipMap
        // parentCB={(c) => {
        //   this.dip_map = c;
        // }}
        // onLeaveProbation={(_) => {
        //   this.loadGame();
        // }}
        // debugCount={this.debugCount}
        // labPhaseResolve={this.labPhaseResolve}
        // serializePhaseState={this.serializePhaseState}
        // laboratoryMode={this.state.laboratoryMode}
        // isActive={this.state.activeTab === "map"}
        // game={this.state.game}
        // phase={this.state.activePhase}
        // corroborateSubscriber={this.receiveCorroboration}
        // variant={this.state.variant}
      />
    </div>
  );
};

export default Game;
