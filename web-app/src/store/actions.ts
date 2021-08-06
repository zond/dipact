import { createAction } from "@reduxjs/toolkit";
import { SettingsFormSubmitValues } from "./types";

export const parseUserConfigColors = createAction("userConfigColors/parse");
export const submitSettingsForm =
	createAction<SettingsFormSubmitValues>("submitSettingsForm");
