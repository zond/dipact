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
  [GameStatus.Started]: tk.gameList.gameStatusLabels.started,
  [GameStatus.Staging]: tk.gameList.gameStatusLabels.staging,
  [GameStatus.Finished]: tk.gameList.gameStatusLabels.finished,
};

const GameList = () => {
  const { t } = useTranslation("common");
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
            <Tab value={"0"} label={t(tk.gameList.allGamesTab.label)} {...a11yProps("0")} />
            <Tab value={"1"} label={t(tk.gameList.myGamesTab.label)} {...a11yProps("1")} />
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
                      {t(gameStatusLabels[opt])}
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
                      label={t(tk.gameList.masteredGamesCheckbox.label) as string}
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
              <Typography>{tk.gameList.noGamesMessage}</Typography>
            )}
          </>
        )}
      </Container>
    </MainMenu>
  );
};

export default GameList;
