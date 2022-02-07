import { createAction } from "@reduxjs/toolkit";
import { CreateGameFormValues } from "./types";

export enum PageName {
  CreateGame = "CreateGame",
  StatsDialog = "StatsDialog",
}

const domain = "ui";

const pageLoad = createAction<PageName>(`${domain}/pageLoad`);
const submitCreateGameForm = createAction<CreateGameFormValues>(
  `${domain}/submitCreateGameForm`
);

export const actions = {
  pageLoad,
  submitCreateGameForm,
};
