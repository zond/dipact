import { createAction } from "@reduxjs/toolkit";
import { CreateGameFormValues, SettingsFormValues } from "./types";

export enum PageName {
  CreateGame = "CreateGame",
  NationPreferencesDialog = "NationPreferencesDialog",
  StatsDialog = "StatsDialog",
}

const domain = "ui";

const pageLoad = createAction<PageName>(`${domain}/pageLoad`);
const submitCreateGameForm = createAction<CreateGameFormValues>(
  `${domain}/submitCreateGameForm`
);
const submitCreateGameFormWithPreferences = createAction<{
  values: CreateGameFormValues;
  preferences: string[];
}>(`${domain}/submitCreateGameFormWithPreferences`);
const resetUserSettings = createAction(`${domain}/resetUserSettings`);
const submitSettingsForm = createAction<SettingsFormValues>(
  `${domain}/submitSettingsForm`
);

const clickProvince = createAction(`${domain}/clickProvince`);

export const actions = {
  clickProvince,
  pageLoad,
  resetUserSettings,
  submitCreateGameForm,
  submitCreateGameFormWithPreferences,
  submitSettingsForm,
};
