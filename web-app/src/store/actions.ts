import { createAction } from "@reduxjs/toolkit";
import { SettingsFormValues } from "./types";

export const parseUserConfigColors = createAction("userConfigColors/parse");
export const submitSettingsForm = createAction<SettingsFormValues>("settingsForm/submit");
export const resetUserSettings = createAction("settingsForm/resetUserSettings");
