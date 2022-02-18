import { createAction } from "@reduxjs/toolkit";
import { CreateGameFormValues, SettingsFormValues } from "./types";

export enum PageName {
  CreateGame = "CreateGame",
  GamePlayersDialog = "GamePlayersDialog",
  StatsDialog = "StatsDialog",
}

const domain = "ui";

const pageLoad = createAction<{ pageName: PageName, data: any }>(`${domain}/pageLoad`);
const submitCreateGameForm = createAction<CreateGameFormValues>(
  `${domain}/submitCreateGameForm`
);
const resetUserSettings = createAction(`${domain}/resetUserSettings`);
const submitSettingsForm = createAction<SettingsFormValues>(
  `${domain}/submitSettingsForm`
);
const toggleBanned = createAction<string>(`${domain}/toggleBanned`)
const toggleMuted = createAction<string>(`${domain}/toggleMuted`)

export const actions = {
  pageLoad,
  resetUserSettings,
  submitCreateGameForm,
  submitSettingsForm,
  toggleBanned,
  toggleMuted,
};
