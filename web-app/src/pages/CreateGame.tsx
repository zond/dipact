import React, { useState } from "react";

import {
  Container,
  List,
  ListItem,
  FormControlLabel,
  Switch,
  Typography,
  TextField,
  IconButton,
  Checkbox,
  FormGroup,
} from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import GoBackNav from "../components/GoBackNav";
import useSearchParams from "../hooks/useSearchParams";
import { randomGameName } from "../helpers";
import { RandomGameNameIcon } from "../icons";

const useStyles = makeStyles((theme) => ({
  root: {
    "& h6": {
      padding: theme.spacing(1, 0),
    },
  },
  nameInputContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    "& > div": {
      width: "100%",
    },
  },
}));

const TITLE = "Create game";
const NAME_INPUT_LABEL = "Name";
const PRIVATE_CHECKBOX_LABEL = "Private";
const GAME_MASTER_CHECKBOX_LABEL = "Manage as Game Master";

const CreateGame = (): React.ReactElement => {
  const { setParam } = useSearchParams();

  const pushNotificationsEnabled = true;
  const pushNotificationsDisabled = false;
  const pushNotificationsErrorNoToken = true;
  const pushNotificationsErrorNoPermission = true;
  const pushNotificationsErrorNotStarted = true;
  const pushNotificationsErrorFirebaseNotSupported = true;

  const emailNotificationsEnabled = true;
  const emailNotificationsDisabled = false;

  const phaseDeadlineReminderDisabled = false;
  const phaseDeadlineReminderValue = 60;

  const colorNonSCsEnabled = true;
  const colorNonSCsDisabled = false;

  const notificationErrorsVariant = "caption";

  const selectedVariant = "Classical";

  // const { variants } = useSettings();

  const [name, setName] = useState(randomGameName());
  const [privateGame, setPrivateGame] = useState(false);
  const [gameMaster, setGameMaster] = useState(false);

  const classes = useStyles();

  return (
    <GoBackNav title={TITLE}>
      <Container className={classes.root}>
        <div>
          <div className={classes.nameInputContainer}>
            <TextField
              variant="standard"
              label={NAME_INPUT_LABEL}
              margin="dense"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <IconButton onClick={() => setName(randomGameName())} size="large">
              <RandomGameNameIcon />
            </IconButton>
          </div>
        </div>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={privateGame}
                onChange={() => setPrivateGame(!privateGame)}
              />
            }
            label={PRIVATE_CHECKBOX_LABEL}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={gameMaster}
                onChange={() => setGameMaster(!privateGame)}
              />
            }
            label={GAME_MASTER_CHECKBOX_LABEL}
          />
        </FormGroup>
      </Container>
    </GoBackNav>
  );
};

export default CreateGame;
