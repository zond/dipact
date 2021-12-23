import React from "react";

import {
  Container,
  List,
  ListItem,
  FormControlLabel,
  Switch,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Button,
} from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import GoBackNav from "../components/GoBackNav";
import { searchKey as resetSettingsSearchKey } from "../components/ResetSettingsDialog";
import useSearchParams from "../hooks/useSearchParams";
import useSettings from "../hooks/useSettings";

const useStyles = makeStyles((theme) => ({
  root: {
    "& h6": {
      padding: theme.spacing(1, 0),
    },
  },
  notificationSection: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(2),
  },
  notificationErrorList: {
    "& li": {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
    },
  },
  nationColorRow: {
    display: "flex",
    justifyContent: "space-between",
  },
}));

const TITLE = "Settings";
const NOTIFICATIONS_SECTION_LABEL = "Notifications";
const MAP_COLORS_SECTION_LABEL = "Map colours";
const COLOR_NON_SCS_SWITCH_LABEL = "Colour non-SC provinces";
const COLOR_NON_SCS_HELP_TEXT =
  "Colour provinces without supply centers based on the ownership of the supply centers around it.";
const NATION_COLORS_SECTION_LABEL = "Custom nation colours";
const PUSH_NOTIFICATIONS_SWITCH_LABEL = "Push notifications";
const EMAIL_NOTIFICATIONS_SWITCH_LABEL = "Email notifications";
const PHASE_DEADLINE_REMINDER_INPUT_LABEL = "Phase deadline reminder";
const PHASE_DEADLINE_REMINDER_HELP_TEXT = "In minutes. 0 = off";
const PHASE_DEADLINE_REMINDER_NOTIFICATIONS_PROMPT = "In minutes. 0 = off";
const VARIANT_SELECT_LABEL = "Variant";
const RESET_SETTINGS_BUTTON_LABEL = "Reset settings";

const NOTIFICATIONS_ERROR_NO_TOKEN =
  "Notifications disabled [Error: no token uploaded]";
const NOTIFICATIONS_ERROR_NO_PERMISSION =
  "No notification permission received.";
const NOTIFICATIONS_ERROR_NO_PERMISSION_PROMPT =
  "Allow this sites notifications in your browser settings.";
const NOTIFICATIONS_INFO_LINK =
  "Allow this sites notifications in your browser settings.";
const NOTIFICATIONS_ERROR_MESSAGING_NOT_STARTED =
  "Notifications disabled [Error: notification system did not start]";
const NOTIFICATIONS_ERROR_FIREBASE_NOT_SUPPORTED =
  "Notifications disabled [Error: Firebase Messaging not supported on your browser]";

const Settings = (): React.ReactElement => {
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

  const { variants } = useSettings();
  const selectedVariant = variants["Classical"];

  const onClickResetSettings = () => {
    setParam(resetSettingsSearchKey, "1");
  };

  const classes = useStyles();

  return (
    <GoBackNav title={TITLE}>
      <Container className={classes.root}>
        <Typography variant="subtitle2">
          {NOTIFICATIONS_SECTION_LABEL}
        </Typography>
        <div className={classes.notificationSection}>
          <div>
            <FormControlLabel
              control={
                <Switch
                  checked={pushNotificationsEnabled}
                  disabled={pushNotificationsDisabled}
                />
              }
              label={PUSH_NOTIFICATIONS_SWITCH_LABEL}
            />
            <List className={classes.notificationErrorList} disablePadding>
              {pushNotificationsErrorNoToken && (
                <ListItem disableGutters>
                  <Typography variant={notificationErrorsVariant}>
                    {NOTIFICATIONS_ERROR_NO_TOKEN}
                  </Typography>
                </ListItem>
              )}
              {pushNotificationsErrorNoPermission && (
                <ListItem disableGutters>
                  <Typography variant={notificationErrorsVariant}>
                    {NOTIFICATIONS_ERROR_NO_PERMISSION}
                  </Typography>
                  <a
                    target={"_blank"}
                    rel="noreferrer"
                    href={NOTIFICATIONS_INFO_LINK}
                  >
                    <Typography variant={notificationErrorsVariant}>
                      {NOTIFICATIONS_ERROR_NO_PERMISSION_PROMPT}
                    </Typography>
                  </a>
                </ListItem>
              )}
              {pushNotificationsErrorNotStarted && (
                <ListItem disableGutters>
                  <Typography variant={notificationErrorsVariant}>
                    {NOTIFICATIONS_ERROR_MESSAGING_NOT_STARTED}
                  </Typography>
                </ListItem>
              )}
              {pushNotificationsErrorFirebaseNotSupported && (
                <ListItem disableGutters>
                  <Typography variant={notificationErrorsVariant}>
                    {NOTIFICATIONS_ERROR_FIREBASE_NOT_SUPPORTED}
                  </Typography>
                </ListItem>
              )}
            </List>
          </div>
          <div>
            <FormControlLabel
              control={
                <Switch
                  checked={emailNotificationsEnabled}
                  disabled={emailNotificationsDisabled}
                />
              }
              label={EMAIL_NOTIFICATIONS_SWITCH_LABEL}
            />
          </div>
          <div>
            <TextField
              inputProps={{ min: 0 }}
              fullWidth
              disabled={phaseDeadlineReminderDisabled}
              type="number"
              label={PHASE_DEADLINE_REMINDER_INPUT_LABEL}
              helperText={
                phaseDeadlineReminderDisabled
                  ? PHASE_DEADLINE_REMINDER_HELP_TEXT
                  : PHASE_DEADLINE_REMINDER_NOTIFICATIONS_PROMPT
              }
              margin="dense"
              value={phaseDeadlineReminderValue}
              // onChange={this.updatePhaseDeadline}
              // onBlur={this.saveConfig}
            />
          </div>
        </div>
        <Typography variant="subtitle2">{MAP_COLORS_SECTION_LABEL}</Typography>
        <div>
          <FormControlLabel
            control={
              <Switch
                checked={colorNonSCsEnabled}
                disabled={colorNonSCsDisabled}
              />
            }
            label={COLOR_NON_SCS_SWITCH_LABEL}
          />
          <div>
            <Typography variant="caption">{COLOR_NON_SCS_HELP_TEXT}</Typography>
          </div>
        </div>
        <Typography variant="subtitle2">
          {NATION_COLORS_SECTION_LABEL}
        </Typography>
        <div>
          <FormControl>
            <InputLabel id="variantinputlabel">
              {VARIANT_SELECT_LABEL}
            </InputLabel>
            <Select labelId="variantinputlabel" value={selectedVariant}>
              {Object.keys(variants).map((variant) => {
                return (
                  <MenuItem key={variant} value={variant}>
                    {variant}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <div>
            {selectedVariant &&
              Object.entries(selectedVariant).map(([name, color]) => (
                <div className={classes.nationColorRow}>
                  <Typography>{name}</Typography>
                  <div>
                    <input type="color" value={color} />
                  </div>
                </div>
              ))}
          </div>
        </div>
        <div>
          <Button onClick={onClickResetSettings}>
            {RESET_SETTINGS_BUTTON_LABEL}
          </Button>
        </div>
      </Container>
    </GoBackNav>
  );
};

export default Settings;
