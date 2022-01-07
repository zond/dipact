import {
  Checkbox,
  Container,
  Divider,
  Fab,
  FormControlLabel,
  FormGroup,
  MenuItem,
  Select,
  SelectChangeEvent,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import React from "react";
import { generatePath } from "react-router";
import GameCard from "../components/GameCard";
import Loading from "../components/Loading";
import MainMenu from "../components/MainMenu";
import useGameList, { GameStatus } from "../hooks/useGameList";
import useSearchParams from "../hooks/useSearchParams";
import { CreateMessageIcon } from "../icons";
import { RouteConfig } from "./RouteConfig";

const useStyles = makeStyles((theme) => ({
  tabs: {
    "& span.MuiTab-wrapper": {
      alignItems: "flex-start",
    },
  },
  filters: {
    display: "flex",
    gap: theme.spacing(2),
    padding: theme.spacing(2),
    alignItems: "center",
  },
  createGameButton: {
    display: "flex",
  },
  filtersAndCreate: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between"
  }
}));

const gameStatusLabels = {
  [GameStatus.Started]: "Started games",
  [GameStatus.Staging]: "Open to join",
  [GameStatus.Finished]: "Finished games",
};

const ALL_GAMES_TAB_LABEL = "All games";
const MY_GAMES_TAB_LABEL = "My games";
const MASTERED_CHECKBOX_LABEL = "Managed by me";
export const NO_GAMES_MESSAGE = "No games found.";

const GameList = () => {
  const classes = useStyles();
  const { getParam, setParam, removeParam } = useSearchParams();
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

  const a11yProps = (index: string) => {
    return {
      id: `game-filter-tab-${index}`,
      "aria-controls": `game-filter-tabpanel-${index}`,
    };
  };

  const handleMasteredCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const mastered = e.target.checked ? "1" : "0";
    setParam("mastered", mastered);
  };

  const handleStatusChange = (e: SelectChangeEvent<GameStatus>) => {
    setParam("status", e.target.value);
  };

  const handleChangeTab = (
    event: React.SyntheticEvent<Element, Event>,
    value: any
  ) => {
    setParam("my", value);
    if (value === "0") removeParam("mastered");
  };

  // if (isError) return <ErrorMessage error={error} />;

  return (
    <MainMenu>
      <Container>
        <div>
          <Tabs
            defaultValue={"0"}
            value={myVal}
            onChange={handleChangeTab}
            aria-label="games filter"
            className={classes.tabs}
          >
            <Tab value={"0"} label={ALL_GAMES_TAB_LABEL} {...a11yProps("0")} />
            <Tab value={"1"} label={MY_GAMES_TAB_LABEL} {...a11yProps("1")} />
          </Tabs>
        </div>
        {isFetching ? (
          <Loading />
        ) : (
          <>
            <div className={classes.filtersAndCreate}>
              <div className={classes.filters}>
                <Select
                  value={status}
                  onChange={handleStatusChange}
                  data-testid={"status-select"}
                >
                  {Object.values(GameStatus).map((opt) => (
                    <MenuItem key={opt} value={opt}>
                      {gameStatusLabels[opt]}
                    </MenuItem>
                  ))}
                </Select>

                {my && (
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={mastered}
                          onChange={handleMasteredCheckboxChange}
                        />
                      }
                      label={MASTERED_CHECKBOX_LABEL}
                    />
                  </FormGroup>
                )}
              </div>
              <a href={generatePath(RouteConfig.CreateGame)}>
                <Fab
                  title="Create game"
                  className={classes.createGameButton}
                  color="secondary"
                  aria-label="edit"
                >
                  <CreateMessageIcon />
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
              <Typography>{NO_GAMES_MESSAGE}</Typography>
            )}
          </>
        )}
      </Container>
    </MainMenu>
  );
};

export default GameList;
