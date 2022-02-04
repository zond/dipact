import { createAction } from "@reduxjs/toolkit";
import { CreateGameFormValues } from "./types";

export enum PageName {
  StatsDialog,
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
