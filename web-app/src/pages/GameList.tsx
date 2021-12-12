import {
  Checkbox,
  Container,
  Divider,
  FormControlLabel,
  FormGroup,
  MenuItem,
  Select,
  Tab,
  Tabs,
} from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import React from "react";
import ErrorMessage from "../components/ErrorMessage";
import GameCard from "../components/GameCard";
import Loading from "../components/Loading";
import MainMenu from "../components/MainMenu";
import useGameList, { GameStatus } from "../hooks/useGameList";
import useSearchParams from "../hooks/useSearchParams";

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
  }
}));

interface GameListProps {
  games?: any;
}

const gameStatusLabels = {
  [GameStatus.Started]: "Started games",
  [GameStatus.Staging]: "Open to join",
  [GameStatus.Finished]: "Finished games",
};

const ALL_GAMES_TAB_LABEL = "All games";
const MY_GAMES_TAB_LABEL = "My games";
const MANAGED_CHECKBOX_LABEL = "Managed by me";

const GameList = () => {
  const classes = useStyles();
  const { getParam, setParam } = useSearchParams();
  let status = getParam("status") as GameStatus;
  const my = getParam("my") || "0";
  const managed = getParam("managed") || "0";
  if (!(status && Object.values(GameStatus).includes(status))) {
    status = GameStatus.Started;
  }
  const {
    games,
    combinedQueryState: { isLoading, isError, error },
  } = useGameList(Boolean(parseInt(my)), status);

  const a11yProps = (index: string) => {
    return {
      id: `game-filter-tab-${index}`,
      "aria-controls": `game-filter-tabpanel-${index}`,
    };
  };

  const handleManagedCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const managed = e.target.checked ? "1" : "0";
    setParam("managed", managed);
  };

  if (isError) return <ErrorMessage error={error} />;

  return (
    <MainMenu>
      <Container>
        <Tabs
          defaultValue={"0"}
          value={my}
          onChange={(_, value: string) => setParam("my", value)}
          aria-label="games filter"
          className={classes.tabs}
        >
          <Tab value={"0"} label={ALL_GAMES_TAB_LABEL} {...a11yProps("0")} />
          <Tab value={"1"} label={MY_GAMES_TAB_LABEL} {...a11yProps("1")} />
        </Tabs>
        {isLoading ? (
          <Loading />
        ) : (
          <>
            <div className={classes.filters}>
              <Select value={status} label>
                {Object.values(GameStatus).map((status) => (
                  <MenuItem value={status}>{gameStatusLabels[status]}</MenuItem>
                ))}
              </Select>

              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={Boolean(parseInt(managed))}
                      onChange={handleManagedCheckboxChange}
                    />
                  }
                  label={MANAGED_CHECKBOX_LABEL}
                />
              </FormGroup>
            </div>
            {games.map((game) => (
              <div>
                <GameCard game={game} />
                <Divider light />
              </div>
            ))}
          </>
        )}
      </Container>
    </MainMenu>
  );
};

export default GameList;
