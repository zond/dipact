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
import { useTranslation } from "react-i18next";
import tk from "../translations/translateKeys";

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

const Settings = (): React.ReactElement => {
  const { t } = useTranslation("common");
  const { setParam } = useSearchParams();

  const pushNotificationsDisabled = false;
  const pushNotificationsErrorNoToken = false;
  const pushNotificationsErrorNoPermission = false;
  const pushNotificationsErrorNotStarted = false;
  const pushNotificationsErrorFirebaseNotSupported = false;

  const emailNotificationsDisabled = false;

  const phaseDeadlineReminderDisabled = false;

  const colorNonSCsDisabled = false;

  const notificationErrorsVariant = "caption";

  const { variants, handleChange, values } = useSettings();
  const variantName = "Classical";
  const selectedVariant = variants[variantName];

  const onClickResetSettings = () => {
    setParam(resetSettingsSearchKey, "1");
  };

  const classes = useStyles();

  return (
    <GoBackNav title={t(tk.settings.title)}>
      <Container className={classes.root}>
        <Typography variant="subtitle2">
          {t(tk.settings.notificationsSection.label)}
        </Typography>
        <div className={classes.notificationSection}>
          <div>
            <FormControlLabel
              control={
                <Switch
                  disabled={pushNotificationsDisabled}
                  checked={values.enablePushNotifications}
                  onChange={handleChange}
                  name={"enablePushNotifications"}
                />
              }
              label={t(tk.settings.pushNotificationsSwitch.label) as string}
            />
            <List className={classes.notificationErrorList} disablePadding>
              {pushNotificationsErrorNoToken && (
                <ListItem disableGutters>
                  <Typography variant={notificationErrorsVariant}>
                    {t(tk.settings.errorNotifications.noToken)}
                  </Typography>
                </ListItem>
              )}
              {pushNotificationsErrorNoPermission && (
                <ListItem disableGutters>
                  <Typography variant={notificationErrorsVariant}>
                    {t(tk.settings.errorNotifications.noPermission)}
                  </Typography>
                  <a
                    target={"_blank"}
                    rel="noreferrer"
                    href={t(tk.settings.errorNotifications.infoLink)}
                  >
                    <Typography variant={notificationErrorsVariant}>
                      {t(tk.settings.errorNotifications.noPermissionPrompt)}
                    </Typography>
                  </a>
                </ListItem>
              )}
              {pushNotificationsErrorNotStarted && (
                <ListItem disableGutters>
                  <Typography variant={notificationErrorsVariant}>
                    {t(tk.settings.errorNotifications.messagingNotStarted)}
                  </Typography>
                </ListItem>
              )}
              {pushNotificationsErrorFirebaseNotSupported && (
                <ListItem disableGutters>
                  <Typography variant={notificationErrorsVariant}>
                    {t(tk.settings.errorNotifications.firebaseNotSupported)}
                  </Typography>
                </ListItem>
              )}
            </List>
          </div>
          <div>
            <FormControlLabel
              control={
                <Switch
                  disabled={emailNotificationsDisabled}
                  checked={values.enableEmailNotifications}
                  onChange={handleChange}
                  name={"enableEmailNotifications"}
                />
              }
              label={t(tk.settings.emailNotificationsSwitch.label) as string}
            />
          </div>
          <div>
            <TextField
              inputProps={{ min: 0 }}
              fullWidth
              disabled={phaseDeadlineReminderDisabled}
              type="number"
              value={values.phaseDeadline}
              onChange={handleChange}
              name="phaseDeadline"
              label={t(tk.settings.phaseDeadlineReminder.inputLabel) as string}
              helperText={
                phaseDeadlineReminderDisabled
                  ? t(tk.settings.phaseDeadlineReminder.helpText)
                  : t(tk.settings.phaseDeadlineReminder.notificationsPrompt)
              }
              margin="dense"
              // onChange={this.updatePhaseDeadline}
              // onBlur={this.saveConfig}
            />
          </div>
        </div>
        <Typography variant="subtitle2">
          {t(tk.settings.mapColorsSection.label)}
        </Typography>
        <div>
          <FormControlLabel
            control={
              <Switch
                checked={values.enableColorNonSCs}
                disabled={colorNonSCsDisabled}
                onChange={handleChange}
                name={"enableColorNonSCs"}
              />
            }
            label={t(tk.settings.colorNonSCsSwitch.label) as string}
          />
          <div>
            <Typography variant="caption">
              {t(tk.settings.colorNonSCsSwitch.helpText)}
            </Typography>
          </div>
        </div>
        <Typography variant="subtitle2">
          {t(tk.settings.mapColorsSection.label)}
        </Typography>
        <div>
          <FormControl variant="standard">
            <InputLabel id="variantinputlabel">
              {t(tk.settings.variantSelect.label)}
            </InputLabel>
            <Select labelId="variantinputlabel" value={variantName}>
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
                <div
                  key={`${variantName}-${name}`}
                  className={classes.nationColorRow}
                >
                  <Typography>{name}</Typography>
                  <div>
                    <input
                      type="color"
                      value={color}
                      onChange={handleChange}
                      name={`colors.${variantName}.${name}`}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
        <div>
          <Button onClick={onClickResetSettings}>
            {t(tk.settings.resetSettingsButton.label)}
          </Button>
        </div>
      </Container>
    </GoBackNav>
  );
};

export default Settings;
