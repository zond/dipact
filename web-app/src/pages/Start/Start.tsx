import React, { useState } from "react";
import useRegisterPageView from "../../hooks/useRegisterPageView";
import {
  AppBar,
  Button,
  List,
  ListItem,
  ListSubheader,
  Slide,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { ExpandMore } from "@material-ui/icons";

import { ReactComponent as LogoDarkSVG } from "../../assets/img/logo_dark.svg";
import NewsDialog from "../../components/NewsDialog";
import useStyles from "./Start.styles";
import { useHasPlayed } from "../../hooks/selectors";

const latestNewsShownKey = "latestNewsShown";
const DIPLOMACY_RULES_LINK = "https://en.wikibooks.org/wiki/Diplomacy/Rules"; // TODO move to external links

const welcomeMessage = `
    Welcome! Diplomacy games are all about human interaction, so
    they usually take or even start after many days. Before joining
    your first game, we strongly advise you to read the rules.
`;

const Start = (): React.ReactElement => {
  const [createGameDialogOpen, setCreateGameDialogOpen] = useState(false);
  const [newGameFormOpen, setNewGameFormOpen] = useState(false);

  useRegisterPageView("Start");

  localStorage.setItem(latestNewsShownKey, "true");

  const findOpenGame = (): void => console.log("Find open game");
  const findPrivateGame = (): void => console.log("Find private game");
  const renderMyFinishedGames = (): void =>
    console.log("Render my finished games");

  const classes = useStyles();
  const hasPlayed = useHasPlayed();

  return (
    <>
      {hasPlayed ? (
        <>
          <NewsDialog />
          <List className={classes.list}>
            <li key="started" id="my-started-container">
              <ul style={{ paddingInlineStart: 0 }}>
                <div className={classes.listSubheaderContainer}>
                  <ListSubheader className={classes.listSubheader}>
                    My ongoing games
                  </ListSubheader>
                </div>
                <ListItem className={classes.listItem}>
                  {/* <GameList
                    limit={128}
                    contained={true}
                    url={this.props.urls["my-started-games"]}
                    onPhaseMessage={(_) => {
                      this.myStartedGamesList.refresh();
                      this.myFinishedGamesList.refresh();
                    }}
                    parentCB={(c) => {
                      this.myStartedGamesList = c;
                    }}
                    onFilled={(_) => {
                      document.getElementById(
                        "my-started-container"
                      ).style.display = "block";
                    }}
                    onEmpty={(_) => {
                      document.getElementById(
                        "my-started-container"
                      ).style.display = "none";
                    }}
                  /> */}
                </ListItem>
              </ul>
            </li>
            <li key="staging" id="my-staging-container">
              <ul style={{ paddingInlineStart: 0 }}>
                <div className={classes.listSubheaderContainer}>
                  <ListSubheader className={classes.listSubheader}>
                    My forming games
                  </ListSubheader>
                </div>

                <ListItem
                  style={{
                    padding: "0px 16px",
                  }}
                  // TODO should this be the same as other list item?
                >
                  {/* <GameList
                    limit={128}
                    contained={true}
                    onPhaseMessage={(_) => {
                      this.myStartedGamesList.reload();
                      this.myStagingGamesList.reload();
                    }}
                    onFilled={(_) => {
                      document.getElementById(
                        "my-staging-container"
                      ).style.display = "block";
                    }}
                    withDetails={true}
                    onEmpty={(_) => {
                      document.getElementById(
                        "my-staging-container"
                      ).style.display = "none";
                    }}
                    parentCB={(c) => {
                      this.myStagingGamesList = c;
                    }}
                    url={this.props.urls["my-staging-games"]}
                  /> */}
                </ListItem>
              </ul>
            </li>
            <li key="finished" id="my-finished-container">
              <ul style={{ paddingInlineStart: 0 }}>
                <div className={classes.listSubheaderContainer}>
                  <ListSubheader className={classes.listSubheader}>
                    My finished games
                  </ListSubheader>
                  <Button onClick={renderMyFinishedGames}>View all</Button>
                </div>

                <ListItem className={classes.listItem}>
                  {/* <GameList
                    contained={true}
                    parentCB={(c) => {
                      this.myFinishedGamesList = c;
                    }}
                    onFilled={(_) => {
                      document.getElementById(
                        "my-finished-container"
                      ).style.display = "block";
                    }}
                    onEmpty={(_) => {
                      document.getElementById(
                        "my-finished-container"
                      ).style.display = "none";
                    }}
                    url={this.props.urls["my-finished-games"]}
                    limit={8}
                  /> */}
                </ListItem>
              </ul>
            </li>
          </List>
          <AppBar
            position="fixed"
            color="primary"
            style={{ top: "auto", bottom: 0 }}
          >
            <Toolbar style={{ justifyContent: "space-around" }}>
              <Button
                key="new-game"
                onClick={() => setNewGameFormOpen(!newGameFormOpen)}
                variant="contained"
                color="secondary"
              >
                New game
                {newGameFormOpen && <ExpandMore />}
              </Button>
            </Toolbar>
            <Slide
              mountOnEnter
              unmountOnExit
              direction="up"
              in={newGameFormOpen}
            >
              <Toolbar className={classes.toolbar}>
                <Button variant="outlined" onClick={findOpenGame}>
                  Browse open games
                </Button>
                <Button variant="outlined" onClick={findOpenGame}>
                  Find game by ID
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => setCreateGameDialogOpen(true)}
                >
                  Create game
                </Button>
              </Toolbar>
            </Slide>
          </AppBar>
        </>
      ) : (
        <>
          <div className={classes.rulesContainer}>
            <div className={classes.rulesInnerContainer} id="top">
              <LogoDarkSVG className={classes.logoSvg} />
              <Typography variant="body2">{welcomeMessage}</Typography>
              <Button
                className={classes.readTheRulesButton}
                variant="outlined"
                href={DIPLOMACY_RULES_LINK}
                target="_blank"
              >
                Read the rules
              </Button>
            </div>
            <div id="bottom">
              <div className={classes.soldiersSvgDiv}></div>
              <div className={classes.bottomSection}>
                <Button variant="outlined" onClick={findOpenGame}>
                  Browse open games
                </Button>
                <Button variant="outlined" onClick={findPrivateGame}>
                  Find game by ID
                </Button>
                <Button
                  variant="outlined"
                  key="create"
                  onClick={() => setCreateGameDialogOpen(true)}
                >
                  Create game
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
      {/* <CreateGameDialog gameCreated={() => console.log("Game Created")} /> */}
      {/* <ErrorsDialog
        key="errors-dialog"
        parentCB={(c) => {
          this.errorsDialog = c;
        }}
      /> */}
    </>
  );
};

export default Start;
